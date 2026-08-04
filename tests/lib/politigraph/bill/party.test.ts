import { getInvolvedPartyIdSet } from '$lib/politigraph/bill/party';
import { describe, expect, it } from 'vitest';

const partyMembership = (
	organizationId: string,
	start_date: string,
	end_date: string | null = null
) => ({
	start_date,
	end_date,
	posts: [{ organizations: [{ id: organizationId }] }]
});

const billWith = (memberships: ReturnType<typeof partyMembership>[]) => ({
	proposal_date: '2023-06-01',
	creators: [{ memberships }],
	co_creators: []
});

describe('getInvolvedPartyIdSet', () => {
	it('should match a membership starting exactly on the proposal date', () => {
		const parties = getInvolvedPartyIdSet(billWith([partyMembership('party-a', '2023-06-01')]));

		expect([...parties]).toEqual(['party-a']);
	});

	it('should match a membership ending exactly on the proposal date', () => {
		const parties = getInvolvedPartyIdSet(
			billWith([partyMembership('party-a', '2023-01-01', '2023-06-01')])
		);

		expect([...parties]).toEqual(['party-a']);
	});

	it('should skip a membership that ended before the proposal date', () => {
		const parties = getInvolvedPartyIdSet(
			billWith([partyMembership('party-a', '2023-01-01', '2023-05-01')])
		);

		expect([...parties]).toEqual([]);
	});

	it('should not throw when a matching membership has no post', () => {
		const parties = getInvolvedPartyIdSet({
			proposal_date: '2023-06-01',
			creators: [{ memberships: [{ start_date: '2023-01-01', end_date: null, posts: [] }] }],
			co_creators: []
		});

		expect([...parties]).toEqual([]);
	});
});
