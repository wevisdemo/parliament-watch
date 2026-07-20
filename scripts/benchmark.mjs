/**
 * SSR benchmark (migration plan, milestone 3)
 *
 * Measures cold (first-hit) and warm (cache-hit) TTFB against a freshly
 * started server, with a mixed-route pool under concurrent load:
 *   pnpm build && PORT=3000 node build &
 *   BASE_URL=http://localhost:3000 SERVER_PID=<pid> node scripts/benchmark.mjs
 *
 * Thresholds (from the migration plan): cold p95 < 3s on /politicians/[id],
 * < 1.5s on typical pages; warm p95 < 300ms; p99 < 5s under 20 concurrent
 * users with zero errors.
 */
import { readFileSync } from 'node:fs';

const BASE_URL = (process.env.BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
const SERVER_PID = process.env.SERVER_PID;
const CONCURRENCY = Number(process.env.CONCURRENCY) || 20;
const WARM_DURATION_MS = (Number(process.env.WARM_DURATION_S) || 30) * 1000;
const SAMPLE_IDS = Number(process.env.SAMPLE_IDS) || 10;
const COLD_CONCURRENCY = Number(process.env.COLD_CONCURRENCY) || 2;

const quantile = (values, q) => {
	const sorted = [...values].sort((a, z) => a - z);
	return sorted[Math.min(sorted.length - 1, Math.ceil(q * sorted.length) - 1)] ?? 0;
};

const ms = (v) => `${Math.round(v)}ms`;

async function timedFetch(path) {
	const start = performance.now();
	try {
		const res = await fetch(`${BASE_URL}${path}`, {
			redirect: 'follow',
			signal: AbortSignal.timeout(30_000)
		});
		const ttfb = performance.now() - start;
		await res.arrayBuffer();
		return { path, ttfb, ok: res.ok };
	} catch {
		return { path, ttfb: performance.now() - start, ok: false };
	}
}

async function runPool(paths, concurrency) {
	const queue = [...paths];
	const results = [];
	await Promise.all(
		Array.from({ length: concurrency }, async () => {
			while (queue.length > 0) {
				results.push(await timedFetch(queue.shift()));
			}
		})
	);
	return results;
}

function report(label, results, { p95Limit, p99Limit } = {}) {
	const times = results.map((r) => r.ttfb);
	const errors = results.filter((r) => !r.ok);
	const p50 = quantile(times, 0.5);
	const p95 = quantile(times, 0.95);
	const p99 = quantile(times, 0.99);
	const verdicts = [];
	if (p95Limit) verdicts.push(p95 < p95Limit ? `p95<${p95Limit}ms ✓` : `p95<${p95Limit}ms ✗`);
	if (p99Limit) verdicts.push(p99 < p99Limit ? `p99<${p99Limit}ms ✓` : `p99<${p99Limit}ms ✗`);
	if (errors.length > 0) verdicts.push(`${errors.length} errors ✗`);
	console.log(
		`${label}: n=${results.length} p50=${ms(p50)} p95=${ms(p95)} p99=${ms(p99)} ${verdicts.join(' ')}`
	);
	return verdicts.every((v) => !v.includes('✗'));
}

function rss() {
	if (!SERVER_PID) return null;
	try {
		const status = readFileSync(`/proc/${SERVER_PID}/status`, 'utf8');
		return Number(status.match(/VmRSS:\s+(\d+) kB/)?.[1]) / 1024;
	} catch {
		return null;
	}
}

// --- Discover a mixed-route pool from live endpoints ---

const fetchJson = async (path) => (await fetch(`${BASE_URL}${path}`)).json();
const [politicians, votings, bills] = await Promise.all([
	fetchJson('/files/search-indexes/politicians.json'),
	fetchJson('/files/search-indexes/votings.json'),
	fetchJson('/files/search-indexes/bills.json')
]);
const billsTermPath = decodeURIComponent(
	(await fetch(`${BASE_URL}/bills`, { redirect: 'manual' })).headers.get('location')
);
const assemblyPath = decodeURIComponent(
	(await fetch(`${BASE_URL}/assemblies/latest/representative`, { redirect: 'manual' })).headers.get(
		'location'
	)
);

const pick = (index) => index.slice(0, SAMPLE_IDS).map(({ id }) => id);
const heavyPaths = pick(politicians).map((id) => `/politicians/${encodeURIComponent(id)}`);
const typicalPaths = [
	'/',
	assemblyPath,
	`${assemblyPath}/votes`,
	billsTermPath,
	...pick(votings).map((id) => `/votings/${encodeURIComponent(id)}`),
	...pick(bills).map((id) => `/bills/${encodeURIComponent(id)}`)
];

// --- Cold: first hit of each unique URL since server start ---

console.log(`benchmark against ${BASE_URL} (concurrency ${CONCURRENCY})\n`);
const rssBefore = rss();
const coldTypical = await runPool(typicalPaths, COLD_CONCURRENCY);
const coldHeavy = await runPool(heavyPaths, COLD_CONCURRENCY);
let pass = report('cold typical', coldTypical, { p95Limit: 1500 });
pass = report('cold heavy (politicians)', coldHeavy, { p95Limit: 3000 }) && pass;
[...coldTypical, ...coldHeavy]
	.sort((a, z) => z.ttfb - a.ttfb)
	.slice(0, 5)
	.forEach((r) => console.log(`  slowest cold: ${ms(r.ttfb)} ${decodeURIComponent(r.path)}`));

// --- Warm: mixed routes, cache hits, sustained concurrency ---

const pool = [...heavyPaths, ...typicalPaths];
const deadline = performance.now() + WARM_DURATION_MS;
const warmResults = [];
await Promise.all(
	Array.from({ length: CONCURRENCY }, async (_, worker) => {
		for (let i = worker; performance.now() < deadline; i++) {
			warmResults.push(await timedFetch(pool[i % pool.length]));
		}
	})
);
pass =
	report(`warm mixed (${CONCURRENCY} users, ${WARM_DURATION_MS / 1000}s)`, warmResults, {
		p95Limit: 300,
		p99Limit: 5000
	}) && pass;

const rssAfter = rss();
if (rssAfter !== null) {
	console.log(
		`RSS: ${Math.round(rssBefore)}MB → ${Math.round(rssAfter)}MB ${rssAfter < 1024 ? '(<1GB ✓)' : '(>1GB ✗)'}`
	);
	pass = pass && rssAfter < 1024;
}

process.exit(pass ? 0 : 1);
