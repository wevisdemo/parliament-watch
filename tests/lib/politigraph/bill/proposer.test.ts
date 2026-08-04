import { keepProposerMembershipsOnDate } from '$lib/politigraph/bill/proposer';
import { describe, expect, it } from 'vitest';

const membership = (start_date: string | null, end_date: string | null) => ({
	start_date,
	end_date
});

const billWith = (memberships: ReturnType<typeof membership>[]) => ({
	creator_type: 'POLITICIAN' as const,
	creators: [{ memberships }]
});

const keptMemberships = (
	memberships: ReturnType<typeof membership>[],
	proposalDate: string | null
) => keepProposerMembershipsOnDate(billWith(memberships), proposalDate).creators[0].memberships;

describe('keepProposerMembershipsOnDate', () => {
	it('keeps an ongoing membership that started before the proposal date', () => {
		expect(keptMemberships([membership('2023-01-01', null)], '2023-06-01')).toHaveLength(1);
	});

	it('includes memberships starting or ending exactly on the proposal date', () => {
		expect(keptMemberships([membership('2023-06-01', '2023-12-31')], '2023-06-01')).toHaveLength(1);
		expect(keptMemberships([membership('2023-01-01', '2023-06-01')], '2023-06-01')).toHaveLength(1);
	});

	it('drops memberships outside the proposal date', () => {
		expect(keptMemberships([membership('2023-07-01', null)], '2023-06-01')).toHaveLength(0);
		expect(keptMemberships([membership('2020-01-01', '2022-12-31')], '2023-06-01')).toHaveLength(0);
	});

	it('drops every membership when the proposal date or the start date is missing', () => {
		expect(keptMemberships([membership('2023-01-01', null)], null)).toHaveLength(0);
		expect(keptMemberships([membership(null, null)], '2023-06-01')).toHaveLength(0);
	});

	it('leaves creators without memberships untouched', () => {
		const bill = {
			creator_type: 'ASSEMBLY' as const,
			creators: [{ name: 'คณะรัฐมนตรี', memberships: undefined }]
		};

		expect(keepProposerMembershipsOnDate(bill, '2023-06-01')).toEqual(bill);
	});
});
