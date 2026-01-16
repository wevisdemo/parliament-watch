import type { Bill, Membership } from '../genql';
import dayjs, { type Dayjs } from 'dayjs';

interface BillInput extends Pick<Bill, 'proposal_date'> {
	creators: BillProposerInput[];
	co_proposers: BillProposerInput[];
}

interface BillProposerInput {
	memberships: MembershipInput[];
}

interface MembershipInput extends Pick<Membership, 'start_date' | 'end_date'> {
	posts: {
		organizations: {
			id: string;
		}[];
	}[];
}

export function getInvolvedPartyIdSet(bill: BillInput, proposedDate = dayjs(bill.proposal_date)) {
	const involvedParties = new Set(
		bill.co_proposers
			.map((co_proposer) => getOrgIdFromMembershipOnDate(co_proposer.memberships, proposedDate))
			.filter((id) => id !== undefined)
	);

	if (bill.creators[0] && 'memberships' in bill.creators[0]) {
		const creatorParty = getOrgIdFromMembershipOnDate(bill.creators[0].memberships, proposedDate);

		if (creatorParty) {
			involvedParties.add(creatorParty);
		}
	}

	return involvedParties;
}

function getOrgIdFromMembershipOnDate(memberships: MembershipInput[], date: Dayjs) {
	return memberships.find(
		({ start_date, end_date }) => date.isAfter(start_date) && (!end_date || date.isBefore(end_date))
	)?.posts[0].organizations[0].id;
}
