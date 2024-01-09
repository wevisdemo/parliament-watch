import type { Party } from '$models/party';
import type { DefaultVoteOption, CustomVoteOption } from '$models/voting';
import type { Bill } from '$models/bill';
import { fetchFromIdOr404, fetchPoliticians, fetchVotes, fetchVotings } from '$lib/datasheets';
import type { Politician } from '$models/politician';
import { safeFind } from '$lib/datasheets/processor';
import { groupVoteByAffiliations, type VoteOptionCounter } from '$lib/datasheets/voting.js';
import { getAssemblyMembers, getAssemblyRoleDescription } from '$lib/datasheets/assembly-member.js';

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

export type ResultByPerson = Pick<Politician, 'id' | 'prefix' | 'firstname' | 'lastname'> & {
	role: string;
	party?: Party;
	voteOption: DefaultVoteOption | CustomVoteOption | string;
};

export async function load({ params }) {
	const voting = await fetchFromIdOr404(fetchVotings, params.id);
	const votes = (await fetchVotes()).filter(({ votingId }) => votingId === voting.id);
	const politicians = await fetchPoliticians();
	const assemblyMembers = voting.participatedAssemblies
		.map((assembly) => getAssemblyMembers(assembly, politicians))
		.flat();

	// TODO: Not release bill yet
	const relatedBill: Bill | null = null;

	const results = voting.voteOptions.map((voteOption) => ({
		voteOption,
		total: votes.filter((vote) => vote.voteOption === voteOption).length
	}));

	const resultsByPerson: ResultByPerson[] = votes.reduce<ResultByPerson[]>(
		(list, { politicianId, voteOption }) => {
			const { id, prefix, firstname, lastname, partyRoles } = safeFind(
				politicians,
				(politician) => politician.id === politicianId
			);

			const assemblyMember = assemblyMembers.find((member) => member.id === politicianId);

			if (assemblyMember) {
				list.push({
					id,
					prefix,
					firstname,
					lastname,
					role: `${assemblyMember.assemblyRole?.assembly.abbreviation} ${getAssemblyRoleDescription(
						assemblyMember.assemblyRole
					)}`,
					party: partyRoles.find(
						({ startedAt, endedAt }) =>
							voting.date.getTime() >= startedAt.getTime() &&
							(!endedAt || voting.date.getTime() <= endedAt.getTime())
					)?.party,
					voteOption
				});
			}

			return list;
		},
		[]
	);

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
		resultsByPerson
	};
}

const convertResultSummaryToArray = (resultSummary: VoteOptionCounter) =>
	Object.entries(resultSummary)
		.map(([voteOption, total]) => ({
			voteOption,
			total
		}))
		.filter(({ total }) => total > 0);
