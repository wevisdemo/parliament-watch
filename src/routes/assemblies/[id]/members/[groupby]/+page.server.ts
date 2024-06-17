import type { AvailableAssembly } from '$components/Assemblies/AssemblyIdRunner.svelte';
import { fetchAssemblies, fetchFromIdOr404, fetchPoliticians } from '$lib/datasheets';
import {
	getAssemblyMembers,
	getPoliticianSummary,
	type PoliticianSummary
} from '$lib/datasheets/assembly-member';
import { createSeo } from '$lib/seo';
import { AssemblyName, GroupByOption } from '$models/assembly';
import { getMemberGroup, type PoliticianSubGroup, type PoliticianGroup } from './groupby';
import { error } from '@sveltejs/kit';

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
	const members = getAssemblyMembers(assembly, await fetchPoliticians());
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

		const availableAssemblies: AvailableAssembly[] = (await fetchAssemblies()).map(
			({ id, name, term }) => ({
				id,
				name,
				term
			})
		);

		return {
			groups: transformedGroup,
			isDataHasSubgroup,
			availableAssemblies,
			seo: createSeo({
				title: `สมาชิก ${assembly.name} ${assembly.term}`
			})
		};
	} else {
		error(404);
	}
}
