import { fetchExternalPoliticianRanking } from '$lib/politician-ranking';
import { getPoliticianWithMostViewLastMonth } from '$lib/politician-ranking/wikipedia';
import { afterEach, describe, expect, it, vi } from 'vitest';

function mockFetch(handler: (url: string) => { ok: boolean; body?: unknown }) {
	const fetchMock = vi.fn(async (url: string | URL) => {
		const { ok, body } = handler(url.toString());
		return {
			ok,
			status: ok ? 200 : 404,
			statusText: ok ? 'OK' : 'Not Found',
			json: async () => body
		};
	});

	vi.stubGlobal('fetch', fetchMock);

	return fetchMock;
}

function viewsResponse(views: number) {
	return { ok: true, body: { items: [{ views }] } };
}

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('getPoliticianWithMostViewLastMonth', () => {
	const politicians = Array.from({ length: 25 }, (_, index) => ({
		id: `id-${index}`,
		name: `name ${index}`
	}));

	it('returns the politician with the most views across all batches', async () => {
		mockFetch((url) => viewsResponse(url.includes('name_17') ? 999 : 1));

		expect(await getPoliticianWithMostViewLastMonth(politicians)).toEqual({
			id: 'id-17',
			name: 'name 17',
			value: 999
		});
	});

	it('fetches every politician exactly once', async () => {
		const fetchMock = mockFetch(() => viewsResponse(1));

		await getPoliticianWithMostViewLastMonth(politicians);

		expect(fetchMock).toHaveBeenCalledTimes(politicians.length);
	});

	it('fetches in parallel batches of at most 10', async () => {
		const inFlight = { current: 0, peak: 0 };
		vi.stubGlobal('fetch', async () => {
			inFlight.current += 1;
			inFlight.peak = Math.max(inFlight.peak, inFlight.current);
			await new Promise((resolve) => setTimeout(resolve, 1));
			inFlight.current -= 1;
			return { ok: true, json: async () => ({ items: [{ views: 1 }] }) };
		});

		await getPoliticianWithMostViewLastMonth(politicians);

		expect(inFlight.peak).toBeGreaterThan(1);
		expect(inFlight.peak).toBeLessThanOrEqual(10);
	});

	it('does not memoize results between calls', async () => {
		mockFetch((url) => viewsResponse(url.includes('name_1/') ? 5 : 1));
		const first = await getPoliticianWithMostViewLastMonth(politicians);

		mockFetch((url) => viewsResponse(url.includes('name_2/') ? 5 : 1));
		const second = await getPoliticianWithMostViewLastMonth(politicians);

		expect(first.id).toBe('id-1');
		expect(second.id).toBe('id-2');
	});

	it('skips failed responses and pages without view data', async () => {
		mockFetch((url) =>
			url.includes('name_0/')
				? { ok: false }
				: url.includes('name_1/')
					? { ok: true, body: { items: [] } }
					: viewsResponse(3)
		);

		const result = await getPoliticianWithMostViewLastMonth(politicians.slice(0, 3));

		expect(result).toMatchObject({ id: 'id-2', value: 3 });
	});

	it('encodes article names with url-unsafe characters', async () => {
		const fetchMock = mockFetch(() => viewsResponse(1));

		await getPoliticianWithMostViewLastMonth([{ id: 'a', name: 'ก/ข ค&ง' }]);

		expect(fetchMock.mock.calls[0][0]).toContain('/th.wikipedia/all-access/all-agents/%E');
		expect(fetchMock.mock.calls[0][0]).not.toContain('ก/ข');
	});

	it('throws an Error when no politician page is found', async () => {
		mockFetch(() => ({ ok: false }));

		await expect(getPoliticianWithMostViewLastMonth(politicians)).rejects.toThrow(
			'Could not find any politicians page on wikipedia'
		);
	});
});

describe('fetchExternalPoliticianRanking', () => {
	const politicianWithMostWikipediaVisit = {
		id: 'id-1',
		name: 'สมชาย',
		value: 42,
		avatar: '/images/politicians/_placeholder.webp',
		label: 'สส.',
		partyName: 'พรรค',
		partyLogo: '/images/parties/_placeholder.webp'
	};

	it('parses updatedAt into a Date', async () => {
		mockFetch(() => ({
			ok: true,
			body: { politicianWithMostWikipediaVisit, updatedAt: '2026-07-01T00:00:00.000Z' }
		}));

		const ranking = await fetchExternalPoliticianRanking();

		expect(ranking.updatedAt).toBeInstanceOf(Date);
		expect(ranking.updatedAt.toISOString()).toBe('2026-07-01T00:00:00.000Z');
		expect(ranking.politicianWithMostWikipediaVisit).toEqual(politicianWithMostWikipediaVisit);
	});

	it('throws an Error on a malformed payload', async () => {
		mockFetch(() => ({
			ok: true,
			body: { politicianWithMostWikipediaVisit, updatedAt: 'ไม่ใช่วันที่' }
		}));
		await expect(fetchExternalPoliticianRanking()).rejects.toThrow('Malformed');

		mockFetch(() => ({ ok: true, body: { updatedAt: '2026-07-01T00:00:00.000Z' } }));
		await expect(fetchExternalPoliticianRanking()).rejects.toThrow('Malformed');
	});

	it('throws an Error when the file cannot be fetched', async () => {
		mockFetch(() => ({ ok: false }));

		await expect(fetchExternalPoliticianRanking()).rejects.toThrow('Not Found');
	});
});
