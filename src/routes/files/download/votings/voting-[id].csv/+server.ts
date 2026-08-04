import { createCsvFileResponse } from '$lib/csv';
import { graphql } from '$lib/politigraph/client';
import {
	queryPoliticiansVote,
	sortPoliticiansVoteByDominantGroup
} from '$lib/politigraph/vote/with-politician';
import { error } from '@sveltejs/kit';

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

	if (!voteEvent) {
		error(404);
	}

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
