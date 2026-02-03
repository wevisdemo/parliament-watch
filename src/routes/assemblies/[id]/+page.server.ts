import type VoteCard from '$components/VoteCard/VoteCard.svelte';
import { getRoleChanges } from '$lib/politigraph/assembly/change';
import { getMemberGroup, noParty } from '$lib/politigraph/assembly/groupby';
import {
	queryAssemblyMembers,
	parseMemberWithAssemblyRoles,
	type AssemblyMember,
	getAvailableAssemblies
} from '$lib/politigraph/assembly/member';
import { graphql } from '$lib/politigraph/server';
import { countVotesInEachOption } from '$lib/politigraph/vote/group';
import { groupVotesByAffiliation } from '$lib/politigraph/vote/group';
import { queryPoliticiansVote } from '$lib/politigraph/vote/with-politician';
import { createSeo } from '$lib/seo';
import { buildVotesSummary, optionsArrayToResultSummary } from '$lib/vote-summary';
import { GroupByOption } from '$models/assembly';
import type { Bill } from '$models/bill';
import { error } from '@sveltejs/kit';
import { interpolateRainbow } from 'd3';
import dayjs from 'dayjs';
import type { ComponentProps } from 'svelte';

const MAX_LATEST_VOTE = 5;
const MAX_CHANGES = 5;

export interface Summary {
	totalMembers: number;
	highlightGroup: MemberGroup[];
	groupBySex: MemberGroup[];
	groupByAgeRange: MemberGroup[];
	groupByEducation: MemberGroup[];
}

export interface MemberGroup {
	name: string;
	total: number;
	members?: AssemblyMember[];
	color?: string;
	subgroups?: { name: string; color: string; count: number; members?: AssemblyMember[] }[];
}

export type BillSummary = Pick<Bill, 'id' | 'proposedOn' | 'nickname' | 'status'>;

export async function load({ params }) {
	const {
		organizations: [assembly]
	} = await graphql.query({
		organizations: {
			__args: {
				where: {
					id: { eq: params.id }
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

	const availableAssemblies = await getAvailableAssemblies({
		classification: assembly.classification
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

	const mainPositions = activeMembers
		.filter(
			({ memberships }) =>
				!memberships
					.find((m) => m.posts[0].organizations[0].id === assembly.id)
					?.posts[0].role.startsWith('สมาชิก')
		)
		.flatMap(parseMemberWithAssemblyRoles)
		.filter((member) => !member.assemblyRole.startsWith('สมาชิก'))
		.sort((a, z) => {
			const getRoleSortingScore = (member: typeof a) =>
				member.assemblyRole.startsWith('ประธาน')
					? 20
					: member.assemblyRole.startsWith('รองประธาน')
						? 10
						: 0;

			return (
				getRoleSortingScore(z) -
				getRoleSortingScore(a) +
				a.assemblyRole.localeCompare(z.assemblyRole)
			);
		});

	const parseMemberGroup = (groupBy: GroupByOption) =>
		getMemberGroup(activeMembers, groupBy, isSenates).map((group) => ({
			name: group.name,
			...('subgroups' in group
				? {
						subgroups: group.subgroups.map((party) => ({
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

	const highlightGroupColorMap = new Map<string, string>(
		highlightGroup.map((group, i) => [
			group.name,
			interpolateRainbow(i / (highlightGroup.length + 1))
		])
	);

	function getSenateGroupWithColor(memberGroup: MemberGroup[]): MemberGroup[] {
		return memberGroup.map(({ subgroups, ...group }) => ({
			...group,
			subgroups: subgroups?.map((subgroup) => ({
				...subgroup,
				color: highlightGroupColorMap.get(subgroup.name) ?? '#A8A8A8'
			}))
		}));
	}

	const summary: Summary = {
		totalMembers: activeMembers.length,
		highlightGroup: isCabinet
			? [
					{
						name: 'คณะรัฐมนตรี',
						subgroups: highlightGroup.reduce<Exclude<MemberGroup['subgroups'], undefined>>(
							(list, group) => ('subgroups' in group ? [...list, ...group.subgroups] : list),
							[]
						),
						total: highlightGroup.reduce((sum, { total }) => sum + total, 0)
					}
				]
			: isSenates
				? highlightGroup.map((group) => ({
						...group,
						color: highlightGroupColorMap.get(group.name)
					}))
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
							organizations: {
								some: {
									id: { eq: params.id }
								}
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
		voteEvents.map(async (voteEvent) => {
			const groupedVotes = groupVotesByAffiliation(await queryPoliticiansVote(voteEvent));
			const groups = groupedVotes.map((aff) => ({
				name: aff.name,
				resultSummary: optionsArrayToResultSummary(countVotesInEachOption(aff.votes))
			}));

			return {
				...voteEvent,
				date: voteEvent.start_date,
				votesSummary: buildVotesSummary({ groups, result: voteEvent.result })
			};
		})
	);

	const latestBills: BillSummary[] = [];

	const changes = isCabinet ? getRoleChanges(assembly.id, members, MAX_CHANGES) : null;

	return {
		availableAssemblies,
		assembly,
		isCabinet,
		summary,
		mainPositions,
		changes,
		latestVoteEvents,
		latestBills,
		seo: createSeo({
			title: assembly.name
		})
	};
}
