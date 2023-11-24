import {
	bhumjaithaiParty,
	democratsParty,
	movingForwardParty,
	pheuThaiParty,
	prachachatParty
} from './party';
import { candidateVoting, defaultVoteOptions } from './voting';
import type { DefaultVoteOption, CustomVoteOption } from '$models/voting';
import type { Politician } from '$models/politician';

export type ResultByPerson = Pick<Politician, 'id' | 'prefix' | 'firstname' | 'lastname'> & {
	position: string;
	role: string;
	party?: string;
	voteOption: DefaultVoteOption | CustomVoteOption | string;
};

export function createMockVotes(isCandidateVoting: boolean): ResultByPerson[] {
	return [
		...getFakedMPResultByPersons({ party: movingForwardParty.name, isCandidateVoting }),
		...getFakedMPResultByPersons({ party: pheuThaiParty.name, isCandidateVoting }),
		...getFakedMPResultByPersons({ party: prachachatParty.name, isCandidateVoting }),
		...getFakedMPResultByPersons({ party: bhumjaithaiParty.name, isCandidateVoting }),
		...getFakedMPResultByPersons({ party: democratsParty.name, isCandidateVoting }),
		...getFakedSenateResultByPersons({ isCandidateVoting })
	];
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
