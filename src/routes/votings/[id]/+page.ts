import type { Party } from '$models/party';
import { type Voting, DefaultVoteOption, type CustomVoteOption } from '$models/voting';
import {
	passedVoting,
	failedVoting,
	candidateVoting,
	defaultVoteOptions
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

export interface ResultByAffiliation {
	affiliationName: string;
	resultSummary: Results;
	byParties?: {
		party: Party;
		resultSummary: Results;
	}[];
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
	const isFailedVoting = requestedId === failedVoting.id;
	const isCandidateVoting = requestedId === candidateVoting.id;

	const voting: Voting = {
		...(isCandidateVoting ? candidateVoting : isFailedVoting ? failedVoting : passedVoting),
		id: requestedId
	};

	const results: Results = [
		{ voteOption: DefaultVoteOption.Agreed, total: 675 },
		{ voteOption: DefaultVoteOption.Abstain, total: 18 },
		{ voteOption: DefaultVoteOption.Novote, total: 18 },
		{ voteOption: DefaultVoteOption.Absent, total: 18 },
		{ voteOption: DefaultVoteOption.Disagreed, total: 21 }
	];

	const resultsByAffiliation: ResultsByAffiliation = [
		{
			affiliationName: 'สส.ฝ่ายรัฐบาล',
			resultSummary: [
				{ voteOption: DefaultVoteOption.Agreed, total: 300 },
				{ voteOption: DefaultVoteOption.Abstain, total: 3 },
				{ voteOption: DefaultVoteOption.Novote, total: 3 },
				{ voteOption: DefaultVoteOption.Absent, total: 3 },
				{ voteOption: DefaultVoteOption.Disagreed, total: 3 }
			],
			byParties: [
				{
					party: movingForwardParty,
					resultSummary: [
						{ voteOption: DefaultVoteOption.Agreed, total: 151 },
						{ voteOption: DefaultVoteOption.Abstain, total: 0 },
						{ voteOption: DefaultVoteOption.Novote, total: 0 },
						{ voteOption: DefaultVoteOption.Absent, total: 0 },
						{ voteOption: DefaultVoteOption.Disagreed, total: 0 }
					]
				},
				{
					party: pheuThaiParty,
					resultSummary: [
						{ voteOption: DefaultVoteOption.Agreed, total: 71 },
						{ voteOption: DefaultVoteOption.Abstain, total: 64 },
						{ voteOption: DefaultVoteOption.Novote, total: 3 },
						{ voteOption: DefaultVoteOption.Absent, total: 3 },
						{ voteOption: DefaultVoteOption.Disagreed, total: 3 }
					]
				},
				{
					party: prachachatParty,
					resultSummary: [
						{ voteOption: DefaultVoteOption.Agreed, total: 10 },
						{ voteOption: DefaultVoteOption.Abstain, total: 0 },
						{ voteOption: DefaultVoteOption.Novote, total: 0 },
						{ voteOption: DefaultVoteOption.Absent, total: 0 },
						{ voteOption: DefaultVoteOption.Disagreed, total: 0 }
					]
				}
			]
		},
		{
			affiliationName: 'สส.ฝ่ายค้าน',
			resultSummary: [
				{ voteOption: DefaultVoteOption.Agreed, total: 180 },
				{ voteOption: DefaultVoteOption.Abstain, total: 2 },
				{ voteOption: DefaultVoteOption.Novote, total: 2 },
				{ voteOption: DefaultVoteOption.Absent, total: 2 },
				{ voteOption: DefaultVoteOption.Disagreed, total: 2 }
			],
			byParties: [
				{
					party: bhumjaithaiParty,
					resultSummary: [
						{ voteOption: DefaultVoteOption.Agreed, total: 139 },
						{ voteOption: DefaultVoteOption.Abstain, total: 0 },
						{ voteOption: DefaultVoteOption.Novote, total: 0 },
						{ voteOption: DefaultVoteOption.Absent, total: 0 },
						{ voteOption: DefaultVoteOption.Disagreed, total: 1 }
					]
				},
				{
					party: democratsParty,
					resultSummary: [
						{ voteOption: DefaultVoteOption.Agreed, total: 33 },
						{ voteOption: DefaultVoteOption.Abstain, total: 2 },
						{ voteOption: DefaultVoteOption.Novote, total: 2 },
						{ voteOption: DefaultVoteOption.Absent, total: 2 },
						{ voteOption: DefaultVoteOption.Disagreed, total: 1 }
					]
				}
			]
		},
		{
			affiliationName: 'สว.',
			resultSummary: [
				{ voteOption: DefaultVoteOption.Agreed, total: 240 },
				{ voteOption: DefaultVoteOption.Abstain, total: 2 },
				{ voteOption: DefaultVoteOption.Novote, total: 2 },
				{ voteOption: DefaultVoteOption.Absent, total: 2 },
				{ voteOption: DefaultVoteOption.Disagreed, total: 3 }
			]
		}
	];

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
			...getFakedMPResultByPersons(movingForwardParty.name),
			...getFakedMPResultByPersons(pheuThaiParty.name),
			...getFakedMPResultByPersons(bhumjaithaiParty.name),
			...getFakedSenateResultByPersons()
		]
	};

	return {
		voting,
		results,
		resultsByAffiliation,
		resultsByPerson
	};
}

function getFakedMPResultByPersons(party: ResultByPerson['party']): ResultByPerson[] {
	const roles = ['สส. แบ่งเขต จ. ระยอง', 'สส. บัญชีรายชื่อ'];
	const voteOptions = defaultVoteOptions;

	const cases = roles.reduce(
		(acc: { role: string; voteOption: string }[], role) => [
			...acc,
			...voteOptions.map((voteOption) => ({ role, voteOption }))
		],
		[]
	);

	return cases.map(({ role, voteOption }) => {
		return {
			id: 'กมนทรรศน์-กิตติสุนทรสกุล',
			firstname: 'กมนทรรศน์',
			lastname: 'กิตติสุนทรสกุล',
			position: 'สมาชิกสภาผู้แทนราษฎร',
			role,
			party,
			voteOption
		};
	});
}

function getFakedSenateResultByPersons(): ResultByPerson[] {
	const roles = ['สว. เลือกโดย คสช.', 'สว. เลือกกันเอง', 'สว. โดยตำแหน่ง'];
	const voteOptions = defaultVoteOptions;

	const cases = roles.reduce(
		(acc: { role: string; voteOption: string }[], role) => [
			...acc,
			...voteOptions.map((voteOption) => ({ role, voteOption }))
		],
		[]
	);

	return cases.map(({ role, voteOption }) => {
		return {
			id: 'พหล-สง่าเนตร',
			firstname: 'สง่าเนตร',
			lastname: 'กิตติสุนทรสกุล',
			position: 'สมาชิกวุฒิสภา',
			role,
			voteOption
		};
	});
}
