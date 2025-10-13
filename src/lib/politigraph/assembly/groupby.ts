import { enumGender } from '$lib/politigraph/genql';
import { provinceRegionMap } from '$lib/thai-province';
import { GroupByOption, AssemblyPartyGroup } from '$models/assembly';
import type { AssemblyMember } from './member';
import dayjs from 'dayjs';

const UNKNOWN_LABEL = 'ไม่พบข้อมูล';

const sexTranslationMap = new Map([
	[enumGender.MALE, 'ชาย'],
	[enumGender.FEMALE, 'หญิง']
]);

export const noParty = {
	name: '',
	image: '',
	color: 'gray'
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
	members: AssemblyMember[],
	groupby: GroupByOption,
	isSenates = false,
	isCabinet = false
): PoliticianGroupBy {
	switch (groupby) {
		case GroupByOption.Party: {
			return isCabinet
				? createSubgroupByPartyOrAppointmentMethod(members, isSenates)
				: groupMembersBy(members, ({ memberships }) =>
						memberships
							.find((m) => m.posts[0].organizations[0].classification === 'POLITICAL_PARTY')
							?.posts[0].organizations[0].memberships[0]?.posts[0].role.endsWith(
								AssemblyPartyGroup.Opposition
							)
							? AssemblyPartyGroup.Opposition
							: AssemblyPartyGroup.Government
					).map(([side, membersBySide]) => ({
						name: side,
						subgroups: createSubgroupByPartyOrAppointmentMethod(membersBySide, isSenates)
					}));
		}

		case GroupByOption.Province: {
			return groupMembersBy(members, ({ memberships }) => {
				const province = memberships.find(
					(m) => m.posts[0].organizations[0].classification !== 'POLITICAL_PARTY'
				)?.province;
				return province && provinceRegionMap.get(province);
			}).map(([region, membersByRegion]) => ({
				name: region || UNKNOWN_LABEL,
				subgroups: groupMembersBy(
					membersByRegion,
					({ memberships }) =>
						memberships.find(
							(m) => m.posts[0].organizations[0].classification !== 'POLITICAL_PARTY'
						)?.province
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
			const membersGroupBySex = groupMembersBy(
				members,
				({ gender }) => (gender && sexTranslationMap.get(gender)) || UNKNOWN_LABEL
			);
			return isCabinet
				? membersGroupBySex.map(([sex, membersBySex]) => ({
						name: sex,
						members: createSubgroupByPartyOrAppointmentMethod(membersBySex, isSenates).flatMap(
							(subGroup) => subGroup.members
						)
					}))
				: membersGroupBySex.map(([sex, membersBySex]) => ({
						name: sex,
						subgroups: createSubgroupByPartyOrAppointmentMethod(membersBySex, isSenates)
					}));
		}

		case GroupByOption.Age: {
			const membersGroupByAge = groupMembersBy(members, ({ birth_date }) => {
				if (!birth_date) return UNKNOWN_LABEL;

				const birthDate = dayjs(birth_date);
				const age = dayjs().diff(birthDate, 'year');

				if (age > 71) return '71 ปีขึ้นไป';
				if (age > 55) return '56-70 ปี';
				if (age > 40) return '41-55 ปี';
				return '25-40 ปี';
			});
			return isCabinet
				? membersGroupByAge.map(([age, membersByAge]) => ({
						name: age,
						members: createSubgroupByPartyOrAppointmentMethod(membersByAge, isSenates).flatMap(
							(subGroup) => subGroup.members
						)
					}))
				: membersGroupByAge.map(([age, membersByAge]) => ({
						name: age,
						subgroups: createSubgroupByPartyOrAppointmentMethod(membersByAge, isSenates)
					}));
		}

		case GroupByOption.Education: {
			const membersGroupByEdu = groupMembersBy(members, ({ educations }) => {
				if (!educations) return UNKNOWN_LABEL;
				if (educations.includes('ปริญญาเอก')) return 'ปริญญาเอก';
				if (educations.includes('ปริญญาโท')) return 'ปริญญาโท';
				if (educations.includes('ปริญญาตรี')) return 'ปริญญาตรี';
				if (educations.includes('ทหาร')) return 'สถาบันทหาร';
				return 'ต่ำกว่าปริญญาตรี';
			});

			return isCabinet
				? membersGroupByEdu.map(([education, membersByEducation]) => ({
						name: education,
						members: createSubgroupByPartyOrAppointmentMethod(
							membersByEducation,
							isSenates
						).flatMap((subGroup) => subGroup.members)
					}))
				: membersGroupByEdu.map(([education, membersByEducation]) => ({
						name: education,
						subgroups: createSubgroupByPartyOrAppointmentMethod(membersByEducation, isSenates)
					}));
		}
	}
}

export function groupMembersBy<M, T>(members: M[], groupBy: (member: M) => T): [T, M[]][] {
	const groupMap = members.reduce((map, member) => {
		const group = groupBy(member);

		if (group) {
			map.set(group, [...(map.get(group) || []), member]);
		}

		return map;
	}, new Map<T, M[]>());

	return [...groupMap.entries()].sort((a, z) => z[1].length - a[1].length);
}

export function createSubgroupByPartyOrAppointmentMethod(
	members: AssemblyMember[],
	isSenates: boolean
) {
	return isSenates
		? groupMembersBy(
				members,
				({ memberships }) =>
					memberships.find((m) => m.posts[0].organizations[0].classification !== 'POLITICAL_PARTY')
						?.label ?? UNKNOWN_LABEL
			).map(([method, membersByRole]) => ({
				name: method,
				members: membersByRole
			}))
		: groupMembersBy(
				members,
				({ memberships }) =>
					memberships.find((m) => m.posts[0].organizations[0].classification === 'POLITICAL_PARTY')
						?.posts[0].organizations[0].name ?? UNKNOWN_LABEL
			).map(([partyName, membersByParty]) => {
				const { name, image } =
					membersByParty[0].memberships.find((m) => m.posts[0].organizations[0].name === partyName)
						?.posts[0].organizations[0] ?? noParty;

				return {
					name: name,
					image: image,
					members: membersByParty
				};
			});
}
