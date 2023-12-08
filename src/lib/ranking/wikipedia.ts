import type { Politician } from '$models/politician';
import dayjs from 'dayjs';

export async function getPoliticianWithMostViewLastMonth(
	politicians: Pick<Politician, 'id' | 'firstname' | 'lastname'>[]
) {
	let result = {
		politicianId: '',
		views: 0
	};

	for (const { id, firstname, lastname } of politicians) {
		const res = await fetch(getWikipediaViewEndpoint(firstname, lastname));

		if (res.ok) {
			const data = await res.json();

			if (data?.items?.[0]?.views) {
				const { views } = data.items[0];

				if (views > result.views) {
					result = {
						politicianId: id,
						views
					};
				}
			}
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
