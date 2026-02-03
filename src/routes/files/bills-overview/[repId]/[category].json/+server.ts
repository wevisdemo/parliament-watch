import {
	getBillCategoryOptions,
	getRepresentativeTermOptions
} from '$lib/politigraph/bill/overview';
import { createBillFieldsForProposer, getBillProposer } from '$lib/politigraph/bill/proposer';
import { billStatusList } from '$lib/politigraph/bill/status';
import { graphql } from '$lib/politigraph/client';
import type { BillWhere } from '$lib/politigraph/genql';
import { ALL_CATEGORY_KEY, MP_OTHER_TERMS } from '../../../../../constants/bills';

const MAX_BILL_BY_STATUS = 3;
const MAX_ENACTED_BILL = 10;

export const prerender = true;

export async function entries() {
	const representatives = await getRepresentativeTermOptions();
	const categories = await getBillCategoryOptions();

	return representatives.flatMap(({ id }) =>
		categories.map((category) => ({ repId: id, category }))
	);
}

export async function GET({ params }) {
	return new Response(JSON.stringify(await getBillOverviewData(params)), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}

async function getBillOverviewData({ repId, category }: { repId: string; category: string }) {
	const queryCategory = category === ALL_CATEGORY_KEY ? undefined : category;

	const queryRepresentative =
		repId === MP_OTHER_TERMS.id
			? MP_OTHER_TERMS
			: (
					await graphql.query({
						organizations: {
							__args: {
								where: {
									id: { eq: repId }
								}
							},
							founding_date: true,
							dissolution_date: true
						}
					})
				).organizations[0];

	const billConditions: BillWhere = {
		...(queryCategory && {
			categories: { includes: category }
		}),
		...(queryRepresentative?.founding_date && {
			proposal_date: { gte: queryRepresentative.founding_date }
		}),
		...(queryRepresentative?.dissolution_date && {
			proposal_date: { lte: queryRepresentative.dissolution_date }
		})
	};

	const billSummaryByStatuses = await Promise.all(
		billStatusList.map((status) => {
			const where: BillWhere = {
				status: { eq: status },
				...billConditions
			};

			return graphql.query({
				billsConnection: {
					__args: { where },
					totalCount: true
				},
				bills: {
					__args: { where, sort: [{ proposal_date: 'DESC' }], limit: MAX_BILL_BY_STATUS },
					id: true,
					title: true,
					nickname: true
				}
			});
		})
	);

	const lastEnactedBills = (
		await graphql.query({
			billEnactEvents: {
				__args: {
					where: {
						NOT: { start_date: { eq: null } },
						bills: {
							some: billConditions
						}
					},
					sort: [{ start_date: 'DESC' }],
					limit: MAX_ENACTED_BILL
				},
				start_date: true,
				bills: {
					id: true,
					title: true,
					nickname: true,
					proposal_date: true
				}
			}
		})
	).billEnactEvents.map(({ start_date, bills }) => ({ enact_date: start_date, ...bills[0] }));

	const lastEnactedBillProposers = (
		await Promise.all(
			lastEnactedBills.map(({ id, proposal_date }) =>
				graphql.query({
					bills: {
						__args: {
							where: {
								id: { eq: id }
							},
							limit: 1
						},
						...createBillFieldsForProposer(proposal_date)
					}
				})
			)
		)
	).map(({ bills }) => getBillProposer(bills[0]));
	return {
		billSummaryByStatuses,
		lastEnactedBills,
		lastEnactedBillProposers
	};
}

export type BillOverviewData = Awaited<ReturnType<typeof getBillOverviewData>>;
