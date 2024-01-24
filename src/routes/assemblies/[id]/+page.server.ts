import dayjs from 'dayjs';
import { AssemblyName, GroupByOption } from '$models/assembly';
import type { Party } from '$models/party';
import type { Politician } from '$models/politician';
import {
	fetchAssemblies,
	fetchFromIdOr404,
	fetchPoliticians,
	fetchVotes,
	fetchVotings
} from '$lib/datasheets';
import { getAssemblyMembers } from '$lib/datasheets/assembly-member';
import { getMemberGroup } from './members/[groupby]/groupby';
import { createSeo } from '../../../utils/seo';
import type { ComponentProps } from 'svelte';
import type VoteCard from '$components/VoteCard/VoteCard.svelte';
import { getHighlightedVoteByGroups } from '$lib/datasheets/voting';

const MAX_LASTEST_VOTE = 5;

export interface Summary {
	totalMembers: number;
	highlightGroup: MemberGroup[];
	groupBySex: MemberGroup[];
	groupByAgeRange: MemberGroup[];
	groupByEducation: MemberGroup[];
	// TODO: not release asset value in phase 1
	// groupByAssetValue: MemberGroup[];
}

export interface MemberGroup {
	name: string;
	total: number;
	parties?: (Pick<Party, 'name' | 'color'> & { count: number })[];
}

export interface MainMember {
	assemblyRole: string;
	politician: Pick<Politician, 'id' | 'firstname' | 'lastname' | 'avatar'>;
	party?: Party;
	description?: string;
}

export async function load({ params }) {
	const fullAssembly = await fetchFromIdOr404(fetchAssemblies, params.id);

	const { mainRoles, ...assembly } = fullAssembly;
	const isSenates = assembly.name === AssemblyName.Senates;

	const politicians = await fetchPoliticians();

	const activeMembers = getAssemblyMembers(fullAssembly, politicians).filter(
		({ assemblyRole }) =>
			!assemblyRole?.endedAt ||
			(assembly.endedAt && dayjs(assembly.endedAt).isSame(assemblyRole.endedAt))
	);

	const mainMembers = mainRoles.reduce((list, mainRole) => {
		const member = activeMembers.find(({ assemblyRole }) => assemblyRole?.role === mainRole);

		if (!member) return list;

		const { id, firstname, lastname, avatar, partyRole, assemblyRole } = member;

		return [
			...list,
			{
				assemblyRole: mainRole,
				politician: {
					id,
					firstname,
					lastname,
					avatar
				},
				party: partyRole?.party,
				description: assemblyRole?.appointmentMethod
			}
		];
	}, [] as MainMember[]);

	const parseMemberGroup = (groupBy: GroupByOption) =>
		getMemberGroup(fullAssembly, activeMembers, groupBy, isSenates).map((group) => ({
			name: group.name,
			...('subgroups' in group
				? {
						parties: group.subgroups.map((party) => ({
							...party,
							color: party.members[0].partyRole?.party.color as string,
							count: party.members.length
						})),
						total: group.subgroups.reduce((sum, subGroup) => sum + subGroup.members.length, 0)
				  }
				: {
						total: group.members.length
				  })
		}));

	const summary: Summary = {
		totalMembers: activeMembers.length,
		highlightGroup: parseMemberGroup(
			isSenates ? GroupByOption.AppointmentMethod : GroupByOption.Party
		),
		groupBySex: parseMemberGroup(GroupByOption.Sex),
		groupByAgeRange: parseMemberGroup(GroupByOption.Age),
		groupByEducation: parseMemberGroup(GroupByOption.Education)
		// groupByAssetValue: [],
	};

	const votes = await fetchVotes();

	const latestVotes: ComponentProps<VoteCard>[] = (await fetchVotings())
		.filter(({ participatedAssemblies }) =>
			participatedAssemblies.some(({ id }) => assembly.id === id)
		)
		.sort((a, z) => z.date.getTime() - a.date.getTime())
		.slice(0, MAX_LASTEST_VOTE)
		.map((voting) => ({
			voting,
			highlightedVoteByGroups: getHighlightedVoteByGroups(voting, votes, politicians)
		}));

	const assemblyIds: string[] = (await fetchAssemblies()).map(({ id }) => id);

	return {
		assemblyIds,
		assembly,
		summary,
		mainMembers,
		latestVotes,
		seo: createSeo({
			title: `${assembly.name} ${assembly.term}`
		})
	};
}
