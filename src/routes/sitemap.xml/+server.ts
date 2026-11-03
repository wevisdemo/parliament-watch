import { PAGE_CACHE_CONTROL } from '$lib/cache-control';
import { graphql } from '$lib/politigraph/client';
import { queryAllPeople } from '$lib/politigraph/people';
import { STATIC_PATHS, createPath, createSitemapXml } from '$lib/seo/sitemap';

export async function GET() {
	const [people, { bills, voteEvents, organizations }] = await Promise.all([
		queryAllPeople({ id: true }),
		graphql.query({
			bills: { id: true },
			voteEvents: { id: true },
			organizations: {
				__args: {
					where: {
						classification: { in: ['HOUSE_OF_REPRESENTATIVE', 'HOUSE_OF_SENATE', 'CABINET'] }
					}
				},
				id: true,
				classification: true
			}
		})
	]);

	const paths = [
		...STATIC_PATHS,
		...people.map(({ id }) => createPath('/politicians', id)),
		...bills.map(({ id }) => createPath('/bills', id)),
		...voteEvents.map(({ id }) => createPath('/votings', id)),
		...organizations.map(({ id }) => createPath('/assemblies', id)),
		...organizations
			.filter(({ classification }) => classification === 'HOUSE_OF_REPRESENTATIVE')
			.map(({ id }) => createPath('/bills/term', id))
	];

	return new Response(createSitemapXml(paths), {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': PAGE_CACHE_CONTROL
		}
	});
}
