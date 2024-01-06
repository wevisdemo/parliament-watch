import { createSeo } from '../../utils/seo.js';

interface ContributorResponse {
	login: string;
	html_url: string;
}

export async function load({ fetch }) {
	const res = await fetch('https://api.github.com/repos/wevisdemo/parliament-watch/contributors');

	if (!res.ok) {
		throw 'Can not fetch Github contributors';
	}

	const developers = ((await res.json()) as ContributorResponse[]).map((c) => ({
		username: c.login,
		url: c.html_url
	}));

	return {
		developers,
		seo: createSeo({
			title: `เกี่ยวกับเว็บไซต์นี้ - Parliament Watch`
		})
	};
}
