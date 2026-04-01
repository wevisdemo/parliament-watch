import { graphql } from '../politigraph/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$env/static/private', () => ({
	POLITIGRAPH_URL: 'http://test/graphql',
	POLITIGRAPH_REQUEST_PER_SECOND: 3
}));

vi.mock('../politigraph/genql', () => ({
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
});
