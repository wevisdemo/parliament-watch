import dayjs from 'dayjs';

interface PoliticianInput {
	id: string;
	name: string;
}
interface PoliticianResult extends PoliticianInput {
	value: number;
}

const BATCH_SIZE = 10;

export async function getPoliticianWithMostViewLastMonth(politicians: PoliticianInput[]) {
	const results = await fetchLastMonthViewsInBatches(politicians);

	const [politicianWithMostView] = results
		.filter((result) => result !== null)
		.toSorted((a, z) => z.value - a.value);

	if (!politicianWithMostView) throw new Error('Could not find any politicians page on wikipedia');

	return politicianWithMostView;
}

async function fetchLastMonthViewsInBatches(politicians: PoliticianInput[]) {
	const batches = Array.from({ length: Math.ceil(politicians.length / BATCH_SIZE) }, (_, index) =>
		politicians.slice(index * BATCH_SIZE, (index + 1) * BATCH_SIZE)
	);

	const resultsByBatch = await batches.reduce<Promise<(PoliticianResult | null)[][]>>(
		async (previous, batch) => [
			...(await previous),
			await Promise.all(batch.map(fetchLastMonthView))
		],
		Promise.resolve([])
	);

	return resultsByBatch.flat();
}

async function fetchLastMonthView(politician: PoliticianInput): Promise<PoliticianResult | null> {
	const res = await fetch(getWikipediaViewEndpoint(politician.name));

	if (!res.ok) return null;

	const data = await res.json();
	const views = data?.items?.[0]?.views;

	return views ? { ...politician, value: views } : null;
}

function getWikipediaViewEndpoint(name: string) {
	const article = encodeURIComponent(name.replaceAll(' ', '_'));
	const fromDate = dayjs().subtract(1, 'month').startOf('month').format('YYYYMMDD');
	const toDate = dayjs().subtract(1, 'month').endOf('month').format('YYYYMMDD');

	// source: https://wikitech.wikimedia.org/wiki/Analytics/AQS/Pageviews
	return `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/th.wikipedia/all-access/all-agents/${article}/monthly/${fromDate}/${toDate}`;
}
