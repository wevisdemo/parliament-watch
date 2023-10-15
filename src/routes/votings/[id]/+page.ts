import type { Party } from '$models/party';
import { type Voting, DefaultVoteOption, type CustomVoteOption } from '$models/voting';
import {
	passedVoting,
	failedVoting,
	candidateVoting,
	defaultVoteOptions,
	customVoteOption
} from '../../../mocks/data/voting';
import {
	bhumjaithaiParty,
	democratsParty,
	movingForwardParty,
	pheuThaiParty,
	prachachatParty
} from '../../../mocks/data/party';
import type { Politician } from '$models/politician';

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

export interface ResultsByPerson {
	parties: string[];
	positions: string[];
	results: ResultByPerson[];
}

export type ResultByPerson = Pick<Politician, 'id' | 'prefix' | 'firstname' | 'lastname'> & {
	position: string;
	role: string;
	party?: string;
	voteOption: DefaultVoteOption | CustomVoteOption | string;
};

export function load({ params }) {
	const requestedId = Number(params.id);

	/*
	 * | requestedId | Passed? | Default? | House  | Government Formed? |
	 * | ----------- | ------- | -------- | ------ | ------------------ |
	 * | 1           | T       | T        | Joint  | T                  |
	 * | 2           | F       | T        | Joint  | T                  |
	 * | 3           | T       | F (Cand) | Joint  | T                  |
	 * | 4           | T       | F (Cand) | Joint  | F                  |
	 * | 5           | T       | T        | Joint  | F                  |
	 * | 6           | T       | T        | MP     | T                  |
	 * | 7           | T       | T        | MP     | F                  |
	 * | 8           | T       | T        | Senate | T                  |
	 */
	const isFailedVoting = requestedId === 2;
	const isCandidateVoting = requestedId === 3 || requestedId === 4;
	const isGovernmentFormed = ![4, 5, 7].includes(requestedId);
	const isOnlyMPs = [6, 7].includes(requestedId);
	const isOnlySenates = requestedId === 8;

	const rawVotes = getRawVoteResults(isCandidateVoting);

	const voting: Voting = {
		...(isCandidateVoting ? candidateVoting : isFailedVoting ? failedVoting : passedVoting),
		id: requestedId
	};

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

	const resultsByPerson: ResultsByPerson = {
		parties: [
			movingForwardParty.name,
			pheuThaiParty.name,
			prachachatParty.name,
			bhumjaithaiParty.name,
			democratsParty.name
		],
		positions: ['สมาชิกสภาผู้แทนราษฎร', 'สมาชิกวุฒิสภา'],
		results: [
			...getFakedMPResultByPersons({ party: movingForwardParty.name, isCandidateVoting }),
			...getFakedMPResultByPersons({ party: pheuThaiParty.name, isCandidateVoting }),
			...getFakedMPResultByPersons({ party: bhumjaithaiParty.name, isCandidateVoting }),
			...getFakedSenateResultByPersons({ isCandidateVoting })
		]
	};

	return {
		voting,
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

function getFakedMPResultByPersons(options: {
	party: ResultByPerson['party'];
	isCandidateVoting?: boolean;
}): ResultByPerson[] {
	const roles = ['สส. แบ่งเขต จ. ระยอง', 'สส. บัญชีรายชื่อ'];
	return getFakedResultByPersons({ roles, position: 'สมาชิกสภาผู้แทนราษฎร', ...options });
}

function getFakedSenateResultByPersons(options: { isCandidateVoting?: boolean }): ResultByPerson[] {
	const roles = ['สว. เลือกโดย คสช.', 'สว. เลือกกันเอง', 'สว. โดยตำแหน่ง'];
	return getFakedResultByPersons({ roles, position: 'สมาชิกวุฒิสภา', ...options });
}

function getFakedResultByPersons({
	roles,
	position,
	party,
	isCandidateVoting
}: {
	roles: string[];
	position: string;
	party?: ResultByPerson['party'];
	isCandidateVoting?: boolean;
}): ResultByPerson[] {
	const voteOptions = isCandidateVoting ? candidateVoting.voteOptions : defaultVoteOptions;

	const cases = roles.reduce(
		(acc: { role: string; voteOption: CustomVoteOption | string }[], role) => [
			...acc,
			...voteOptions.map((voteOption) => ({ role, voteOption }))
		],
		[]
	);

	return cases.map(({ role, voteOption }, i) => {
		const politician =
			i % 2 === 0
				? {
						id: 'กมนทรรศน์-กิตติสุนทรสกุล',
						firstname: 'กมนทรรศน์',
						lastname: 'กิตติสุนทรสกุล'
				  }
				: {
						id: 'พหล-สง่าเนตร',
						firstname: 'สง่าเนตร',
						lastname: 'กิตติสุนทรสกุล'
				  };

		return {
			...politician,
			position,
			role,
			party,
			voteOption
		};
	});
}
