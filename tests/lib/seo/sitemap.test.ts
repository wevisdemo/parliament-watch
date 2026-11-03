import { PROD_URL } from '$lib/seo';
import { createSitemapXml } from '$lib/seo/sitemap';
import { describe, expect, it } from 'vitest';

describe('createSitemapXml', () => {
	it('wraps absolute URLs in a sitemaps.org urlset', () => {
		const xml = createSitemapXml(['/', '/about']);

		expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
		expect(xml).toContain(`<loc>${PROD_URL}/</loc>`);
		expect(xml).toContain(`<loc>${PROD_URL}/about</loc>`);
	});

	it('escapes XML special characters', () => {
		const xml = createSitemapXml(['/a?x=1&y=<2>\'"']);

		expect(xml).toContain('/a?x=1&amp;y=&lt;2&gt;&apos;&quot;');
	});
});
