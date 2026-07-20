import { graphql } from '../politigraph/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.hoisted(() => {
	process.env.POLITIGRAPH_CACHE_TTL_SECONDS = '1';
});

vi.mock('../politigraph/genql', () => ({
	generateQueryOp: (param: Record<string, unknown>) => ({
		query: JSON.stringify(param),
		variables: param
	})
}));

const mockResponse = (data: unknown) =>
	({
		ok: true,
		json: vi.fn().mockResolvedValueOnce([{ data }])
	}) as never;

describe('graphql query cache', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.stubGlobal('fetch', vi.fn());
	});

	afterEach(() => {
		vi.clearAllTimers();
		vi.useRealTimers();
		vi.unstubAllGlobals();
	});

	it('deduplicates concurrent identical queries into a single upstream call', async () => {
		const fetchMock = vi.mocked(fetch);
		fetchMock.mockResolvedValueOnce(mockResponse({ bills: [{ id: '1' }] }));

		const first = graphql.query({ bills: { id: true } });
		const second = graphql.query({ bills: { id: true } });

		await vi.advanceTimersByTimeAsync(200);

		expect(await first).toEqual({ bills: [{ id: '1' }] });
		expect(await second).toEqual({ bills: [{ id: '1' }] });
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('serves fresh entries from cache without an upstream call', async () => {
		const fetchMock = vi.mocked(fetch);
		fetchMock.mockResolvedValueOnce(mockResponse({ people: [{ id: '1' }] }));

		const first = graphql.query({ people: { id: true } });
		await vi.advanceTimersByTimeAsync(200);
		expect(await first).toEqual({ people: [{ id: '1' }] });

		expect(await graphql.query({ people: { id: true } })).toEqual({ people: [{ id: '1' }] });
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('serves the stale value when a background refresh fails', async () => {
		const fetchMock = vi.mocked(fetch);
		fetchMock.mockResolvedValueOnce(mockResponse({ voteEvents: [{ id: '1' }] }));

		const first = graphql.query({ voteEvents: { id: true } });
		await vi.advanceTimersByTimeAsync(200);
		expect(await first).toEqual({ voteEvents: [{ id: '1' }] });

		// pass the 1s TTL so the entry is stale, then fail the refresh
		await vi.advanceTimersByTimeAsync(1500);
		fetchMock.mockRejectedValue(new Error('politigraph down'));

		const staleHit = graphql.query({ voteEvents: { id: true } });
		await vi.advanceTimersByTimeAsync(200);
		expect(await staleHit).toEqual({ voteEvents: [{ id: '1' }] });
	});
});
