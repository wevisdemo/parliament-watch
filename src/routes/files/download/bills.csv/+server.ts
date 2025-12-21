import { createCsvFileResponse } from '$lib/csv';
import { graphql } from '$lib/politigraph/server';

export const prerender = true;

export async function GET() {
	const { bills } = await graphql.query({
		bills: {
			__args: {
				sort: [{ proposal_date: 'DESC' }]
			},
			id: true,
			title: true,
			nickname: true,
			status: true,
			proposal_date: true,
			// TODO: can maintain category data
			// categories: true,
			links: {
				url: true
			},
			creators: {
				on_Organization: {
					name: true
				},
				on_Person: {
					name: true
				}
			},
			co_proposers: {
				name: true
			}
			// TODO: has people signatory data
			// people_signature_count: true
		}
	});

	return createCsvFileResponse(
		bills.map(({ creators, links, co_proposers, ...bill }) => ({
			...bill,
			mainProposer: creators[0]?.name,
			coProposers: co_proposers.map((person) => person.name),
			links: links.map((link) => link.url)
		}))
	);
}
