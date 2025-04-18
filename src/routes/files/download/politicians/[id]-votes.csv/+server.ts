import { createCsvFileResponse } from '$lib/csv';
import { graphql } from '$lib/politigraph.js';

export const prerender = true;

export async function GET({ params }) {
	const { votes } = await graphql.query({
		votes: {
			__args: {
				where: {
					voters_ALL: {
						id_EQ: params.id
					}
				}
			},
			option: true,
			vote_events: {
				title: true,
				result: true,
				start_date: true,
				end_date: true
			}
		}
	});

	return createCsvFileResponse(
		votes
			.map(({ option, vote_events }) => ({
				...(vote_events[0] ?? {}),
				option
			}))
			.sort((a, z) => z.start_date.localeCompare(a.start_date))
	);
}
