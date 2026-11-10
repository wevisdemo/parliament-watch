import { groupVotesByAffiliation } from '$lib/politigraph/vote/group';
import { describe, expect, it } from 'vitest';

const vote = (role: string, party?: { side?: string; name?: string }) => ({
	option: 'เห็นด้วย',
	role,
	party
});

describe('groupVotesByAffiliation', () => {
	it('groups a party voter by the side of their party', () => {
		const [group] = groupVotesByAffiliation([
			vote('สส. บัญชีรายชื่อ', { side: 'พรรครัฐบาล', name: 'ก' })
		]);

		expect(group.name).toBe('สส.รัฐบาล');
	});

	it('puts a party voter without side or assembly role into the unknown สส. group', () => {
		const [group] = groupVotesByAffiliation([
			vote('ไม่พบข้อมูล', { name: 'ภูมิใจไทย' }),
			vote('สส. แบ่งเขต', { name: 'ภูมิใจไทย' })
		]);

		expect(group).toMatchObject({ name: 'สส.ไม่ทราบฝ่าย' });
		expect(group.votes).toHaveLength(2);
	});

	it('groups senators and voters without any info separately', () => {
		const names = groupVotesByAffiliation([vote('สว. กลุ่ม 1'), vote('ไม่พบข้อมูล')]).map(
			({ name }) => name
		);

		expect(names).toEqual(['สว.', 'ไม่พบข้อมูล']);
	});
});
