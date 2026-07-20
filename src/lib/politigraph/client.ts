import { generateQueryOp, type Client } from './genql';
import { LRUCache } from 'lru-cache';
import { createHash } from 'node:crypto';

const GRAPHQL_URL = process.env.POLITIGRAPH_URL || 'https://politigraph.wevis.info/graphql';

const RATE_LIMIT = Number(process.env.POLITIGRAPH_REQUEST_PER_SECOND) || 3;

const CACHE_TTL_SECONDS = Number(process.env.POLITIGRAPH_CACHE_TTL_SECONDS ?? 900);
const CACHE_MAX_ENTRIES = Number(process.env.POLITIGRAPH_CACHE_MAX_ENTRIES) || 500;

const INTERVAL_MS = 1000;
const BATCH_TIMEOUT_MS = 200;
const MAX_BATCH_SIZE = 5;

interface QueuedQuery {
	query: string;
	variables?: Record<string, unknown>;
	resolve: (value: unknown) => void;
	reject: (reason?: unknown) => void;
}

const requestQueue: Array<QueuedQuery> = [];
let processedInCurrentWindow = 0;
let intervalId: ReturnType<typeof setInterval> | null = null;
let batchTimeoutId: ReturnType<typeof setTimeout> | null = null;

function startInterval() {
	if (intervalId) return;
	intervalId = setInterval(() => {
		processedInCurrentWindow = 0;
		processQueue(true);
	}, INTERVAL_MS);
}

function processQueue(force = false): boolean {
	while (processedInCurrentWindow < RATE_LIMIT && requestQueue.length > 0) {
		if (requestQueue.length >= MAX_BATCH_SIZE || (force && requestQueue.length > 0)) {
			const batch: QueuedQuery[] = [];
			let batchSize = 0;

			while (batchSize < MAX_BATCH_SIZE && requestQueue.length > 0) {
				batch.push(requestQueue.shift() as QueuedQuery);
				batchSize++;
			}

			if (batch.length > 0) {
				void executeBatch(batch);
				processedInCurrentWindow++;
			}
		} else {
			break;
		}
	}

	if (requestQueue.length === 0 && intervalId) {
		clearInterval(intervalId as unknown as number);
		intervalId = null;
	}

	return requestQueue.length > 0;
}

function scheduleBatchTimeout() {
	if (batchTimeoutId) return;
	batchTimeoutId = setTimeout(() => {
		batchTimeoutId = null;
		processQueue(true);
	}, BATCH_TIMEOUT_MS);
}

async function executeBatch(batch: QueuedQuery[]) {
	const queries = batch.map((q) => ({ query: q.query, variables: q.variables }));

	try {
		const response = await fetch(GRAPHQL_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(queries)
		});

		if (!response.ok) {
			throw new Error(`GraphQL request failed: ${response.status} ${response.statusText}`);
		}

		const result = await response.json();

		if (!Array.isArray(result)) {
			throw new Error('GraphQL batch response must be an array');
		}

		batch.forEach((q, index) => {
			const item = result[index];

			if (!item) {
				q.reject(new Error(`Missing GraphQL batch response for request ${index + 1}`));
				return;
			}

			if (Array.isArray(item.errors) && item.errors.length > 0) {
				q.reject(
					new Error(
						item.errors
							.map((e: { message?: string }) => e.message ?? 'Unknown GraphQL error')
							.join(', ')
					)
				);
				return;
			}

			q.resolve(item.data);
		});
	} catch (error) {
		batch.forEach((q) => q.reject(error));
	}
}

function executeQuery(op: Pick<QueuedQuery, 'query' | 'variables'>): Promise<unknown> {
	return new Promise((resolve, reject) => {
		requestQueue.push({ ...op, resolve, reject });
		startInterval();
		if (processQueue()) {
			scheduleBatchTimeout();
		}
	});
}

/**
 * Stale-while-revalidate result cache in front of the rate-limited queue.
 * A stale hit returns immediately while refetching in the background;
 * concurrent identical queries share a single upstream request; when
 * politigraph errors, the last good value is served instead.
 */
const queryCache = new LRUCache<string, object, Pick<QueuedQuery, 'query' | 'variables'>>({
	max: CACHE_MAX_ENTRIES,
	ttl: CACHE_TTL_SECONDS * 1000,
	allowStale: true,
	allowStaleOnFetchRejection: true,
	allowStaleOnFetchAbort: true,
	ignoreFetchAbort: true,
	noDeleteOnFetchRejection: true,
	fetchMethod: (_key, _staleValue, { context }) => executeQuery(context) as Promise<object>
});

export const graphql: Pick<Client, 'query'> = {
	query: async (param) => {
		const op = generateQueryOp(param);

		if (CACHE_TTL_SECONDS <= 0) {
			return executeQuery(op) as never;
		}

		const key = createHash('sha1').update(JSON.stringify(op)).digest('hex');

		return (await queryCache.fetch(key, { context: op })) as never;
	}
};
