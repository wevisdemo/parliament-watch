import type { Politician } from '$models/politician.js';
import { DefaultVoteOption, type Voting, CATEGORY_NOT_SPECIFIED } from '$models/voting.js';
import type { Assembly } from '$models/assembly';
import { fetchFromIdOr404, fetchPoliticians, fetchVotes, fetchVotings } from '$lib/datasheets';
import { createSeo } from '$lib/seo.js';
import { safeFind } from '$lib/datasheets/processor.js';
import { getSortedUniqueCategories, getSortedUniqueVoteOptions } from '$lib/datasheets/voting.js';

interface VoteSummary
	extends Pick<
		Voting,
		'id' | 'title' | 'result' | 'date' | 'files' | 'participatedAssemblies' | 'categories'
	> {
	voteOption: string;
	// isVoteAlignWithPartyMajority: boolean;
}

interface FilterOptions {
	assemblies: Assembly[];
	categories: string[];
	voteOptions: string[];
}

type PoliticianSummary = Pick<Politician, 'id' | 'prefix' | 'firstname' | 'lastname'>;

export async function load({ params }) {
	const politician = await fetchFromIdOr404(fetchPoliticians, params.id);

	const votings = await fetchVotings();
	const allVotes = await fetchVotes();

	const votes: VoteSummary[] = allVotes
		.filter(({ politicianId }) => politicianId === politician.id)
		.map(({ votingId, voteOption }) => {
			try {
				const voting = safeFind(votings, ({ id }) => id === votingId);

				return {
					...voting,
					categories: voting.categories.length > 0 ? voting.categories : [CATEGORY_NOT_SPECIFIED],
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
		categories: getSortedUniqueCategories(votes),
		voteOptions: getSortedUniqueVoteOptions(votes)
	};

	const politicianSummary: PoliticianSummary = (({ id, prefix, firstname, lastname }) => ({
		id,
		prefix,
		firstname,
		lastname
	}))(politician);

	return {
		politician: politicianSummary,
		filterOptions,
		votes,
		seo: createSeo({
			title: `ประวัติการลงมติ ${politicianSummary.firstname} ${politicianSummary.lastname}`
		})
	};
}
