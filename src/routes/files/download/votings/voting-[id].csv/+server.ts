import { createCsvFileResponse } from '$lib/csv';
import { graphql } from '$lib/politigraph/server';
import {
	queryPoliticiansVote,
	sortPoliticiansVoteByDominantGroup
} from '$lib/politigraph/vote/with-politician';

export const prerender = true;

export async function GET({ params }) {
	const {
		voteEvents: [voteEvent]
	} = await graphql.query({
		voteEvents: {
			__args: {
				where: {
					id: { eq: params.id }
				}
			},
			id: true,
			organizations: {
				id: true
			},
			start_date: true,
			end_date: true
		}
	});

	const votes = sortPoliticiansVoteByDominantGroup(await queryPoliticiansVote(voteEvent));

	return createCsvFileResponse(
		votes.map(({ politician, role, party, option }) => ({
			name: politician.name,
			role,
			party: party?.name || '',
			option
		}))
	);
}
