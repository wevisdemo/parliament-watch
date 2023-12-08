import { error } from '@sveltejs/kit';
import { GroupByOption, getMemberGroup, getPoliticianSummary } from './groupby.js';
import { fetchAssemblies, fetchFromIdOr404 } from '$lib/datasheets/index.js';
import { AssemblyName } from '$models/assembly.js';
import { fetchAssemblyMembers } from '../../data.js';

export async function load({ params }) {
	const assembly = await fetchFromIdOr404(fetchAssemblies, params.id);
	const members = await fetchAssemblyMembers(assembly);
	const isSenates = assembly.name === AssemblyName.Senates;

	if (Object.values(GroupByOption).includes(params.groupby as GroupByOption)) {
		const groups = getMemberGroup(
			assembly,
			members,
			params.groupby as GroupByOption,
			isSenates
		).map(({ name, ...group }) =>
			'subgroups' in group
				? {
						name,
						subgroups: group.subgroups.map((subGroup) => ({
							...subGroup,
							members: subGroup.members.map(getPoliticianSummary)
						}))
				  }
				: {
						name,
						members: group.members.map(getPoliticianSummary)
				  }
		);

		return { groups };
	} else {
		throw error(404);
	}
}
