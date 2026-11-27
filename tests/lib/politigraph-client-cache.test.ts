import { graphql } from '$lib/politigraph/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.hoisted(() => {
	process.env.POLITIGRAPH_CACHE_TTL_SECONDS = '1';
});

vi.mock('$lib/politigraph/genql', () => ({
	generateQueryOp: (param: Record<string, unknown>) => ({
		query: JSON.stringify(param),
		variables: param
	})
}));

// lru-cache keeps the real `performance` from module load, out of reach of fake timers
const realPerformance = globalThis.performance;

const DEFAULT_TIMEOUT_MS = 20_000;

const hangUntilAborted = (_url: unknown, init?: RequestInit) =>
	new Promise<never>((_, reject) =>
		init?.signal?.addEventListener('abort', () => reject(init.signal?.reason))
	);

const mockResponse = (data: unknown) =>
	({
		ok: true,
		json: vi.fn().mockResolvedValueOnce([{ data }])
	}) as never;

describe('graphql query cache', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.spyOn(realPerformance, 'now').mockImplementation(() => Date.now());
		vi.stubGlobal('fetch', vi.fn());
	});

	afterEach(async () => {
		// let lru-cache's 1ms clock debounce reset, or its cached time freezes
		await vi.advanceTimersByTimeAsync(1);
		vi.clearAllTimers();
		vi.useRealTimers();
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
	});

	it('deduplicates concurrent identical queries into a single upstream call', async () => {
		const fetchMock = vi.mocked(fetch);
		fetchMock.mockResolvedValueOnce(mockResponse({ bills: [{ id: '1' }] }));

		const first = graphql.query({ __name: 'Test', bills: { id: true } });
		const second = graphql.query({ __name: 'Test', bills: { id: true } });

		await vi.advanceTimersByTimeAsync(200);

		expect(await first).toEqual({ bills: [{ id: '1' }] });
		expect(await second).toEqual({ bills: [{ id: '1' }] });
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('serves fresh entries from cache without an upstream call', async () => {
		const fetchMock = vi.mocked(fetch);
		fetchMock.mockResolvedValueOnce(mockResponse({ people: [{ id: '1' }] }));

		const first = graphql.query({ __name: 'Test', people: { id: true } });
		await vi.advanceTimersByTimeAsync(200);
		expect(await first).toEqual({ people: [{ id: '1' }] });

		expect(await graphql.query({ __name: 'Test', people: { id: true } })).toEqual({
			people: [{ id: '1' }]
		});
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('serves the stale value when a background refresh fails', async () => {
		const fetchMock = vi.mocked(fetch);
		fetchMock.mockResolvedValueOnce(mockResponse({ voteEvents: [{ id: '1' }] }));

		const first = graphql.query({ __name: 'Test', voteEvents: { id: true } });
		await vi.advanceTimersByTimeAsync(200);
		expect(await first).toEqual({ voteEvents: [{ id: '1' }] });

		// pass the 1s TTL so the entry is stale, then fail the refresh
		await vi.advanceTimersByTimeAsync(1500);
		fetchMock.mockRejectedValue(new Error('politigraph down'));

		const staleHit = graphql.query({ __name: 'Test', voteEvents: { id: true } });
		await vi.advanceTimersByTimeAsync(200);
		expect(await staleHit).toEqual({ voteEvents: [{ id: '1' }] });
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});

	it('keeps serving the stale value when a refresh times out', async () => {
		const fetchMock = vi.mocked(fetch);
		fetchMock.mockResolvedValueOnce(mockResponse({ organizations: [{ id: '1' }] }));

		const first = graphql.query({ __name: 'Test', organizations: { id: true } });
		await vi.advanceTimersByTimeAsync(200);
		expect(await first).toEqual({ organizations: [{ id: '1' }] });

		await vi.advanceTimersByTimeAsync(1500);
		fetchMock.mockImplementation(hangUntilAborted);

		expect(await graphql.query({ __name: 'Test', organizations: { id: true } })).toEqual({
			organizations: [{ id: '1' }]
		});
		await vi.advanceTimersByTimeAsync(200);
		expect(fetchMock).toHaveBeenCalledTimes(2);

		await vi.advanceTimersByTimeAsync(DEFAULT_TIMEOUT_MS);

		expect(await graphql.query({ __name: 'Test', organizations: { id: true } })).toEqual({
			organizations: [{ id: '1' }]
		});
		await vi.advanceTimersByTimeAsync(200);
		expect(fetchMock).toHaveBeenCalledTimes(3);

		await vi.advanceTimersByTimeAsync(DEFAULT_TIMEOUT_MS);
	});

	it('rejects with the upstream error when nothing is cached', async () => {
		vi.mocked(fetch).mockResolvedValueOnce({
			ok: true,
			json: vi.fn().mockResolvedValueOnce([{ errors: [{ message: 'GitHub responded 403' }] }])
		} as never);

		const result = graphql.query({ __name: 'Test', posts: { id: true } });
		const assertion = expect(result).rejects.toThrow('GitHub responded 403');
		await vi.advanceTimersByTimeAsync(200);
		await assertion;
	});
});
