import { graphql } from '$lib/politigraph/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.hoisted(() => {
	process.env.POLITIGRAPH_CACHE_TTL_SECONDS = '3600';
});

vi.mock('$lib/politigraph/genql', () => ({
	generateQueryOp: (param: Record<string, unknown>) => ({
		query: JSON.stringify(param),
		variables: param
	})
}));

// lru-cache keeps the real `performance` from module load, out of reach of fake timers
const realPerformance = globalThis.performance;

const CHECK_INTERVAL_MS = 5 * 60 * 1000;

let lastNodeUpdatedAt = '2026-11-27T00:00:00Z';
let billTitle = 'old';

const politigraph = vi.fn(async (_url: unknown, init?: RequestInit) => {
	const batch = JSON.parse(String(init?.body)) as { query: string }[];
	return {
		ok: true,
		json: async () =>
			batch.map(({ query }) => ({
				data: query.includes('timestamps')
					? { timestamps: { lastNodeUpdatedAt } }
					: { bills: [{ title: billTitle }] }
			}))
	} as never;
});

const queryBill = async () => {
	const result = graphql.query({ __name: 'Test', bills: { title: true } });
	await vi.advanceTimersByTimeAsync(200);
	return (await result).bills[0].title;
};

const billFetches = () =>
	politigraph.mock.calls
		.flatMap(([, init]) => JSON.parse(String(init?.body)) as { query: string }[])
		.filter(({ query }) => !query.includes('timestamps')).length;

describe('graphql cache refresh on politigraph data change', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.spyOn(realPerformance, 'now').mockImplementation(() => Date.now());
		vi.stubGlobal('fetch', politigraph);
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
	});

	it('keeps serving the cache until lastNodeUpdatedAt changes, then refreshes it', async () => {
		expect(await queryBill()).toBe('old');

		billTitle = 'new';
		await vi.advanceTimersByTimeAsync(CHECK_INTERVAL_MS);
		expect(await queryBill()).toBe('old');
		await vi.advanceTimersByTimeAsync(CHECK_INTERVAL_MS);
		expect(await queryBill()).toBe('old');
		expect(billFetches()).toBe(1);

		lastNodeUpdatedAt = '2026-11-27T01:00:00Z';
		await vi.advanceTimersByTimeAsync(CHECK_INTERVAL_MS);
		expect(await queryBill()).toBe('old');

		expect(await queryBill()).toBe('old');
		expect(await queryBill()).toBe('new');
		expect(billFetches()).toBe(2);
	});
});
