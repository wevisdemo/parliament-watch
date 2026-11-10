import { createSeo } from '$lib/seo/meta';
import { marked } from 'marked';

export const prerender = true;

interface ContributorResponse {
	login: string;
	html_url: string;
}

// Only render table from https://politigraph.wevis.info/data-source
marked.use({ renderer: { heading: () => '', paragraph: () => '' } });

export async function load({ fetch }) {
	const res = await fetch(
		'https://api.github.com/repos/wevisdemo/parliament-watch/contributors?per_page=100'
	);

	if (!res.ok) {
		throw new Error(`Can not fetch Github contributors: ${res.status} ${res.statusText}`);
	}

	const developers = ((await res.json()) as ContributorResponse[]).map((c) => ({
		username: c.login,
		url: c.html_url
	}));

	const dataSourceRes = await fetch('https://politigraph.wevis.info/data-source.md');

	if (!dataSourceRes.ok) {
		throw new Error(
			`Can not fetch Politigraph data source doc: ${dataSourceRes.status} ${dataSourceRes.statusText}`
		);
	}

	const dataSourceHtml = await marked.parse(await dataSourceRes.text());

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
