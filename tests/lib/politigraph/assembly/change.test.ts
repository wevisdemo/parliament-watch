import { getRoleChanges } from '$lib/politigraph/assembly/change';
import { createMember } from './member-fixture';
import { describe, expect, it } from 'vitest';

describe('getRoleChanges', () => {
	it('should use the logo of the newest party membership when memberships overlap', () => {
		const member = createMember({
			memberships: [
				{ organizationId: 'assembly-1', start_date: '2023-07-01' },
				{
					organizationId: 'party-old',
					classification: 'POLITICAL_PARTY',
					organizationImage: 'old.webp',
					start_date: '2023-01-01'
				},
				{
					organizationId: 'party-new',
					classification: 'POLITICAL_PARTY',
					organizationImage: 'new.webp',
					start_date: '2023-05-01'
				}
			]
		});

		const changes = getRoleChanges('assembly-1', [member]);

		expect(changes).length(1);
		expect(changes[0].politician.partyLogo).toEqual('new.webp');
	});

	it('should fall back to no party logo when no party membership covers the date', () => {
		const member = createMember({
			memberships: [
				{ organizationId: 'assembly-1', start_date: '2023-07-01' },
				{
					organizationId: 'party-old',
					classification: 'POLITICAL_PARTY',
					organizationImage: 'old.webp',
					start_date: '2023-01-01',
					end_date: '2023-02-01'
				}
			]
		});

		expect(getRoleChanges('assembly-1', [member])[0].politician.partyLogo).toEqual('');
	});
});
