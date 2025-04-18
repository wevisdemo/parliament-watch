import { createCsvFileResponse } from '$lib/csv';
import { graphql } from '$lib/politigraph.js';

export const prerender = true;

export async function GET({ params }) {
	const { votes } = await graphql.query({
		votes: {
			__args: {
				where: {
					vote_events_ALL: {
						id_EQ: params.id
					}
				},
				sort: [{ voter_name: 'ASC' }]
			},
			voter_name: true,
			voter_party: true,
			option: true
		}
	});
	return createCsvFileResponse(votes);
}
