import dayjs from 'dayjs';

interface PoliticianInput {
	id: string;
	name: string;
}
interface PoliticianResult extends PoliticianInput {
	value: number;
}

let wikiResult: PoliticianResult;

export async function getPoliticianWithMostViewLastMonth(politicians: PoliticianInput[]) {
	if (!wikiResult) {
		wikiResult = await _getPoliticianWithMostViewLastMonth(politicians);
	}
	return wikiResult;
}

export async function _getPoliticianWithMostViewLastMonth(politicians: PoliticianInput[]) {
	let result: PoliticianResult | undefined = undefined;

	for (const politician of politicians) {
		const res = await fetch(getWikipediaViewEndpoint(politician.name));

		if (res.ok) {
			const data = await res.json();

			if (data?.items?.[0]?.views) {
				const { views } = data.items[0];

				if (!result || views > result.value) {
					result = {
						...politician,
						value: views
					};
				}
			}
		}
	}

	if (!result) throw 'Could not find any politicians page on wikipedia';

	return result;
}

function getWikipediaViewEndpoint(name: string) {
	const article = name.replaceAll(' ', '_');
	const fromDate = dayjs().subtract(1, 'month').startOf('month').format('YYYYMMDD');
	const toDate = dayjs().subtract(1, 'month').endOf('month').format('YYYYMMDD');

	// source: https://wikitech.wikimedia.org/wiki/Analytics/AQS/Pageviews
	return `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/th.wikipedia/all-access/all-agents/${article}/monthly/${fromDate}/${toDate}`;
}
