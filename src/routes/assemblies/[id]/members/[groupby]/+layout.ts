import { AssemblyName, type Assembly } from '$models/assembly';
import { error } from '@sveltejs/kit';
import { fetchAssemblies } from '../../../../../libs/datasheets/index.js';
import { GroupByOption, groupByOptionLabelMap } from './groupby-options.js';

export type AssemblySummary = Pick<Assembly, 'id' | 'name' | 'term' | 'startedAt'>;

export interface GroupByTab {
	path: string;
	label: string;
	isActive: boolean;
}

export async function load({ params }) {
	const fullAssembly = (await fetchAssemblies()).find(({ id }) => id === params.id);

	if (!fullAssembly) {
		throw error(404, `Assembly ${params.id} not found`);
	}

	const { id, name, term, startedAt } = fullAssembly;
	const assembly: AssemblySummary = { id, name, term, startedAt };

	const groupByTabs = Object.values(GroupByOption)
		.filter(
			name === AssemblyName.Senates
				? (path) => [GroupByOption.Party, GroupByOption.Province].every((option) => option !== path)
				: (path) => path !== GroupByOption.Origin
		)
		.map<GroupByTab>((path) => ({
			path,
			label: groupByOptionLabelMap.get(path) as string,
			isActive: path === params.groupby
		}));

	return { assembly, groupByTabs };
}
