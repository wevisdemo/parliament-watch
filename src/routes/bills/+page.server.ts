import type {
	BillsByCategory,
	BillsByProposerType,
	BillsByStatus
} from '$components/LawStatusCard/LawStatusCard.svelte';
import { fetchBills } from '$lib/datasheets';
import { createSeo } from '$lib/seo';
import { BillProposerType, BillStatus, type Bill } from '$models/bill';
import { rollup } from 'd3';

const BILL_SAMPLE_LIMIT = 3;
const LATEST_ENACTED_BILL_LIMIT = 10;

export async function load() {
	const bills = (await fetchBills()).sort(
		(a, z) => z.proposedOn.getTime() - a.proposedOn.getTime()
	);

	const totalCount = bills.length;

	const byStatus: BillsByStatus[] = Object.values(BillStatus)
		.map((status) => {
			const relatedBills = bills.filter((bill) => bill.status === status);
			return {
				status,
				samples: relatedBills.slice(0, BILL_SAMPLE_LIMIT),
				count: relatedBills.length
			};
		})
		.filter(({ count }) => count > 0);

	const byCategory: BillsByCategory[] = [
		...rollup(
			bills.flatMap(({ categories, ...rest }) =>
				categories.map((category) => ({ category, ...rest }))
			),
			(group) => ({
				category: group[0].category,
				samples: group.slice(0, BILL_SAMPLE_LIMIT),
				count: group.length
			}),
			(bill) => bill.category
		).values()
	].sort((a, z) => z.count - a.count);

	const byProposerType: BillsByProposerType[] = Object.values(BillProposerType)
		.map((proposerType) => {
			const relatedBills = bills.filter((bill) => bill.proposerType === proposerType);
			const statusGroup = rollup(
				relatedBills,
				(group) => group.length,
				(bill) => bill.status
			);

			return {
				proposerType,
				samples: relatedBills.slice(0, BILL_SAMPLE_LIMIT),
				count: relatedBills.length,
				countByStatus: Object.fromEntries(statusGroup) as BillsByProposerType['countByStatus']
			};
		})
		.filter(({ count }) => count > 0);

	// TODO: use bill events
	const latestEnactedBills: Bill[] = bills
		.filter(({ status }) => status === BillStatus.Enacted)
		.slice(0, LATEST_ENACTED_BILL_LIMIT);

	return {
		totalCount,
		byStatus,
		byCategory,
		byProposerType,
		latestEnactedBills,
		seo: createSeo({
			title: 'สำรวจร่างกฎหมายในสภา'
		})
	};
}
