import { getMemberGroup, groupMembersBy } from '$lib/politigraph/assembly/groupby';
import { GroupByOption } from '$models/assembly';
import { createMember } from './member-fixture';
import dayjs from 'dayjs';
import { describe, expect, it } from 'vitest';

const UNKNOWN_LABEL = 'ไม่พบข้อมูล';

describe('groupMembersBy', () => {
	it('should keep members whose group key is falsy', () => {
		const groups = groupMembersBy([{ province: 'ระยอง' }, { province: undefined }], (m) =>
			m.province ? 'ภาคตะวันออก' : UNKNOWN_LABEL
		);

		expect(groups).toEqual([
			['ภาคตะวันออก', [{ province: 'ระยอง' }]],
			[UNKNOWN_LABEL, [{ province: undefined }]]
		]);
	});
});

describe('getMemberGroup by province', () => {
	it('should put members without province in the unknown bucket', () => {
		const groups = getMemberGroup(
			[
				createMember({ id: 'with-province', memberships: [{ province: 'ระยอง' }] }),
				createMember({ id: 'without-province' })
			],
			GroupByOption.Province
		);

		const unknownGroup = groups.find(({ name }) => name === UNKNOWN_LABEL);

		expect(unknownGroup).toBeDefined();
		expect(unknownGroup && 'subgroups' in unknownGroup && unknownGroup.subgroups[0].name).toEqual(
			UNKNOWN_LABEL
		);
	});
});

describe('getMemberGroup by age', () => {
	it.each([
		{ age: 71, expected: '71 ปีขึ้นไป' },
		{ age: 70, expected: '56-70 ปี' },
		{ age: 56, expected: '56-70 ปี' },
		{ age: 55, expected: '41-55 ปี' },
		{ age: 40, expected: '25-40 ปี' }
	])('should put a member aged $age in $expected', ({ age, expected }) => {
		const groups = getMemberGroup(
			[
				createMember({
					birth_date: dayjs().subtract(age, 'year').subtract(1, 'day').format('YYYY-MM-DD')
				})
			],
			GroupByOption.Age
		);

		expect(groups.map(({ name }) => name)).toEqual([expected]);
	});
});
