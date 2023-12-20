import { error } from '@sveltejs/kit';
import { getMemberGroup, type PoliticianSubGroup, type PoliticianGroup } from './groupby';
import { fetchAssemblies, fetchFromIdOr404 } from '$lib/datasheets';
import { AssemblyName, GroupByOption } from '$models/assembly';
import { fetchAssemblyMembers, getPoliticianSummary, type PoliticianSummary } from '../../data';

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

		const assemblyIds: string[] = (await fetchAssemblies()).map(({ id }) => id);

		return { groups: transformedGroup, isDataHasSubgroup, assemblyIds };
	} else {
		throw error(404);
	}
}
