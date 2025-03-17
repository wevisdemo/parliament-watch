import type { HighlightedVoteByGroup } from '$components/VoteCard/VoteCard.svelte';
import { logger } from '$lib/logger';
import { AssemblyName, type Assembly } from '$models/assembly';
import type { Party } from '$models/party';
import type { Politician } from '$models/politician';
import type { Vote } from '$models/vote';
import {
	DefaultVoteOption,
	DefaultVotingResult,
	type CustomVoteOption,
	type Voting,
	defaultVoteOptions
} from '$models/voting';
import { getAssemblyMembers } from './assembly-member';
import { safeFind } from './processor';
import dayjs from 'dayjs';

export interface VoteOptionCounter {
	[option: string]: number;
}

interface PartyCounterRecord {
	[name: string]: {
		party: Party;
		resultSummary: VoteOptionCounter;
	};
}

export type ResultByPerson = Pick<Politician, 'id' | 'prefix' | 'firstname' | 'lastname'> & {
	role: string;
	party?: Party;
	voteOption: DefaultVoteOption | CustomVoteOption | string;
};

export function getHighlightedVoteByGroups(
	voting: Voting,
	votes: Vote[],
	politicians: Politician[],
	assemblies: Assembly[]
): HighlightedVoteByGroup[] {
	const winningOption = getWinningOption(voting.result);
	const participatedVotes = votes.filter(({ votingId }) => votingId === voting.id);

	return groupVoteByAffiliations(voting, participatedVotes, politicians, assemblies)
		.map(({ name, resultSummary }) => ({
			name,
			count: resultSummary[winningOption],
			total: Object.values(resultSummary).reduce((total, count) => total + count, 0)
		}))
		.filter(({ count }) => count > 0);
}

export function groupVoteByAffiliations(
	voting: Voting,
	votes: Vote[],
	politicians: Politician[],
	assemblies: Assembly[]
) {
	const initCounterRecord = () =>
		voting.voteOptions.reduce<VoteOptionCounter>(
			(obj, option) => ({ ...obj, [typeof option === 'string' ? option : option.label]: 0 }),
			{}
		);

	const votingDay = dayjs(voting.date);

	const initVoteOptionRecord = (): {
		resultSummary: VoteOptionCounter;
		byParties: PartyCounterRecord;
	} => ({ resultSummary: initCounterRecord(), byParties: {} });

	const groups = votes.reduce(
		(counter, { politicianId, voteOption }) => {
			let group: keyof typeof counter;

			try {
				const politician = safeFind(politicians, ({ id }) => id === politicianId);
				const assemblyRole = politician.assemblyRoles.find((ar) =>
					voting.participatedAssemblies.some((a) => a.id === ar.assembly.id)
				);

				if (!assemblyRole) {
					logger.warn(
						{
							votingNickname: voting.nickname,
							participatedAssemblies: voting.participatedAssemblies.map(({ id }) => id)
						},
						'politician is not a member of any participated assembles but their vote exist'
					);

					return counter;
				}

				if (assemblyRole.assembly.name === AssemblyName.Senates) {
					group = 'สว.';
				} else {
					const partyRole = politician.partyRoles.find(
						({ startedAt, endedAt }) =>
							voting.date.getTime() >= startedAt.getTime() &&
							(!endedAt || voting.date.getTime() <= endedAt.getTime())
					);

					if (partyRole) {
						const assemblyWithPartyGroup =
							assemblyRole.assembly.governmentParties.length ||
							assemblyRole.assembly.oppositionParties.length
								? assemblyRole.assembly
								: assemblies.find(
										(a) =>
											(a.governmentParties.length || a.oppositionParties.length) &&
											votingDay.isAfter(a.startedAt) &&
											(!a.endedAt || votingDay.isBefore(a.endedAt))
									);

						group = assemblyWithPartyGroup?.governmentParties.some(
							({ name }) => name === partyRole.party.name
						)
							? 'สส.ฝ่ายรัฐบาล'
							: assemblyWithPartyGroup?.oppositionParties.some(
										({ name }) => name === partyRole.party.name
								  )
								? 'สส.ฝ่ายค้าน'
								: 'สส.ไม่ทราบฝ่าย';

						if (!counter[group].byParties[partyRole.party.name]) {
							counter[group].byParties[partyRole.party.name] = {
								party: partyRole.party,
								resultSummary: initCounterRecord()
							};
						}

						counter[group].byParties[partyRole.party.name].resultSummary[voteOption]++;
					} else {
						group = 'สส.ไม่สังกัดพรรค';

						logger.warn(
							{
								politicianId: politician.id,
								votingNickname: voting.nickname,
								votingDate: voting.date.toLocaleDateString()
							},
							'Could not find politician party on the voting day'
						);
					}
				}

				counter[group].resultSummary[voteOption]++;
			} catch (e) {
				logger.error({ politicianId }, 'Could not find politician');
			}

			return counter;
		},
		{
			'สส.ฝ่ายรัฐบาล': initVoteOptionRecord(),
			'สส.ฝ่ายค้าน': initVoteOptionRecord(),
			'สส.ไม่ทราบฝ่าย': initVoteOptionRecord(),
			'สส.ไม่สังกัดพรรค': initVoteOptionRecord(),
			'สว.': initVoteOptionRecord()
		}
	);

	return Object.entries(groups).map(([name, { resultSummary, byParties }]) => ({
		name,
		resultSummary,
		byParties: Object.values(byParties)
	}));
}

export function getVoteResultsByPerson(
	voting: Voting,
	votes: Vote[],
	politicians: Politician[]
): ResultByPerson[] {
	return votes.reduce<ResultByPerson[]>((list, { politicianId, voteOption }) => {
		const { id, prefix, firstname, lastname, partyRoles } = safeFind(
			politicians,
			(politician) => politician.id === politicianId
		);

		const assemblyMember = voting.participatedAssemblies
			.map((assembly) => getAssemblyMembers(assembly, politicians))
			.flat()
			.find((member) => member.id === politicianId);

		if (assemblyMember) {
			const { assemblyRole } = assemblyMember;

			list.push({
				id,
				prefix,
				firstname,
				lastname,
				role: `${assemblyMember.assemblyRole?.assembly.abbreviation}${
					assemblyRole?.listNumber ? ' บัญชีรายชื่อ' : assemblyRole?.province ? ' เขต' : ''
				}`,
				party: partyRoles.find(
					({ startedAt, endedAt }) =>
						voting.date.getTime() >= startedAt.getTime() &&
						(!endedAt || voting.date.getTime() <= endedAt.getTime())
				)?.party,
				voteOption
			});
		}

		return list;
	}, []);
}

export function getWinningOption(result: string) {
	switch (result) {
		case DefaultVotingResult.Passed:
			return DefaultVoteOption.Agreed;
		case DefaultVotingResult.Failed:
			return DefaultVoteOption.Disagreed;
		default:
			return result;
	}
}

export function getSortedUniqueVoteOptions(
	list: { voteOption: DefaultVoteOption | CustomVoteOption | string }[]
) {
	return [
		...defaultVoteOptions,
		...new Set(
			list
				.flatMap(({ voteOption }) =>
					typeof voteOption === 'string' ? voteOption : voteOption.label
				)
				.filter((voteOption) => !defaultVoteOptions.includes(voteOption))
		)
	];
}
