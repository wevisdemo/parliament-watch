import type { ComponentProps } from 'svelte';
import type PoliticianProfile from '$components/PoliticianProfile/PoliticianProfile.svelte';
import type { AssemblyMember } from '../../data';
import type { Assembly } from '$models/assembly';
import { provinceRegionMap } from '$lib/thai-province';

interface PoliticianGroup {
	name: string;
	icon?: string;
	members: AssemblyMember[];
}

export type PoliticianGroupBy =
	| PoliticianGroup[]
	| {
			name: string;
			subgroups: PoliticianGroup[];
	  }[];

interface PoliticianSummary extends Omit<ComponentProps<PoliticianProfile>, 'isLarge'> {
	candidateType?: 'แบ่งเขต' | 'บัญชีรายชื่อ';
}

export enum GroupByOption {
	Party = 'party',
	Province = 'province',
	AppointmentMethod = 'appointment-method',
	Sex = 'sex',
	Age = 'age',
	Education = 'education'
	// TODO: Asset is not in phase 1
	// Assets = 'assets'
}

export const groupByOptionLabelMap = new Map<GroupByOption, string>([
	[GroupByOption.Party, 'พรรค'],
	[GroupByOption.Province, 'จังหวัด'],
	[GroupByOption.AppointmentMethod, 'ที่มา'],
	[GroupByOption.Sex, 'เพศสภาพ'],
	[GroupByOption.Age, 'รุ่นอายุ'],
	[GroupByOption.Education, 'การศึกษา']
	// [GroupByOption.Assets, 'ทรัพย์สิน']
]);

export function getMemberGroup(
	assembly: Assembly,
	members: AssemblyMember[],
	groupby: GroupByOption,
	isSenates = false
): PoliticianGroupBy {
	switch (groupby) {
		case GroupByOption.Party: {
			return groupMembersBy(members, ({ partyRole }) =>
				assembly.oppositionParties?.some((op) => op.name === partyRole?.party.name)
					? 'ฝ่ายค้าน'
					: 'ฝ่ายรัฐบาล'
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
				name: region,
				subgroups: groupMembersBy(
					membersByRegion,
					({ assemblyRole }) => assemblyRole?.province
				).map(([province, membersByProvince]) => ({
					name: province,
					members: membersByProvince
				}))
			}));
		}

		case GroupByOption.AppointmentMethod: {
			return createSubgroupByPartyOrAppointmentMethod(members, isSenates);
		}

		case GroupByOption.Sex: {
			return groupMembersBy(members, ({ sex }) => sex).map(([side, membersBySide]) => ({
				name: side,
				subgroups: createSubgroupByPartyOrAppointmentMethod(membersBySide, isSenates)
			}));
		}

		case GroupByOption.Age: {
			return groupMembersBy(members, ({ birthdate }) => {
				if (!birthdate) return 'ไม่พบข้อมูล';

				const year = birthdate.getFullYear();
				// https://offer.kasasa.com/exchange/articles/generations/gen-x-gen-y-gen-z
				if (year < 1946) return 'อื่นๆ';
				if (year < 1965) return 'Baby Boomers';
				if (year < 1980) return 'Gen X';
				if (year < 1996) return 'Gen Y';
				if (year < 2012) return 'Gen Z';
				return 'Gen A';
			}).map(([side, membersBySide]) => ({
				name: side,
				subgroups: createSubgroupByPartyOrAppointmentMethod(membersBySide, isSenates)
			}));
		}

		case GroupByOption.Education: {
			return groupMembersBy(members, ({ educations }) => {
				if (!educations.length) return 'ไม่พบข้อมูล';
				if (educations.some((e) => e.includes('ปริญญาเอก'))) return 'ปริญญาเอก';
				if (educations.some((e) => e.includes('ปริญญาโท'))) return 'ปริญญาโท';
				if (educations.some((e) => e.includes('ปริญญาตรี'))) return 'ปริญญาตรี';
				if (educations.some((e) => e.includes('ทหาร'))) return 'สถาบันทหาร';
				return 'ตำกว่าปริญญาโท';
			}).map(([side, membersBySide]) => ({
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
): [T, politicians: AssemblyMember[]][] {
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
					name: method,
					members: membersByRole
				})
		  )
		: groupMembersBy(members, ({ partyRole }) => partyRole?.party).map(
				([party, membersByParty]) => ({
					name: party.name,
					icon: party.logo,
					members: membersByParty
				})
		  );
}

export function getPoliticianSummary(member: AssemblyMember): PoliticianSummary {
	const { id, firstname, lastname, avatar, isActive, partyRole, assemblyRole } = member;
	return {
		id,
		firstname,
		lastname,
		avatar,
		isActive,
		party: partyRole?.party,
		role: assemblyRole?.listNumber
			? `บัญชีรายชื่อลำดับ ${assemblyRole?.listNumber}`
			: assemblyRole?.province && assemblyRole.districtNumber
			? `${assemblyRole?.province} เขต ${assemblyRole.districtNumber}`
			: assemblyRole?.appointmentMethod
	};
}
