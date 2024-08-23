import type { AssemblyMember } from '$lib/datasheets/assembly-member';
import { provinceRegionMap } from '$lib/thai-province';
import { type Assembly, GroupByOption, AssemblyPartyGroup } from '$models/assembly';
import dayjs from 'dayjs';

const UNKNOWN_LABEL = 'ไม่พบข้อมูล';

const noParty = {
	name: 'ไม่สังกัดพรรค',
	logo: ''
};

export interface PoliticianGroup {
	name: string;
	icon?: string;
	members: AssemblyMember[];
}

export interface PoliticianSubGroup {
	name: string;
	subgroups: PoliticianGroup[];
}

export type PoliticianGroupBy = PoliticianGroup[] | PoliticianSubGroup[];

export function getMemberGroup(
	assembly: Assembly,
	members: AssemblyMember[],
	groupby: GroupByOption,
	isSenates = false,
	isCabinet = false
): PoliticianGroupBy {
	switch (groupby) {
		case GroupByOption.Party: {
			return isCabinet
				? createSubgroupByPartyOrAppointmentMethod(members, isSenates)
				: groupMembersBy(members, ({ partyRole }) =>
						assembly.oppositionParties?.some((op) => op.name === partyRole?.party.name)
							? AssemblyPartyGroup.Opposition
							: AssemblyPartyGroup.Government
					).map(([side, membersBySide]) => ({
						name: side,
						subgroups: createSubgroupByPartyOrAppointmentMethod(membersBySide, isSenates)
					}));
		}

		case GroupByOption.Province: {
			return groupMembersBy(
				members,
				({ assemblyRole }) =>
					assemblyRole?.province && provinceRegionMap.get(assemblyRole?.province)
			).map(([region, membersByRegion]) => ({
				name: region || UNKNOWN_LABEL,
				subgroups: groupMembersBy(
					membersByRegion,
					({ assemblyRole }) => assemblyRole?.province
				).map(([province, membersByProvince]) => ({
					name: province || UNKNOWN_LABEL,
					members: membersByProvince
				}))
			}));
		}

		case GroupByOption.AppointmentMethod: {
			return createSubgroupByPartyOrAppointmentMethod(members, isSenates);
		}

		case GroupByOption.Sex: {
			const membersGroupBySex = groupMembersBy(members, ({ sex }) => sex);
			return isCabinet
				? membersGroupBySex.map(([side, membersBySide]) => ({
						name: side,
						members: createSubgroupByPartyOrAppointmentMethod(membersBySide, isSenates).flatMap(
							(subGroup) => subGroup.members
						)
					}))
				: membersGroupBySex.map(([side, membersBySide]) => ({
						name: side,
						subgroups: createSubgroupByPartyOrAppointmentMethod(membersBySide, isSenates)
					}));
		}

		case GroupByOption.Age: {
			const membersGroupByAge = groupMembersBy(members, ({ birthdate }) => {
				if (!birthdate) return UNKNOWN_LABEL;

				const birthDate = dayjs(birthdate);
				const age = dayjs().diff(birthDate, 'year');

				if (age > 71) return '71 ปีขึ้นไป';
				if (age > 55) return '56-70 ปี';
				if (age > 40) return '41-55 ปี';
				return '25-40 ปี';
			});
			return isCabinet
				? membersGroupByAge.map(([side, membersBySide]) => ({
						name: side,
						members: createSubgroupByPartyOrAppointmentMethod(membersBySide, isSenates).flatMap(
							(subGroup) => subGroup.members
						)
					}))
				: membersGroupByAge.map(([side, membersBySide]) => ({
						name: side,
						subgroups: createSubgroupByPartyOrAppointmentMethod(membersBySide, isSenates)
					}));
		}

		case GroupByOption.Education: {
			const membersGroupByEdu = groupMembersBy(members, ({ educations }) => {
				if (!educations.length) return UNKNOWN_LABEL;
				if (educations.some((e) => e.includes('ปริญญาเอก'))) return 'ปริญญาเอก';
				if (educations.some((e) => e.includes('ปริญญาโท'))) return 'ปริญญาโท';
				if (educations.some((e) => e.includes('ปริญญาตรี'))) return 'ปริญญาตรี';
				if (educations.some((e) => e.includes('ทหาร'))) return 'สถาบันทหาร';
				return 'ต่ำกว่าปริญญาตรี';
			});
			return isCabinet
				? membersGroupByEdu.map(([side, membersBySide]) => ({
						name: side,
						members: createSubgroupByPartyOrAppointmentMethod(membersBySide, isSenates).flatMap(
							(subGroup) => subGroup.members
						)
					}))
				: membersGroupByEdu.map(([side, membersBySide]) => ({
						name: side,
						subgroups: createSubgroupByPartyOrAppointmentMethod(membersBySide, isSenates)
					}));
		}

		// TODO: Asset is not in phase 1
		// case GroupByOption.Assets: {
		// 	return {
		// 		groups: mockPoliticianGroupsWithSubgroups(
		// 			[
		// 				'ต่ำกว่า 1 ล้านบาท',
		// 				'1-10 ล้านบาท',
		// 				'10-100 ล้านบาท',
		// 				'100-1000 ล้านบาท',
		// 				'1000 ล้านบาทขึ้นไป',
		// 				'ไม่พบข้อมูล'
		// 			],
		// 			isSenates
		// 		)
		// 	};
		// }
	}
}

export function groupMembersBy<T>(
	members: AssemblyMember[],
	groupBy: (member: AssemblyMember) => T | undefined
): [T, AssemblyMember[]][] {
	const groupMap = members.reduce((map, member) => {
		const group = groupBy(member);
		if (group) {
			map.set(group, [...(map.get(group) || []), member]);
		}

		return map;
	}, new Map<T, AssemblyMember[]>());

	return [...groupMap.entries()].sort((a, z) => z[1].length - a[1].length);
}

export function createSubgroupByPartyOrAppointmentMethod(
	members: AssemblyMember[],
	isSenates: boolean
) {
	return isSenates
		? groupMembersBy(members, ({ assemblyRole }) => assemblyRole?.appointmentMethod).map(
				([method, membersByRole]) => ({
					name: method || UNKNOWN_LABEL,
					members: membersByRole
				})
			)
		: groupMembersBy(members, ({ partyRole }) => partyRole?.party || noParty).map(
				([party, membersByParty]) => ({
					name: party.name,
					icon: party.logo,
					members: membersByParty
				})
			);
}
