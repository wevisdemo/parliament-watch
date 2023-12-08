import { error } from '@sveltejs/kit';
import {
	GroupByOption,
	getMemberGroup,
	getPoliticianSummary,
	type PoliticianSummary,
	type PoliticianSubGroup,
	type PoliticianGroup
} from './groupby.js';
import { fetchAssemblies, fetchFromIdOr404 } from '$lib/datasheets/index.js';
import { AssemblyName } from '$models/assembly.js';
import { fetchAssemblyMembers } from '../../data.js';

interface PoliticianSummaryGroup {
	name: string;
	icon?: string;
	members: PoliticianSummary[];
}

interface PoliticianSummarySubGroup {
	name: string;
	subgroups: PoliticianSummaryGroup[];
}

export type PoliticianSummaryGroupBy = PoliticianSummaryGroup[] | PoliticianSummarySubGroup[];

const checkIsDataHasSubGroup = (
	groups: PoliticianSummaryGroupBy
): groups is PoliticianSummarySubGroup[] => 'subgroups' in groups[0];

export async function load({ params }) {
	const assembly = await fetchFromIdOr404(fetchAssemblies, params.id);
	const members = await fetchAssemblyMembers(assembly);
	const isSenates = assembly.name === AssemblyName.Senates;

	if (Object.values(GroupByOption).includes(params.groupby as GroupByOption)) {
		const groups = getMemberGroup(assembly, members, params.groupby as GroupByOption, isSenates);

		const isDataHasSubgroup = checkIsDataHasSubGroup(groups);

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

		return { groups: transformedGroup, isDataHasSubgroup };
	} else {
		throw error(404);
	}
}
