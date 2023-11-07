import type { Assembly } from '$models/assembly';
import { rep26, sen12 } from '../../../../../mocks/data/assembly.js';
import { GroupByOption, groupByOptionLabelMap } from './groupby-options.js';

type AssemblySummary = Pick<Assembly, 'id' | 'name' | 'term' | 'startedAt'>;

interface GroupByTab {
	path: string;
	label: string;
	isActive: boolean;
}

export async function load({ params }) {
	const { id, name, term, startedAt } = params.id === sen12.id ? sen12 : rep26;

	const assembly: AssemblySummary = { id, name, term, startedAt };
	const groupByTabs = Object.values(GroupByOption).map<GroupByTab>((path) => ({
		path,
		label: groupByOptionLabelMap.get(path) as string,
		isActive: path === params.groupby
	}));

	return { assembly, groupByTabs };
}
