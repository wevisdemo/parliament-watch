import { createSeo } from '$lib/seo/meta';
import { LRUCache } from 'lru-cache';
import { marked } from 'marked';

interface ContributorResponse {
	login: string;
	html_url: string;
}

// Exclude markdown heading
marked.use({ renderer: { heading: () => '' } });

const remoteTextCache = new LRUCache<string, string>({
	max: 10,
	ttl: 6 * 60 * 60 * 1000,
	allowStale: true,
	allowStaleOnFetchRejection: true,
	noDeleteOnFetchRejection: true,
	fetchMethod: async (url) => {
		const res = await fetch(url);

		if (!res.ok) {
			throw new Error(`Can not fetch ${url}: ${res.status} ${res.statusText}`);
		}

		return res.text();
	}
});

export async function load() {
	const [contributorsJson, dataSourceMd] = await Promise.all([
		remoteTextCache.forceFetch(
			'https://api.github.com/repos/wevisdemo/parliament-watch/contributors?per_page=100'
		),
		remoteTextCache.forceFetch('https://politigraph.wevis.info/data-source.md')
	]);

	const developers = JSON.parse(contributorsJson) as ContributorResponse[];

	const dataSourceHtml = await marked.parse(dataSourceMd);

	return {
		developers,
		dataSourceHtml,
		seo: createSeo({
			title: 'เกี่ยวกับเว็บไซต์นี้',
			description:
				'Parliament Watch โดย WeVis รวบรวมข้อมูลเปิดของรัฐสภาไทย ที่มาของข้อมูล และทีมผู้พัฒนา'
		})
	};
}
