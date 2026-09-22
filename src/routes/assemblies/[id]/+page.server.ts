import type { VoteCardProps } from '$components/VoteCard/VoteCard.svelte';
import { getRoleChanges } from '$lib/politigraph/assembly/change';
import { getMemberGroup, noParty } from '$lib/politigraph/assembly/groupby';
import {
	queryAssemblyMembers,
	parseMemberWithAssemblyRoles,
	type AssemblyMember,
	getAvailableAssemblies
} from '$lib/politigraph/assembly/member';
import { setBillNicknameFromTitleAsFallback } from '$lib/politigraph/bill/summary';
import { graphql } from '$lib/politigraph/client';
import type { Bill, BillStatus } from '$lib/politigraph/genql';
import { toVoteCardProps } from '$lib/politigraph/vote/card';
import { createSeo } from '$lib/seo';
import { GroupByOption } from '$models/assembly';
import { error } from '@sveltejs/kit';
import { interpolateRainbow } from 'd3-scale-chromatic';
import dayjs from 'dayjs';

const MAX_LATEST_VOTE = 5;
const MAX_LATEST_BILL = 10;
const MAX_CHANGES = 5;

export interface BillSummary {
	id: string;
	nickname: string;
	proposalDate: Bill['proposal_date'];
	status: BillStatus;
}

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

export async function load({ params }) {
	const {
		organizations: [organization]
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
			dissolution_date: true,
			updated_at: true,
			created_at: true,
			created_motions: {
				__args: {
					where: { typename: ['Bill'] },
					sort: [{ proposal_date: 'DESC' }],
					limit: MAX_LATEST_BILL
				},
				__typename: true,
				on_Bill: {
					id: true,
					title: true,
					nickname: true,
					status: true,
					proposal_date: true
				}
			}
		}
	});

	if (!organization) {
		error(404);
	}

	const { created_motions, ...assembly } = organization;

	const [availableAssemblies, members] = await Promise.all([
		getAvailableAssemblies({ classification: assembly.classification }),
		queryAssemblyMembers(assembly)
	]);

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

	const latestVoteEvents: VoteCardProps[] = await Promise.all(
		voteEvents.map((voteEvent) => toVoteCardProps(voteEvent))
	);

	const latestBills: BillSummary[] = isCabinet
		? created_motions
				.filter((motion) => motion.__typename === 'Bill')
				.map(({ status, proposal_date, ...bill }) => ({
					...setBillNicknameFromTitleAsFallback(bill),
					proposalDate: proposal_date,
					status
				}))
		: [];

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
