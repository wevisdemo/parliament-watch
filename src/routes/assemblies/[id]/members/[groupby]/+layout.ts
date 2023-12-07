import type { Assembly } from '$models/assembly';
import { rep26, sen12 } from '../../../../../mocks/data/assembly.js';
import { GroupByOption, groupByOptionLabelMap } from './groupby-options.js';

export type AssemblySummary = Pick<Assembly, 'id' | 'name' | 'term' | 'startedAt'>;

export interface GroupByTab {
	path: string;
	label: string;
	isActive: boolean;
}

export async function load({ params }) {
	const isSenate = params.id === sen12.id;

	const { id, name, term, startedAt } = isSenate ? sen12 : rep26;
	const assembly: AssemblySummary = { id, name, term, startedAt };

	const groupByTabs = Object.values(GroupByOption)
		.filter(
			isSenate
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
