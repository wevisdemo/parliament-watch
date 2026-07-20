/**
 * Black-box journey smoke test against a running server. Covers every route
 * family, redirect, content type, and 404 behavior. Not hermetic: the server
 * must reach politigraph, and real ids are discovered from live endpoints.
 *
 *   E2E_BASE_URL=https://pwstaging.wevis.info pnpm run test:e2e
 *
 * (Named E2E_BASE_URL because BASE_URL is a Vite built-in that vitest
 * overrides with the app base path.)
 */
import { describe, expect, it } from 'vitest';

const BASE_URL = (process.env.E2E_BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

const get = (path: string) =>
	fetch(`${BASE_URL}${path}`, { redirect: 'manual', signal: AbortSignal.timeout(20_000) });

const getLocation = async (path: string) =>
	decodeURIComponent((await get(path)).headers.get('location') ?? '');

const expectPage = async (path: string, contentType: string) => {
	const res = await get(path);
	expect(res.status, path).toBe(200);
	expect(res.headers.get('content-type'), path).toContain(contentType);
	return res;
};

const fetchIndex = async (category: string) =>
	(await (await get(`/files/search-indexes/${category}.json`)).json()) as { id: string }[];

const [politicianId, votingId, billId] = (
	await Promise.all([fetchIndex('politicians'), fetchIndex('votings'), fetchIndex('bills')])
).map((index) => index[0].id);

const billsTermPath = await getLocation('/bills');
const assemblies = Object.fromEntries(
	await Promise.all(
		['representative', 'senate', 'cabinet'].map(async (classification) => [
			classification,
			(await getLocation(`/assemblies/latest/${classification}`)).replace('/assemblies/', '')
		])
	)
) as Record<'representative' | 'senate' | 'cabinet', string>;
const repAssemblyId = assemblies.representative;

describe('redirects', () => {
	it('/bills → latest term', async () => {
		const res = await get('/bills');
		expect(res.status).toBe(301);
		expect(decodeURIComponent(res.headers.get('location') ?? '')).toMatch(/^\/bills\/term\/./);
	});

	it.each(['representative', 'senate', 'cabinet'])('/assemblies/latest/%s', async (c) => {
		const res = await get(`/assemblies/latest/${c}`);
		expect(res.status).toBe(307);
		expect(decodeURIComponent(res.headers.get('location') ?? '')).toMatch(/^\/assemblies\/./);
	});

	it('/assemblies/latest/representative/votes', async () => {
		const res = await get('/assemblies/latest/representative/votes');
		expect(res.status).toBe(307);
		expect(decodeURIComponent(res.headers.get('location') ?? '')).toMatch(
			/^\/assemblies\/.+\/votes$/
		);
	});
});

describe('journey: home → assembly → members/votes/changes', () => {
	it('home', async () => {
		const res = await expectPage('/', 'text/html');
		expect(await res.text()).toContain('</html>');
	});

	it.each(Object.entries(assemblies))('assembly summary (%s)', async (_, id) => {
		await expectPage(`/assemblies/${encodeURIComponent(id)}`, 'text/html');
	});

	it.each(['party', 'province', 'sex', 'age', 'education'])('members by %s', async (groupby) => {
		await expectPage(
			`/assemblies/${encodeURIComponent(repAssemblyId)}/members/${groupby}`,
			'text/html'
		);
	});

	it('members by appointment-method (senate)', () =>
		expectPage(
			`/assemblies/${encodeURIComponent(assemblies.senate)}/members/appointment-method`,
			'text/html'
		));

	it('assembly votes', () =>
		expectPage(`/assemblies/${encodeURIComponent(repAssemblyId)}/votes`, 'text/html'));

	it('assembly changes', () =>
		expectPage(`/assemblies/${encodeURIComponent(repAssemblyId)}/changes`, 'text/html'));
});

describe('journey: voting detail', () => {
	it('voting detail', () => expectPage(`/votings/${encodeURIComponent(votingId)}`, 'text/html'));
	it('voting votes', () =>
		expectPage(`/votings/${encodeURIComponent(votingId)}/votes`, 'text/html'));
});

describe('journey: bills', () => {
	it('bills by term', () => expectPage(billsTermPath, 'text/html'));
	it('bill detail', () => expectPage(`/bills/${encodeURIComponent(billId)}`, 'text/html'));
	it('bills explore', () => expectPage('/bills/explore', 'text/html'));
});

describe('journey: politician', () => {
	it('politician detail', () =>
		expectPage(`/politicians/${encodeURIComponent(politicianId)}`, 'text/html'));
	it('politician votes', () =>
		expectPage(`/politicians/${encodeURIComponent(politicianId)}/votes`, 'text/html'));
});

describe('static pages', () => {
	it('about', () => expectPage('/about', 'text/html'));
	it('legislative process', () => expectPage('/legislative-process', 'text/html'));
});

describe('client-fetched assets', () => {
	it.each(['politicians', 'bills', 'votings', 'billProposers'])(
		'search index: %s',
		async (category) => {
			const res = await expectPage(`/files/search-indexes/${category}.json`, 'application/json');
			expect(Array.isArray(await res.json())).toBe(true);
		}
	);

	it.each(['all', 'passed', 'failed'])('vote-event overview: %s', async (status) => {
		await expectPage(`/files/vote-event-overview/${status}.json`, 'application/json');
	});

	it('bills overview (all categories)', () => {
		const repTermId = billsTermPath.replace('/bills/term/', '');
		return expectPage(
			`/files/bills-overview/${encodeURIComponent(repTermId)}/${encodeURIComponent('ทุกหมวด')}.json`,
			'application/json'
		);
	});
});

describe('csv downloads', () => {
	const expectCsv = async (path: string) => {
		const res = await expectPage(path, 'text/csv');
		const text = await res.text();
		expect(text.trim().length, path).toBeGreaterThan(0);
		expect(text, path).toContain(',');
	};

	it('all bills', () => expectCsv('/files/download/bills.csv'));
	it('assembly members', () =>
		expectCsv(`/files/download/assemblies/${encodeURIComponent(repAssemblyId)}-members.csv`));
	it('assembly votings', () =>
		expectCsv(`/files/download/assemblies/${encodeURIComponent(repAssemblyId)}-votings.csv`));
	it('politician votes', () =>
		expectCsv(`/files/download/politicians/${encodeURIComponent(politicianId)}-votes.csv`));
	it('voting votes', () =>
		expectCsv(`/files/download/votings/voting-${encodeURIComponent(votingId)}.csv`));
});

describe('unknown ids return 404, not 500', () => {
	it.each([
		'/politicians/unknown-id',
		'/votings/unknown-id',
		'/bills/unknown-id',
		'/assemblies/latest/unknown'
	])('%s', async (path) => {
		expect((await get(path)).status).toBe(404);
	});

	it('unknown groupby', async () => {
		const res = await get(`/assemblies/${encodeURIComponent(repAssemblyId)}/members/unknown`);
		expect(res.status).toBe(404);
	});
});
