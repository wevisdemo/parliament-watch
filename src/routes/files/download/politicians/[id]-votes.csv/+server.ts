import { createCsvFileResponse } from '$lib/csv';
import { graphql } from '$lib/politigraph/client';

export async function GET({ params }) {
	const { votes } = await graphql.query({
		votes: {
			__args: {
				where: {
					voter: {
						id: { eq: params.id }
					}
				}
			},
			option: true,
			vote_event: {
				title: true,
				result: true,
				start_date: true,
				end_date: true
			}
		}
	});

	return createCsvFileResponse(
		votes
			.flatMap(({ option, vote_event }) => (vote_event ? [{ ...vote_event, option }] : []))
			.sort((a, z) => z.start_date.localeCompare(a.start_date))
	);
}
