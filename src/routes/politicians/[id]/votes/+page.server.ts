import { fetchVotes, fetchVotings } from '$lib/datasheets';
import { safeFind } from '$lib/datasheets/processor.js';
import { getSortedUniqueVoteOptions } from '$lib/datasheets/voting.js';
import { graphql } from '$lib/politigraph';
import { createSeo } from '$lib/seo.js';
import type { Assembly } from '$models/assembly';
import { DefaultVoteOption, type Voting } from '$models/voting.js';
import { error } from '@sveltejs/kit';

interface VoteSummary
	extends Pick<Voting, 'id' | 'nickname' | 'result' | 'date' | 'files' | 'participatedAssemblies'> {
	voteOption: string;
	// isVoteAlignWithPartyMajority: boolean;
}

interface FilterOptions {
	assemblies: Assembly[];
	voteOptions: string[];
}

export async function load({ params }) {
	const {
		people: [politician]
	} = await graphql.query({
		people: {
			__args: {
				where: { id_EQ: params.id }
			},
			id: true,
			prefix: true,
			firstname: true,
			lastname: true
		}
	});

	if (!politician) {
		error(404);
	}

	const votings = await fetchVotings();
	const allVotes = await fetchVotes();

	const votes: VoteSummary[] = allVotes
		.filter(({ politicianId }) => politicianId === politician.id)
		.map(({ votingId, voteOption }) => {
			try {
				const voting = safeFind(votings, ({ id }) => id === votingId);

				return {
					...voting,
					voteOption: voteOption as DefaultVoteOption
					// TODO: calculate isVoteAlignWithPartyMajority
					// isVoteAlignWithPartyMajority: true
				};
			} catch (e) {
				throw `Could not find voting id ${votingId}`;
			}
		})
		.sort((a, z) => z.date.getTime() - a.date.getTime());

	const filterOptions: FilterOptions = {
		assemblies: [...new Set(votes.flatMap(({ participatedAssemblies }) => participatedAssemblies))],
		voteOptions: getSortedUniqueVoteOptions(votes)
	};

	return {
		politician,
		filterOptions,
		votes,
		seo: createSeo({
			title: `ประวัติการลงมติ ${politician.firstname} ${politician.lastname}`
		})
	};
}
