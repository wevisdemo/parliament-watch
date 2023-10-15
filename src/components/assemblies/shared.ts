import type { MemberGroup } from '../../routes/assemblies/[id]/+page';

export interface PartySelected {
	label: string;
	count: number;
	color: string;
}

export const getSumOfGroupsTotal = (groups: MemberGroup[]) => {
	return groups.reduce((acc, group) => acc + group.total, 0);
};

export const getSumOfPartiesCount = (parties: MemberGroup['parties'] = []) => {
	return parties.reduce((acc, party) => acc + party.count, 0);
};

export const getRoundedPercent = (value: number, total: number) => {
	return Math.round((value / total) * 100);
};

export const getMaxtPercent = (groups: MemberGroup[]) => {
	return Math.max(
		...groups.map((group) => getRoundedPercent(group.total, getSumOfGroupsTotal(groups)))
	);
};

export const getTopOfGroups = (groups: MemberGroup[]): MemberGroup => {
	return groups.reduce((acc, group) => {
		if (group.total > acc.total) {
			return group;
		}
		return acc;
	}, groups[0]);
};

export const getTopOfGroupsPercent = (groups: MemberGroup[]): number => {
	return getRoundedPercent(getTopOfGroups(groups).total, getSumOfGroupsTotal(groups));
};

export const getPercentWidth = (targetCount: number, groups: MemberGroup[]) => {
	const maxPercent = getMaxtPercent(groups);
	const targetPercent = getRoundedPercent(targetCount, getSumOfGroupsTotal(groups));
	return getRoundedPercent(targetPercent, maxPercent);
};
