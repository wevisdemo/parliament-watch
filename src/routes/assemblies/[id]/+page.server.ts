import { getSenateColorByTitle } from '$components/Assemblies/shared';
import type VoteCard from '$components/VoteCard/VoteCard.svelte';
import { fetchBills } from '$lib/datasheets';
import { graphql } from '$lib/politigraph';
import { getRoleChanges } from '$lib/politigraph/assembly/change';
import { getMemberGroup, noParty } from '$lib/politigraph/assembly/groupby';
import {
	queryAssemblyMembers,
	parseMainMember,
	type AssemblyMember
} from '$lib/politigraph/assembly/member';
import { countVotesInEachOption } from '$lib/politigraph/vote/group';
import { groupVotesByAffiliation } from '$lib/politigraph/vote/group';
import { queryPoliticiansVote } from '$lib/politigraph/vote/with-politician';
import { createSeo } from '$lib/seo';
import { GroupByOption } from '$models/assembly';
import type { Bill } from '$models/bill';
import { error } from '@sveltejs/kit';
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
	parties?: { name: string; color: string; count: number; members?: AssemblyMember[] }[];
}

export type BillSummary = Pick<Bill, 'id' | 'proposedOn' | 'nickname' | 'status'>;

export async function load({ params }) {
	const {
		organizations: [assembly]
	} = await graphql.query({
		organizations: {
			__args: {
				where: {
					id_EQ: params.id
				},
				limit: 1
			},
			id: true,
			name: true,
			classification: true,
			term: true,
			description: true,
			founding_date: true,
			dissolution_date: true
		}
	});

	if (!assembly) {
		error(404);
	}

	const { organizations: availableAssemblies } = await graphql.query({
		organizations: {
			__args: {
				where: {
					classification_EQ: assembly.classification
				}
			},
			id: true,
			term: true
		}
	});

	const members = await queryAssemblyMembers(assembly);

	const isSenates = assembly.classification === 'HOUSE_OF_SENATE';
	const isCabinet = assembly.classification === 'CABINET';

	const activeMembers = members.filter(({ memberships }) => {
		const assemblyMembership = memberships.find(
			(m) => m.posts[0].organizations[0].id === assembly.id
		);

		if (!assemblyMembership) return false;

		return (
			!assemblyMembership.end_date ||
			(assembly.dissolution_date &&
				!dayjs(assembly.dissolution_date).isAfter(assemblyMembership.end_date))
		);
	});

	const mainMembers = activeMembers
		.filter(
			({ memberships }) =>
				!memberships
					.find((m) => m.posts[0].organizations[0].id === assembly.id)
					?.posts[0].role.startsWith('สมาชิก')
		)
		.map(parseMainMember);

	const parseMemberGroup = (groupBy: GroupByOption) =>
		getMemberGroup(activeMembers, groupBy, isSenates).map((group) => ({
			name: group.name,
			...('subgroups' in group
				? {
						parties: group.subgroups.map((party) => ({
							...party,
							color:
								party.members[0].memberships.find(
									(m) => m.posts[0].organizations[0].classification === 'POLITICAL_PARTY'
								)?.posts[0].organizations[0]?.color ?? noParty.color,
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
	};

	const { voteEvents } = isCabinet
		? { voteEvents: [] }
		: await graphql.query({
				voteEvents: {
					__args: {
						where: {
							organizations_SOME: {
								id_EQ: params.id
							}
						},
						sort: [{ start_date: 'DESC' }],
						limit: MAX_LATEST_VOTE
					},
					id: true,
					title: true,
					nickname: true,
					start_date: true,
					result: true,
					end_date: true,
					organizations: {
						id: true
					}
				}
			});

	const latestVoteEvents: ComponentProps<VoteCard>[] = await Promise.all(
		voteEvents.map(async (voteEvent) => ({
			...voteEvent,
			date: voteEvent.start_date,
			votesByGroup: groupVotesByAffiliation(await queryPoliticiansVote(voteEvent)).map((aff) => ({
				name: aff.name,
				options: countVotesInEachOption(aff.votes)
			}))
		}))
	);

	const latestBills: BillSummary[] = isCabinet
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
		: [];

	const changes = isCabinet ? getRoleChanges(assembly.id, members, MAX_CHANGES) : null;

	return {
		availableAssemblies,
		assembly,
		isCabinet,
		summary,
		mainMembers,
		changes,
		latestVoteEvents,
		latestBills,
		seo: createSeo({
			title: assembly.name
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
