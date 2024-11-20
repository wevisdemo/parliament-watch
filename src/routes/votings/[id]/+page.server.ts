import {
	fetchAssemblies,
	fetchFromIdOr404,
	fetchPoliticians,
	fetchVotes,
	fetchVotings
} from '$lib/datasheets/index.js';
import {
	getVoteResultsByPerson,
	groupVoteByAffiliations,
	type VoteOptionCounter
} from '$lib/datasheets/voting.js';
import { createSeo } from '$lib/seo.js';
import type { Bill } from '$models/bill';
import type { ResultsByAffiliation } from './+page.js';

export async function entries() {
	return (await fetchVotings()).map(({ id }) => ({ id }));
}

export async function load({ params }) {
	const voting = await fetchFromIdOr404(fetchVotings, params.id);
	const votes = (await fetchVotes()).filter(({ votingId }) => votingId === voting.id);
	const politicians = await fetchPoliticians();
	const assembles = await fetchAssemblies();

	// TODO: Not release bill yet
	const relatedBill: Bill | null = null;

	const results = voting.voteOptions.map((voteOption) => ({
		voteOption,
		total: votes.filter((vote) => vote.voteOption === voteOption).length
	}));

	const resultsByPerson = getVoteResultsByPerson(voting, votes, politicians);

	const resultsByAffiliation: ResultsByAffiliation = groupVoteByAffiliations(
		voting,
		votes,
		politicians,
		assembles
	).map(({ name, resultSummary, byParties }) => ({
		affiliationName: name,
		resultSummary: convertResultSummaryToArray(resultSummary),
		byParties: byParties.map(({ party, resultSummary: partyResultSummary }) => ({
			party,
			resultSummary: convertResultSummaryToArray(partyResultSummary)
		}))
	}));

	return {
		voting,
		relatedBill,
		results,
		resultsByAffiliation: resultsByAffiliation.filter(
			({ resultSummary }) => resultSummary.reduce((sum, { total }) => sum + total, 0) > 0
		),
		resultsByPerson,
		seo: createSeo({
			title: 'การลงมติ ' + voting.nickname
		})
	};
}

const convertResultSummaryToArray = (resultSummary: VoteOptionCounter) =>
	Object.entries(resultSummary)
		.map(([voteOption, total]) => ({
			voteOption,
			total
		}))
		.filter(({ total }) => total > 0);
