import { enumGender } from '$lib/politigraph/genql';
import { provinceRegionMap } from '$lib/thai-province';
import { GroupByOption, AssemblyPartyGroup } from '$models/assembly';
import type { AssemblyMember } from './member';
import dayjs from 'dayjs';

const UNKNOWN_LABEL = 'ไม่พบข้อมูล';
const SEX_GROUP_ORDER = ['ชาย', 'หญิง', UNKNOWN_LABEL];
const AGE_GROUP_ORDER = ['25-40 ปี', '41-55 ปี', '56-70 ปี', '71 ปีขึ้นไป', UNKNOWN_LABEL];
const EDUCATION_GROUP_ORDER = [
	'ต่ำกว่าปริญญาตรี',
	'ปริญญาตรี',
	'ปริญญาโท',
	'ปริญญาเอก',
	'สถาบันทหาร',
	UNKNOWN_LABEL
];

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

function sortGroupsByLabelOrder<M, T extends string>(
	groups: [T, M[]][],
	order: readonly T[] | readonly string[]
): [T, M[]][] {
	const orderMap = new Map(order.map((label, index) => [label, index]));

	return [...groups].sort(([leftLabel], [rightLabel]) => {
		const leftIndex = orderMap.get(leftLabel) ?? Number.MAX_SAFE_INTEGER;
		const rightIndex = orderMap.get(rightLabel) ?? Number.MAX_SAFE_INTEGER;
		return leftIndex - rightIndex;
	});
}

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
			const membersGroupBySex = sortGroupsByLabelOrder(
				groupMembersBy(
					members,
					({ gender }) => (gender && sexTranslationMap.get(gender)) || UNKNOWN_LABEL
				),
				SEX_GROUP_ORDER
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
			const membersGroupByAge = sortGroupsByLabelOrder(
				groupMembersBy(members, ({ birth_date }) => {
					if (!birth_date) return UNKNOWN_LABEL;

					const birthDate = dayjs(birth_date);
					const age = dayjs().diff(birthDate, 'year');

					if (age > 71) return '71 ปีขึ้นไป';
					if (age > 55) return '56-70 ปี';
					if (age > 40) return '41-55 ปี';
					return '25-40 ปี';
				}),
				AGE_GROUP_ORDER
			);
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
			const membersGroupByEdu = sortGroupsByLabelOrder(
				groupMembersBy(members, ({ educations }) => {
					if (!educations) return UNKNOWN_LABEL;
					if (educations.includes('ปริญญาเอก')) return 'ปริญญาเอก';
					if (educations.includes('ปริญญาโท')) return 'ปริญญาโท';
					if (educations.includes('ปริญญาตรี')) return 'ปริญญาตรี';
					if (educations.includes('ทหาร')) return 'สถาบันทหาร';
					return 'ต่ำกว่าปริญญาตรี';
				}),
				EDUCATION_GROUP_ORDER
			);

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
