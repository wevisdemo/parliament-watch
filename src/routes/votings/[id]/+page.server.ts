import type { Party } from '$models/party';
import type { DefaultVoteOption, CustomVoteOption } from '$models/voting';
import type { Bill } from '$models/bill';
import { fetchFromIdOr404, fetchPoliticians, fetchVotes, fetchVotings } from '$lib/datasheets';
import {
	getVoteResultsByPerson,
	groupVoteByAffiliations,
	type VoteOptionCounter
} from '$lib/datasheets/voting.js';
import { createSeo } from '../../../utils/seo.js';

export type Results = VoteOptionResult[];

export interface VoteOptionResult {
	voteOption: DefaultVoteOption | CustomVoteOption | string;
	total: number;
}

export type ResultsByAffiliation = ResultByAffiliation[];
export type ResultsByParty = {
	party: Party;
	resultSummary: Results;
};

export interface ResultByAffiliation {
	affiliationName: string;
	resultSummary: Results;
	byParties?: ResultsByParty[];
}

export async function load({ params }) {
	const voting = await fetchFromIdOr404(fetchVotings, params.id);
	const votes = (await fetchVotes()).filter(({ votingId }) => votingId === voting.id);
	const politicians = await fetchPoliticians();

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
		politicians
	)
		.map(({ name, resultSummary, byParties }) => ({
			affiliationName: name,
			resultSummary: convertResultSummaryToArray(resultSummary),
			byParties: byParties.map(({ party, resultSummary: partyResultSummary }) => ({
				party,
				resultSummary: convertResultSummaryToArray(partyResultSummary)
			}))
		}))
		.filter(({ resultSummary }) => resultSummary.reduce((sum, { total }) => sum + total, 0) > 0);

	return {
		voting,
		relatedBill,
		results,
		resultsByAffiliation,
		resultsByPerson,
		seo: createSeo({
			title: 'การลงมติ ' + voting.title
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
