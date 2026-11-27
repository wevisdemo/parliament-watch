import { graphql } from '$lib/politigraph/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.hoisted(() => {
	// exercise the batching queue directly, without the result cache
	process.env.POLITIGRAPH_CACHE_TTL_SECONDS = '0';
});

const TIMEOUT_MS = 20_000;

const hangUntilAborted = (_url: unknown, init?: RequestInit) =>
	new Promise<never>((_, reject) =>
		init?.signal?.addEventListener('abort', () => reject(init.signal?.reason))
	);

const queryBatches = (count: number) =>
	Array.from({ length: count * 5 }, (_, i) => graphql.query({ bills: { id: true, i } } as never));

vi.mock('$env/static/private', () => ({
	POLITIGRAPH_URL: 'http://test/graphql',
	POLITIGRAPH_REQUEST_PER_SECOND: 3
}));

vi.mock('$lib/politigraph/genql', () => ({
	generateQueryOp: (param: Record<string, unknown>) => ({
		query: JSON.stringify(param),
		variables: param
	})
}));

describe('graphql batching client', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.stubGlobal('fetch', vi.fn());
	});

	afterEach(() => {
		vi.clearAllTimers();
		vi.useRealTimers();
		vi.unstubAllGlobals();
	});

	it('rejects queued queries when fetch fails', async () => {
		const fetchMock = vi.mocked(fetch);
		fetchMock.mockRejectedValueOnce(new Error('network down'));

		const request = graphql.query({ bills: { id: true } });
		const assertion = expect(request).rejects.toThrow('network down');

		await vi.advanceTimersByTimeAsync(200);

		await assertion;
	});

	it('rejects queued queries when the response cannot be parsed', async () => {
		const fetchMock = vi.mocked(fetch);
		fetchMock.mockResolvedValueOnce({
			ok: true,
			json: vi.fn().mockRejectedValueOnce(new Error('invalid json'))
		} as never);

		const request = graphql.query({ bills: { id: true } });
		const assertion = expect(request).rejects.toThrow('invalid json');

		await vi.advanceTimersByTimeAsync(200);

		await assertion;
	});

	it('rejects only the batched query that returns GraphQL errors', async () => {
		const fetchMock = vi.mocked(fetch);
		fetchMock.mockResolvedValueOnce({
			ok: true,
			json: vi
				.fn()
				.mockResolvedValueOnce([
					{ data: { bills: [{ id: '1' }] } },
					{ errors: [{ message: 'boom' }] }
				])
		} as never);

		const success = graphql.query({ bills: { id: true } });
		const failure = graphql.query({ people: { id: true } });
		const successAssertion = expect(success).resolves.toEqual({ bills: [{ id: '1' }] });
		const failureAssertion = expect(failure).rejects.toThrow('boom');

		await vi.advanceTimersByTimeAsync(200);

		await Promise.all([successAssertion, failureAssertion]);
	});

	it('caps batches in flight and expires queued ones unsent when upstream never answers', async () => {
		const fetchMock = vi.mocked(fetch);
		fetchMock.mockImplementation(hangUntilAborted);

		const settled = Promise.allSettled(queryBatches(4));

		await vi.advanceTimersByTimeAsync(TIMEOUT_MS - 1);
		expect(fetchMock).toHaveBeenCalledTimes(2);

		await vi.advanceTimersByTimeAsync(TIMEOUT_MS * 2);
		expect((await settled).slice(10)).toEqual(
			Array(10).fill({
				status: 'rejected',
				reason: new Error(`Politigraph request queued too long (over ${TIMEOUT_MS} ms)`)
			})
		);
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});

	it('rejects a hung request after the timeout and reuses its slot', async () => {
		const fetchMock = vi.mocked(fetch);
		fetchMock
			.mockImplementationOnce(hangUntilAborted)
			.mockImplementationOnce(hangUntilAborted)
			.mockResolvedValueOnce({
				ok: true,
				json: vi.fn().mockResolvedValueOnce(Array(5).fill({ data: { bills: [] } }))
			} as never);

		const hung = queryBatches(2);
		await vi.advanceTimersByTimeAsync(TIMEOUT_MS / 2);
		const settled = Promise.allSettled([...hung, ...queryBatches(1)]);

		await vi.advanceTimersByTimeAsync(TIMEOUT_MS / 2 - 1);
		expect(fetchMock).toHaveBeenCalledTimes(2);

		await vi.advanceTimersByTimeAsync(1);
		expect(fetchMock).toHaveBeenCalledTimes(3);

		const results = await settled;
		expect(results.slice(0, 10)).toEqual(
			Array(10).fill({
				status: 'rejected',
				reason: new Error(`Politigraph request timed out after ${TIMEOUT_MS} ms`)
			})
		);
		expect(results.slice(10)).toEqual(Array(5).fill({ status: 'fulfilled', value: { bills: [] } }));
	});
});
