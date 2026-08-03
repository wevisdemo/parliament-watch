import { matchMember } from '$lib/politigraph/assembly/filter';
import { describe, expect, it } from 'vitest';

const allTypes = { isByDistrict: true, isByPartylist: true };

describe('matchMember', () => {
	it('matches a member without candidate type on name alone, whatever the checkboxes are', () => {
		const senator = { name: 'สมชาย ใจดี' };

		expect(matchMember(senator, { searchQuery: 'สมชาย', ...allTypes })).toBe(true);
		expect(
			matchMember(senator, { searchQuery: 'สมชาย', isByDistrict: false, isByPartylist: false })
		).toBe(true);
	});

	it('filters out an MP whose candidate type checkbox is off', () => {
		const district = { name: 'สมชาย ใจดี', candidateType: 'แบ่งเขต' } as const;
		const partylist = { name: 'สมหญิง ใจงาม', candidateType: 'บัญชีรายชื่อ' } as const;

		expect(
			matchMember(district, { searchQuery: '', isByDistrict: false, isByPartylist: true })
		).toBe(false);
		expect(
			matchMember(partylist, { searchQuery: '', isByDistrict: true, isByPartylist: false })
		).toBe(false);
	});

	it('keeps an MP whose candidate type checkbox is on', () => {
		expect(
			matchMember(
				{ name: 'สมชาย ใจดี', candidateType: 'แบ่งเขต' },
				{ searchQuery: 'สมชาย', ...allTypes }
			)
		).toBe(true);
	});

	it('fails on name mismatch regardless of candidate type', () => {
		expect(matchMember({ name: 'สมชาย ใจดี' }, { searchQuery: 'สมหญิง', ...allTypes })).toBe(false);
		expect(
			matchMember(
				{ name: 'สมชาย ใจดี', candidateType: 'บัญชีรายชื่อ' },
				{ searchQuery: 'สมหญิง', ...allTypes }
			)
		).toBe(false);
	});
});
