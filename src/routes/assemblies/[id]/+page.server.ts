import type { AvailableAssembly } from '$components/Assemblies/AssemblyIdRunner.svelte';
import { getSenateColorByTitle } from '$components/Assemblies/shared';
import type VoteCard from '$components/VoteCard/VoteCard.svelte';
import {
	fetchAssemblies,
	fetchBills,
	fetchFromIdOr404,
	fetchPoliticians,
	fetchVotes,
	fetchVotings
} from '$lib/datasheets';
import { getAssemblyMembers } from '$lib/datasheets/assembly-member';
import type { AssemblyMember } from '$lib/datasheets/assembly-member';
import { getHighlightedVoteByGroups } from '$lib/datasheets/voting';
import { toVoteCardVoting } from '$lib/model-component-adapters/votecardvoting';
import { createSeo } from '$lib/seo';
import { AssemblyName, GroupByOption } from '$models/assembly';
import type { Bill } from '$models/bill';
import type { Party } from '$models/party';
import type { PartyRoleHistory, Politician } from '$models/politician';
import { getMemberGroup, noParty } from './members/[groupby]/groupby';
import dayjs from 'dayjs';
import type { ComponentProps } from 'svelte';

const MAX_LATEST_VOTE = 5;
const MAX_LATEST_BILL = 10;
const MAX_CHANGES = 5;

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
	senateMembers?: AssemblyMember[];
	parties?: (Pick<Party, 'name' | 'color'> & { count: number; members?: AssemblyMember[] })[];
}

export interface MainMember {
	assemblyRole: string;
	politician: Pick<Politician, 'id' | 'firstname' | 'lastname' | 'avatar'>;
	party?: Party;
	description: string | null;
}

export interface RoleChange {
	date: Date;
	type: 'in' | 'out';
	politician: Pick<Politician, 'id' | 'firstname' | 'lastname' | 'avatar'> & { party: Party };
	role: string;
}

export type BillSummary = Pick<Bill, 'id' | 'proposedOn' | 'nickname' | 'status'>;

export async function load({ params }) {
	const fullAssembly = await fetchFromIdOr404(fetchAssemblies, params.id);
	const assemblies = await fetchAssemblies();

	const assemblyLatestDay = dayjs(fullAssembly.endedAt ?? new Date());

	// Take government/opposition parties from overlapsed assembly if not defined
	if (!fullAssembly.governmentParties.length || !fullAssembly.governmentParties.length) {
		const assemblyWithPartyGroup = assemblies
			.filter((a) => (!a.endedAt && a.governmentParties.length) || a.oppositionParties.length)
			.map((a) => ({
				...a,
				endedAt: a.endedAt ?? new Date()
			}))
			.filter(
				(a) =>
					assemblyLatestDay.isAfter(a.startedAt) &&
					(assemblyLatestDay.isSame(a.endedAt) || assemblyLatestDay.isBefore(a.endedAt))
			)
			.sort((z, a) => z.endedAt.getTime() - a.endedAt.getTime())
			.at(0);

		if (assemblyWithPartyGroup) {
			fullAssembly.governmentParties = assemblyWithPartyGroup.governmentParties;
			fullAssembly.oppositionParties = assemblyWithPartyGroup.oppositionParties;
		}
	}

	const { mainRoles, ...assembly } = fullAssembly;
	const isSenates = assembly.name === AssemblyName.Senates;
	const isCabinet = assembly.name === AssemblyName.Cabinet;

	const politicians = await fetchPoliticians();

	const activeMembers = getAssemblyMembers(fullAssembly, politicians).filter(
		({ assemblyRole }) =>
			!assemblyRole?.endedAt ||
			(assembly.endedAt && !dayjs(assembly.endedAt).isAfter(assemblyRole.endedAt))
	);

	const mainMembers = isCabinet
		? activeMembers.filter(({ assemblyRole }) => assemblyRole?.role).map(parseMainMember)
		: mainRoles.reduce((list, mainRole) => {
				const member = activeMembers.find(({ assemblyRole }) => assemblyRole?.role === mainRole);

				return member ? [...list, parseMainMember(member)] : list;
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
						senateMembers: group.members,
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
					voting: toVoteCardVoting(
						voting,
						getHighlightedVoteByGroups(voting, votes, politicians, assemblies)
					)
				}));

	const latestBills: BillSummary[] | null = isCabinet
		? (await fetchBills())
				.filter((bill) => bill.proposedByAssembly && bill.proposedByAssembly.id === assembly.id)
				.sort((a, b) => b.proposedOn.getTime() - a.proposedOn.getTime())
				.slice(0, MAX_LATEST_BILL)
				.map(({ id, proposedOn, nickname, status }) => ({
					id,
					proposedOn,
					nickname,
					status
				}))
		: null;

	const availableAssemblies: AvailableAssembly[] = (await fetchAssemblies()).map(
		({ id, name, term }) => ({
			id,
			name,
			term
		})
	);

	function getPartyRoleAtDate(
		partyRoles: Omit<PartyRoleHistory, 'politicianId'>[],
		date: Date
	): PartyRoleHistory['party'] {
		const maybePartyRole = partyRoles
			.filter(({ startedAt, endedAt }) => startedAt <= date && (!endedAt || date < endedAt))
			.sort((a, z) => z.startedAt.getTime() - a.startedAt.getTime())
			.at(-1);

		return maybePartyRole?.party || noParty;
	}

	const getChanges = (): RoleChange[] => {
		const changes: RoleChange[] = [];
		for (const member of politicians) {
			member.assemblyRoles.forEach((role) => {
				if (role.assembly.name !== AssemblyName.Cabinet || role.assembly.id !== fullAssembly.id) {
					return;
				}
				changes.push({
					date: role.startedAt,
					type: 'in',
					role: role.role,
					politician: {
						avatar: member.avatar,
						firstname: member.firstname,
						lastname: member.lastname,
						id: member.id,
						party: getPartyRoleAtDate(member.partyRoles, role.startedAt)
					}
				});

				if (role.endedAt) {
					changes.push({
						date: role.endedAt,
						type: 'out',
						role: role.role,
						politician: {
							avatar: member.avatar,
							firstname: member.firstname,
							lastname: member.lastname,
							id: member.id,
							party: getPartyRoleAtDate(member.partyRoles, role.startedAt)
						}
					});
				}
			});
		}
		return changes.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, MAX_CHANGES);
	};

	const changes = isCabinet ? getChanges() : null;

	return {
		availableAssemblies,
		assembly,
		isCabinet,
		summary,
		mainMembers,
		changes,
		latestVotes,
		latestBills,
		seo: createSeo({
			title: `${assembly.name} ${assembly.term}`
		})
	};
}

function getSenateGroupWithColor(memberGroup: MemberGroup[]): MemberGroup[] {
	return memberGroup.map((group) => {
		const parties = group.parties?.map((party) => {
			return {
				...party,
				color: getSenateColorByTitle(party.name)
			};
		});
		return { ...group, parties };
	});
}

function parseMainMember(member: ReturnType<typeof getAssemblyMembers>[number]): MainMember {
	const { id, firstname, lastname, avatar, partyRole, assemblyRole } = member;

	return {
		assemblyRole: assemblyRole?.role || '',
		politician: {
			id,
			firstname,
			lastname,
			avatar
		},
		party: partyRole?.party,
		description: assemblyRole?.appointmentMethod || null
	};
}
