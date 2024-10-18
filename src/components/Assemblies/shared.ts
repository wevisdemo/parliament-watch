import type { AssemblyMember } from '$lib/datasheets/assembly-member';
import type { MemberGroup } from '../../routes/assemblies/[id]/+page.server';

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
	return getRoundedPercent(getTopOfGroups(groups)?.total || 0, getSumOfGroupsTotal(groups));
};

export const getPercentWidth = (targetCount: number, groups: MemberGroup[]) => {
	const maxPercent = getMaxtPercent(groups);
	const targetPercent = getRoundedPercent(targetCount, getSumOfGroupsTotal(groups));
	return getRoundedPercent(targetPercent, maxPercent);
};

export interface PartySeat {
	name: string;
	color: string;
	count: number;
	members?: AssemblyMember[];
}

export interface CabinetSeat {
	role: 'นายกรัฐมนตรี' | 'รองนายกรัฐมนตรี' | 'รัฐมนตรี' | 'รัฐมนตรีช่วย';
	parties: PartySeat[];
}

export const getSenateColorByTitle = (title: string) => {
	switch (title) {
		case 'เลือกโดย คสช.':
			return '#044317';
		case 'เลือกกันเอง':
			return '#B28600';
		case 'โดยตำแหน่ง':
			return '#A8A8A8';
		default:
			return '#A8A8A8';
	}
};

export type TooltipProp = {
	title: string;
	additional: string;
	x: number;
	y: number;
};
