import type { AssemblyMember } from '$lib/politigraph/assembly/member';
import type { MemberGroup } from '../../routes/assemblies/[id]/+page.server';

export interface SubgroupSelected {
	name: string;
	count: number;
	color: string;
}

export const getSumOfGroupsTotal = (groups: MemberGroup[]) =>
	groups.reduce((acc, group) => acc + group.total, 0);

export const getSumOfPartiesCount = (parties: MemberGroup['subgroups'] = []) =>
	parties.reduce((acc, party) => acc + party.count, 0);

export const getRoundedPercent = (value: number, total: number) =>
	Math.round((value / total) * 100);

export const getMaxtPercent = (groups: MemberGroup[]) =>
	Math.max(...groups.map((group) => getRoundedPercent(group.total, getSumOfGroupsTotal(groups))));

export const getTopOfGroups = (groups: MemberGroup[]): MemberGroup =>
	groups.reduce((acc, group) => {
		if (group.total > acc.total) {
			return group;
		}
		return acc;
	}, groups[0]);

export const getTopOfGroupsPercent = (groups: MemberGroup[]): number =>
	getRoundedPercent(getTopOfGroups(groups)?.total || 0, getSumOfGroupsTotal(groups));

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

export type TooltipProp = {
	title: string;
	additional: string;
	x: number;
	y: number;
};
