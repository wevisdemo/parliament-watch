import { graphql } from '$lib/politigraph/client';
import type { Bill, BillStatus, BillWhere } from '../genql';
import { enumBillCreatorType } from '../genql';
import { billStatusList } from './status';

export const BILL_SAMPLE_LIMIT = 3;

export type BillForSummary = Pick<
	Bill,
	'id' | 'title' | 'nickname' | 'status' | 'proposal_date' | 'creator_type'
>;

/**
 * Fetches every bill matching `where` once, so summaries can be aggregated in memory.
 * Assumes the query is unpaginated — counts derive from the returned rows.
 */
export async function queryBillsForSummary(where: BillWhere): Promise<BillForSummary[]> {
	const { bills } = await graphql.query({
		bills: {
			__args: { where, sort: [{ proposal_date: 'DESC' }] },
			id: true,
			title: true,
			nickname: true,
			status: true,
			proposal_date: true,
			creator_type: true
		}
	});

	return bills;
}

export function summarizeBillsByStatus(bills: BillForSummary[]) {
	return billStatusList.map((status) => {
		const billsInStatus = bills.filter((bill) => bill.status === status);

		return {
			status,
			samples: billsInStatus.slice(0, BILL_SAMPLE_LIMIT),
			count: billsInStatus.length
		};
	});
}

export function summarizeBillsByProposerType(bills: BillForSummary[]) {
	return Object.values(enumBillCreatorType).map((proposerType) => {
		const byStatus = summarizeBillsByStatus(
			bills.filter((bill) => bill.creator_type === proposerType)
		);

		return {
			proposerType,
			samples: byStatus.flatMap(({ samples }) => samples).slice(0, BILL_SAMPLE_LIMIT),
			count: byStatus.reduce((sum, { count }) => sum + count, 0),
			countByStatus: Object.fromEntries(
				byStatus.map(({ status, count }) => [status, count])
			) as Record<BillStatus, number>
		};
	});
}

export function setBillNicknameFromTitleAsFallback({
	id,
	title,
	nickname
}: Pick<Bill, 'id' | 'title' | 'nickname'>) {
	return { id, nickname: nickname || title };
}
