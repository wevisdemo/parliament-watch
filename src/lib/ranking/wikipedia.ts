import { fetchPoliticians } from '$lib/datasheets';
import type { Politician } from '$models/politician';
import dayjs from 'dayjs';
import { movingForwardPolitician } from '../../mocks/data/politician';

export interface PoliticianResult {
	politician: Politician;
	value: number;
}

let wikiResult: PoliticianResult | undefined = undefined;

export async function getPoliticianWithMostViewLastMonth() {
	if (!wikiResult) {
		wikiResult = await _getPoliticianWithMostViewLastMonth(await fetchPoliticians());
	}
	return wikiResult;
}

export async function _getPoliticianWithMostViewLastMonth(politicians: Politician[]) {
	let result: PoliticianResult = {
		politician: movingForwardPolitician,
		value: 0
	};

	for (const politician of politicians) {
		const { firstname, lastname } = politician;
		try {
			const res = await fetch(getWikipediaViewEndpoint(firstname, lastname));

			if (res.ok) {
				const data = await res.json();

				if (data?.items?.[0]?.views) {
					const { views } = data.items[0];

					if (views > result.value) {
						result = {
							politician: politician,
							value: views
						};
					}
				}
			}
		} catch (_) {
			/**/
		}
	}

	return result;
}

function getWikipediaViewEndpoint(firstname: string, lastname: string) {
	const article = [firstname, lastname].join('_');
	const fromDate = dayjs().subtract(1, 'month').startOf('month').format('YYYYMMDD');
	const toDate = dayjs().subtract(1, 'month').endOf('month').format('YYYYMMDD');

	// source: https://wikitech.wikimedia.org/wiki/Analytics/AQS/Pageviews
	return `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/th.wikipedia/all-access/all-agents/${article}/monthly/${fromDate}/${toDate}`;
}
