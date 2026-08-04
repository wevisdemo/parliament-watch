import { PAGE_CACHE_CONTROL } from '$lib/cache-control';
import { queryLastEnactedBillsWithProposers } from '$lib/politigraph/bill/enacted';
import { queryBillsForSummary, summarizeBillsByStatus } from '$lib/politigraph/bill/summary';
import type { BillWhere } from '$lib/politigraph/genql';
import { ALL_CATEGORY_KEY } from '../../../../../constants/bills';

const MAX_ENACTED_BILL = 10;

export async function GET({ params }) {
	return new Response(JSON.stringify(await getBillOverviewData(params)), {
		headers: {
			'Content-Type': 'application/json',
			'Cache-Control': PAGE_CACHE_CONTROL
		}
	});
}

async function getBillOverviewData({ repId, category }: { repId: string; category: string }) {
	const queryCategory = category === ALL_CATEGORY_KEY ? undefined : category;

	const billConditions: BillWhere = {
		...(queryCategory && {
			categories: { includes: category }
		}),
		organizations: { some: { id: { eq: repId } } }
	};

	const [bills, { lastEnactedBills, lastEnactedBillProposers }] = await Promise.all([
		queryBillsForSummary(billConditions),
		queryLastEnactedBillsWithProposers(billConditions, MAX_ENACTED_BILL)
	]);

	const billSummaryByStatuses = summarizeBillsByStatus(bills).map(({ samples, count }) => ({
		billsConnection: { totalCount: count },
		bills: samples.map(({ id, title, nickname }) => ({ id, title, nickname }))
	}));

	return {
		billSummaryByStatuses,
		lastEnactedBills,
		lastEnactedBillProposers
	};
}

export type BillOverviewData = Awaited<ReturnType<typeof getBillOverviewData>>;
