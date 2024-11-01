import { fetchAssemblies, fetchFromIdOr404 } from '$lib/datasheets/index.js';
import {
	AssemblyName,
	type Assembly,
	GroupByOption,
	groupByOptionLabelMap
} from '$models/assembly';

export type AssemblySummary = Pick<Assembly, 'id' | 'name' | 'term' | 'startedAt'>;

export interface GroupByTab {
	path: string;
	label: string;
	isActive: boolean;
}

export async function load({ params }) {
	const fullAssembly = await fetchFromIdOr404(fetchAssemblies, params.id);

	const { id, name, term, startedAt } = fullAssembly;
	const assembly: AssemblySummary = { id, name, term, startedAt };

	const groupByTabs = Object.values(GroupByOption)
		.filter(
			name === AssemblyName.Senates
				? (path) => [GroupByOption.Party, GroupByOption.Province].every((option) => option !== path)
				: name === AssemblyName.Cabinet
					? (path) =>
							[GroupByOption.AppointmentMethod, GroupByOption.Province].every(
								(option) => option !== path
							)
					: (path) => path !== GroupByOption.AppointmentMethod
		)
		.map<GroupByTab>((path) => ({
			path,
			label: groupByOptionLabelMap.get(path) as string,
			isActive: path === params.groupby
		}));

	return { assembly, groupByTabs };
}
