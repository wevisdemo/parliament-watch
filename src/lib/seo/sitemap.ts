import { PROD_URL } from '$lib/seo';

export const STATIC_PATHS = ['/', '/about', '/legislative-process', '/bills/explore'];

const escapeXml = (text: string) =>
	text
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');

export const createPath = (prefix: string, id: string) => `${prefix}/${encodeURIComponent(id)}`;

export const createSitemapXml = (paths: string[]) =>
	`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths
		.map((path) => `<url><loc>${escapeXml(PROD_URL + path)}</loc></url>`)
		.join('\n')}\n</urlset>\n`;
