import { graphql } from '$lib/politigraph/client';
import type { BillWhere } from '../genql';
import {
	createBillFieldsForProposer,
	getBillProposer,
	keepProposerMembershipsOnDate
} from './proposer';

/**
 * Latest enacted bills matching `where`, paired with their proposer at proposal date.
 * Proposers of every bill are fetched in a single query, then narrowed per proposal date.
 */
export async function queryLastEnactedBillsWithProposers(where: BillWhere, limit: number) {
	const { billEnactEvents } = await graphql.query({
		billEnactEvents: {
			__args: {
				where: {
					NOT: { start_date: { eq: null } },
					bill: where
				},
				sort: [{ start_date: 'DESC' }],
				limit
			},
			start_date: true,
			bill: {
				id: true,
				title: true,
				nickname: true,
				proposal_date: true
			}
		}
	});

	const lastEnactedBills = billEnactEvents.flatMap(({ start_date, bill }) =>
		bill ? [{ enact_date: start_date, ...bill }] : []
	);

	if (lastEnactedBills.length === 0) {
		return { lastEnactedBills, lastEnactedBillProposers: [] };
	}

	const { bills: billsWithCreators } = await graphql.query({
		bills: {
			__args: {
				where: { id: { in: lastEnactedBills.map(({ id }) => id) } }
			},
			id: true,
			...createBillFieldsForProposer()
		}
	});

	const lastEnactedBillProposers = lastEnactedBills.map(({ id, proposal_date }) => {
		const bill = billsWithCreators.find((candidate) => candidate.id === id);

		return bill ? getBillProposer(keepProposerMembershipsOnDate(bill, proposal_date)) : undefined;
	});

	return { lastEnactedBills, lastEnactedBillProposers };
}
