import type { Party } from '$models/party';
import { type Voting, DefaultVoteOption, type CustomVoteOption } from '$models/voting';
import {
	passedVoting,
	failedVoting,
	candidateVoting,
	customVoteOption
} from '../../../mocks/data/voting';
import {
	bhumjaithaiParty,
	democratsParty,
	movingForwardParty,
	pheuThaiParty,
	prachachatParty
} from '../../../mocks/data/party';
import type { Bill } from '$models/bill';
import { inProgressBill } from '../../../mocks/data/bill';
import { createMockVotes } from '../../../mocks/data/votes';

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

export function load({ params }) {
	const votingId = params.id;

	/*
	 * | votingId | Passed?   | Default? | House  | Government Formed? |
	 * | ----------- | --------- | -------- | ------ | ------------------ |
	 * | 1           | T         | T        | Joint  | T                  |
	 * | 2           | F         | T        | Joint  | T                  |
	 * | 3           | T         | F (Cand) | Joint  | T                  |
	 * | 4           | T         | F (Cand) | Joint  | F                  |
	 * | 5           | F (NoWin) | F (Cand) | Joint  | F                  |
	 * | 6           | T         | T        | Joint  | F                  |
	 * | 7           | T         | T        | MP     | T                  |
	 * | 8           | T         | T        | MP     | F                  |
	 * | 9           | T         | T        | Senate | T                  |
	 */
	const isFailedVoting = votingId === '2';
	const isCandidateVoting = votingId === '3' || votingId === '4' || votingId === '5';
	const isFailedCandidateVoting = votingId === '6';
	const isGovernmentFormed = !['4', '5', '6', '8'].includes(votingId);
	const isOnlyMPs = ['7', '8'].includes(votingId);
	const isOnlySenates = votingId === '9';

	const rawVotes = getRawVoteResults(isCandidateVoting);

	const voting: Voting = {
		...(isCandidateVoting ? candidateVoting : isFailedVoting ? failedVoting : passedVoting),
		id: votingId
	};

	const relatedBill: Bill = inProgressBill;

	if (isFailedCandidateVoting) {
		voting.result = 'ไม่มีผู้ชนะ';
	}

	let results: Results = [];
	if (isOnlySenates) {
		results = sumFakedRawVoteResults(rawVotes.filter((vote) => vote.isSanate));
	} else if (isOnlyMPs) {
		results = sumFakedRawVoteResults(rawVotes.filter((vote) => vote.party));
	} else {
		results = sumFakedRawVoteResults(rawVotes);
	}

	const resultsByAffiliation: ResultsByAffiliation = [];

	if (!isOnlySenates && isGovernmentFormed) {
		resultsByAffiliation.push(
			{
				affiliationName: 'สส.ฝ่ายรัฐบาล',
				resultSummary: sumFakedRawVoteResults(
					filterFakedRawVoteResultsByParties(rawVotes, [
						movingForwardParty,
						pheuThaiParty,
						prachachatParty
					])
				),
				byParties: [
					{
						party: movingForwardParty,
						resultSummary: sumFakedRawVoteResults(
							filterFakedRawVoteResultsByParties(rawVotes, [movingForwardParty])
						)
					},
					{
						party: pheuThaiParty,
						resultSummary: sumFakedRawVoteResults(
							filterFakedRawVoteResultsByParties(rawVotes, [pheuThaiParty])
						)
					},
					{
						party: prachachatParty,
						resultSummary: sumFakedRawVoteResults(
							filterFakedRawVoteResultsByParties(rawVotes, [prachachatParty])
						)
					}
				]
			},
			{
				affiliationName: 'สส.ฝ่ายค้าน',
				resultSummary: sumFakedRawVoteResults(
					filterFakedRawVoteResultsByParties(rawVotes, [bhumjaithaiParty, democratsParty])
				),
				byParties: [
					{
						party: bhumjaithaiParty,
						resultSummary: sumFakedRawVoteResults(
							filterFakedRawVoteResultsByParties(rawVotes, [bhumjaithaiParty])
						)
					},
					{
						party: democratsParty,
						resultSummary: sumFakedRawVoteResults(
							filterFakedRawVoteResultsByParties(rawVotes, [democratsParty])
						)
					}
				]
			}
		);
	}

	if (!isOnlySenates && !isGovernmentFormed) {
		resultsByAffiliation.push({
			affiliationName: 'สส.',
			resultSummary: sumFakedRawVoteResults(
				filterFakedRawVoteResultsByParties(rawVotes, [
					movingForwardParty,
					pheuThaiParty,
					prachachatParty,
					bhumjaithaiParty,
					democratsParty
				])
			),
			byParties: [
				{
					party: movingForwardParty,
					resultSummary: sumFakedRawVoteResults(
						filterFakedRawVoteResultsByParties(rawVotes, [movingForwardParty])
					)
				},
				{
					party: pheuThaiParty,
					resultSummary: sumFakedRawVoteResults(
						filterFakedRawVoteResultsByParties(rawVotes, [pheuThaiParty])
					)
				},
				{
					party: prachachatParty,
					resultSummary: sumFakedRawVoteResults(
						filterFakedRawVoteResultsByParties(rawVotes, [prachachatParty])
					)
				},
				{
					party: bhumjaithaiParty,
					resultSummary: sumFakedRawVoteResults(
						filterFakedRawVoteResultsByParties(rawVotes, [bhumjaithaiParty])
					)
				},
				{
					party: democratsParty,
					resultSummary: sumFakedRawVoteResults(
						filterFakedRawVoteResultsByParties(rawVotes, [democratsParty])
					)
				}
			]
		});
	}

	if (!isOnlyMPs) {
		resultsByAffiliation.push({
			affiliationName: 'สว.',
			resultSummary: sumFakedRawVoteResults(rawVotes.filter((vote) => vote.isSanate))
		});
	}

	const resultsByPerson = createMockVotes(isCandidateVoting);

	return {
		voting,
		relatedBill,
		results,
		resultsByAffiliation,
		resultsByPerson
	};
}

type FakedRawVoteResults = {
	party?: Party;
	isSanate?: boolean;
	resultSummary: Results;
};

function getRawVoteResults(isCandidateVoting: boolean): FakedRawVoteResults[] {
	return [
		{
			party: movingForwardParty,
			resultSummary: isCandidateVoting
				? [{ voteOption: customVoteOption[0], total: 151 }]
				: [{ voteOption: DefaultVoteOption.Agreed, total: 151 }]
		},
		{
			party: pheuThaiParty,
			resultSummary: isCandidateVoting
				? [
						{ voteOption: customVoteOption[0], total: 136 },
						{ voteOption: DefaultVoteOption.Abstain, total: 1 },
						{ voteOption: DefaultVoteOption.Absent, total: 3 }
				  ]
				: [
						{ voteOption: DefaultVoteOption.Agreed, total: 71 },
						{ voteOption: DefaultVoteOption.Abstain, total: 63 },
						{ voteOption: DefaultVoteOption.Novote, total: 1 },
						{ voteOption: DefaultVoteOption.Absent, total: 3 },
						{ voteOption: DefaultVoteOption.Disagreed, total: 2 }
				  ]
		},
		{
			party: prachachatParty,
			resultSummary: isCandidateVoting
				? [
						{ voteOption: customVoteOption[0], total: 19 },
						{ voteOption: customVoteOption[1], total: 2 }
				  ]
				: [
						{ voteOption: DefaultVoteOption.Agreed, total: 18 },
						{ voteOption: DefaultVoteOption.Novote, total: 2 },
						{ voteOption: DefaultVoteOption.Disagreed, total: 1 }
				  ]
		},
		{
			party: bhumjaithaiParty,
			resultSummary: isCandidateVoting
				? [{ voteOption: customVoteOption[1], total: 140 }]
				: [
						{ voteOption: DefaultVoteOption.Agreed, total: 139 },
						{ voteOption: DefaultVoteOption.Disagreed, total: 1 }
				  ]
		},
		{
			party: democratsParty,
			resultSummary: isCandidateVoting
				? [
						{ voteOption: customVoteOption[0], total: 12 },
						{ voteOption: customVoteOption[1], total: 33 },
						{ voteOption: customVoteOption[2], total: 1 },
						{ voteOption: DefaultVoteOption.Abstain, total: 2 }
				  ]
				: [
						{ voteOption: DefaultVoteOption.Agreed, total: 33 },
						{ voteOption: DefaultVoteOption.Abstain, total: 2 },
						{ voteOption: DefaultVoteOption.Novote, total: 2 },
						{ voteOption: DefaultVoteOption.Absent, total: 2 },
						{ voteOption: DefaultVoteOption.Disagreed, total: 9 }
				  ]
		},
		{
			isSanate: true,
			resultSummary: isCandidateVoting
				? [
						{ voteOption: customVoteOption[0], total: 100 },
						{ voteOption: customVoteOption[1], total: 99 },
						{ voteOption: DefaultVoteOption.Abstain, total: 15 },
						{ voteOption: DefaultVoteOption.Novote, total: 18 },
						{ voteOption: DefaultVoteOption.Absent, total: 18 }
				  ]
				: [
						{ voteOption: DefaultVoteOption.Agreed, total: 240 },
						{ voteOption: DefaultVoteOption.Abstain, total: 2 },
						{ voteOption: DefaultVoteOption.Novote, total: 2 },
						{ voteOption: DefaultVoteOption.Absent, total: 3 },
						{ voteOption: DefaultVoteOption.Disagreed, total: 3 }
				  ]
		}
	];
}

function sumFakedRawVoteResults(results: FakedRawVoteResults[]): Results {
	return results
		.map((result) => result.resultSummary)
		.reduce((acc, resultSummary) => {
			for (const summary of resultSummary) {
				const found = acc.find((key) => key.voteOption === summary.voteOption);
				if (found) {
					found.total += summary.total;
				} else {
					acc.push({ ...summary });
				}
			}
			return acc;
		}, []);
}

function filterFakedRawVoteResultsByParties(
	results: FakedRawVoteResults[],
	parties: Party[]
): FakedRawVoteResults[] {
	return results.filter((result) =>
		result.party ? parties.map((party) => party.name).includes(result.party.name) : false
	);
}
