import { graphql } from '$lib/politigraph';
import {
	getMemberGroup,
	type PoliticianSubGroup,
	type PoliticianGroup
} from '$lib/politigraph/assembly/groupby';
import { queryAssemblyMembers, type AssemblyMember } from '$lib/politigraph/assembly/member';
import { createSeo } from '$lib/seo';
import { GroupByOption } from '$models/assembly';
import { error } from '@sveltejs/kit';

interface PoliticianSummaryGroup {
	name: string;
	icon?: string;
	members: ReturnType<typeof getPoliticianSummary>[];
}

interface PoliticianSummarySubGroup {
	name: string;
	subgroups: PoliticianSummaryGroup[];
}

export type PoliticianSummaryGroupBy = PoliticianSummaryGroup[] | PoliticianSummarySubGroup[];

export async function load({ params }) {
	const {
		organizations: [assembly]
	} = await graphql.query({
		organizations: {
			__args: {
				where: {
					id_EQ: params.id
				}
			},
			id: true,
			name: true,
			term: true,
			classification: true,
			founding_date: true,
			dissolution_date: true
		}
	});

	if (!assembly || !Object.values(GroupByOption).includes(params.groupby as GroupByOption)) {
		error(404);
	}

	const isSenates = assembly.classification === 'HOUSE_OF_SENATE';
	const isCabinet = assembly.classification === 'CABINET';

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

	const groups = getMemberGroup(members, params.groupby as GroupByOption, isSenates, isCabinet);

	const isDataHasSubgroup = 'subgroups' in groups[0];

	const transformedGroup: PoliticianSummaryGroupBy = isDataHasSubgroup
		? (groups as PoliticianSubGroup[]).map(({ name, ...group }) => ({
				name,
				subgroups: group.subgroups.map((subGroup) => ({
					name: subGroup.name,
					members: subGroup.members.map(getPoliticianSummary)
				}))
			}))
		: (groups as PoliticianGroup[]).map(({ name, ...group }) => ({
				name,
				members: group.members.map(getPoliticianSummary)
			}));

	return {
		assembly: {
			id: assembly.id,
			name: assembly.name,
			term: assembly.term as number,
			startedAt: new Date(assembly.founding_date as string)
		},
		groups: transformedGroup,
		isDataHasSubgroup,
		availableAssemblies,
		seo: createSeo({
			title: `สมาชิก ${assembly.name}`
		}),
		isCabinet
	};
}

function getPoliticianSummary({ id, name, image, memberships }: AssemblyMember) {
	const partyMembership = memberships.find(
		(m) => m.posts[0].organizations[0].classification === 'POLITICAL_PARTY'
	);
	const assemblyMembership = memberships.find(
		(m) => m.posts[0].organizations[0].classification !== 'POLITICAL_PARTY'
	);
	const isActive = true;

	return {
		id,
		name,
		avatar: image ?? undefined,
		isActive: true,
		partyName: partyMembership?.posts[0].organizations[0].name,
		partyLogo: partyMembership?.posts[0].organizations[0].image ?? undefined,
		role: !isActive
			? 'พ้นสภาพก่อนสภาหมดอายุ'
			: assemblyMembership?.list_number
				? `บัญชีรายชื่อ ลำดับ ${assemblyMembership?.list_number}`
				: assemblyMembership?.province && assemblyMembership.district_number
					? `${assemblyMembership?.province} เขต ${assemblyMembership.district_number}`
					: assemblyMembership?.label,
		candidateType: assemblyMembership?.list_number
			? 'บัญชีรายชื่อ'
			: assemblyMembership?.province && assemblyMembership.district_number
				? 'แบ่งเขต'
				: undefined,
		assemblyRoleName: assemblyMembership?.posts[0].role
	};
}
