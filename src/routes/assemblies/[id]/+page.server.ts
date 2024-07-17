import type { AvailableAssembly } from '$components/Assemblies/AssemblyIdRunner.svelte';
import { getSenateColorByTitle } from '$components/Assemblies/shared';
import type VoteCard from '$components/VoteCard/VoteCard.svelte';
import {
	fetchAssemblies,
	fetchFromIdOr404,
	fetchPoliticians,
	fetchVotes,
	fetchVotings
} from '$lib/datasheets';
import { getAssemblyMembers } from '$lib/datasheets/assembly-member';
import type { AssemblyMember } from '$lib/datasheets/assembly-member';
import { getHighlightedVoteByGroups } from '$lib/datasheets/voting';
import { createSeo } from '$lib/seo';
import { AssemblyName, GroupByOption } from '$models/assembly';
import type { Party } from '$models/party';
import type { Politician } from '$models/politician';
import { getMemberGroup } from './members/[groupby]/groupby';
import dayjs from 'dayjs';
import type { ComponentProps } from 'svelte';

const MAX_LATEST_VOTE = 5;

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
	parties?: (Pick<Party, 'name' | 'color'> & { count: number; members?: AssemblyMember[] })[];
}

export interface MainMember {
	assemblyRole: string;
	politician: Pick<Politician, 'id' | 'firstname' | 'lastname' | 'avatar'>;
	party?: Party;
	description: string | null;
}

export async function load({ params }) {
	const fullAssembly = await fetchFromIdOr404(fetchAssemblies, params.id);

	const { mainRoles, ...assembly } = fullAssembly;
	const isSenates = assembly.name === AssemblyName.Senates;
	const isCabinet = assembly.name === AssemblyName.Cabinet;

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
				description: assemblyRole?.appointmentMethod || null
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

	const highlightGroup = parseMemberGroup(
		isSenates ? GroupByOption.AppointmentMethod : GroupByOption.Party
	);
	const groupBySex = parseMemberGroup(GroupByOption.Sex);
	const groupByAgeRange = parseMemberGroup(GroupByOption.Age);
	const groupByEducation = parseMemberGroup(GroupByOption.Education);

	const summary: Summary = {
		totalMembers: activeMembers.length,
		highlightGroup: isCabinet
			? [
					{
						name: 'คณะรัฐมนตรี',
						parties: highlightGroup.reduce<Exclude<MemberGroup['parties'], undefined>>(
							(list, group) => ('parties' in group ? [...list, ...group.parties] : list),
							[]
						),
						total: highlightGroup.reduce((sum, { total }) => sum + total, 0)
					}
				]
			: highlightGroup,
		groupBySex: isSenates ? getSenateGroupWithColor(groupBySex) : groupBySex,
		groupByAgeRange: isSenates ? getSenateGroupWithColor(groupByAgeRange) : groupByAgeRange,
		groupByEducation: isSenates ? getSenateGroupWithColor(groupByEducation) : groupByEducation
		// groupByAssetValue: [],
	};

	const votes = isCabinet ? [] : await fetchVotes();

	const latestVotes: ComponentProps<VoteCard>[] | null = isCabinet
		? null
		: (await fetchVotings())
				.filter(({ participatedAssemblies }) =>
					participatedAssemblies.some(({ id }) => assembly.id === id)
				)
				.sort((a, z) => z.date.getTime() - a.date.getTime())
				.slice(0, MAX_LATEST_VOTE)
				.map((voting) => ({
					voting,
					highlightedVoteByGroups: getHighlightedVoteByGroups(voting, votes, politicians)
				}));

	const availableAssemblies: AvailableAssembly[] = (await fetchAssemblies()).map(
		({ id, name, term }) => ({
			id,
			name,
			term
		})
	);

	// TODO: calculated real changes
	const changes = isCabinet ? mockChanges : null;

	return {
		availableAssemblies,
		assembly,
		isCabinet,
		summary,
		mainMembers,
		latestVotes,
		changes,
		seo: createSeo({
			title: `${assembly.name} ${assembly.term}`
		})
	};
}

const getSenateGroupWithColor = (memberGroup: MemberGroup[]): MemberGroup[] => {
	return memberGroup.map((group) => {
		const parties = group.parties?.map((party) => {
			return {
				...party,
				color: getSenateColorByTitle(party.name)
			};
		});
		return { ...group, parties };
	});
};

const mockChanges = [
	{
		date: new Date('2024-05-27'),
		type: 'in',
		politician: {
			id: 'มาริษ-เสงี่ยมพงษ์',
			firstname: 'มาริษ',
			lastname: 'เสงี่ยมพงษ์',
			avatar: 'https://placehold.co/128x128',
			party: {
				name: 'เพื่อไทย',
				logo: 'https://placehold.co/64x64/white/blue?text=PT',
				color: 'blue'
			}
		},
		role: 'รัฐมนตรีว่าการกระทรวงต่างประเทศ'
	},
	{
		date: new Date('2024-05-27'),
		type: 'out',
		politician: {
			id: 'ปานปรีย์-พหิทธานุกร',
			firstname: 'ปานปรีย์',
			lastname: 'พหิทธานุกร',
			avatar: 'https://placehold.co/128x128',
			party: {
				name: 'เพื่อไทย',
				logo: 'https://placehold.co/64x64/white/blue?text=PT',
				color: 'blue'
			}
		},
		role: 'รัฐมนตรีว่าการกระทรวงต่างประเทศ'
	},
	{
		date: new Date('2024-05-27'),
		type: 'in',
		politician: {
			id: 'สุริยะ-จึงรุ่งเรืองกิจ',
			firstname: 'สุริยะ',
			lastname: 'จึงรุ่งเรืองกิจ',
			avatar: 'https://placehold.co/128x128',
			party: {
				name: 'เพื่อไทย',
				logo: 'https://placehold.co/64x64/white/blue?text=PT',
				color: 'blue'
			}
		},
		role: 'รองนายกรัฐมนตรี'
	},
	{
		date: new Date('2024-05-20'),
		type: 'out',
		politician: {
			id: 'ปานปรีย์-พหิทธานุกร',
			firstname: 'ปานปรีย์',
			lastname: 'พหิทธานุกร',
			avatar: 'https://placehold.co/128x128',
			party: {
				name: 'เพื่อไทย',
				logo: 'https://placehold.co/64x64/white/blue?text=PT',
				color: 'blue'
			}
		},
		role: 'รองนายกรัฐมนตรี'
	}
];
