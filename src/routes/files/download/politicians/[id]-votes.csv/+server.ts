import { createCsvFileResponse } from '$lib/csv';
import { graphql } from '$lib/politigraph/client';

export async function GET({ params }) {
	const {
		people: [{ votes } = { votes: [] }]
	} = await graphql.query({
		__name: 'PoliticianVotesCsv',
		people: {
			__args: {
				where: { id: { eq: params.id } }
			},
			votes: {
				option: true,
				vote_event: {
					title: true,
					result: true,
					start_date: true,
					end_date: true
				}
			}
		}
	});

	return createCsvFileResponse(
		votes
			.flatMap(({ option, vote_event }) => (vote_event ? [{ ...vote_event, option }] : []))
			.sort((a, z) => z.start_date.localeCompare(a.start_date))
	);
}
