import type {
	BillsByCategory,
	BillsByProposerType,
	BillsByStatus,
	BillsByParty
} from '$components/LawStatusCard/LawStatusCard.svelte';
import { getInvolvedPartyIdSet } from '$lib/politigraph/bill/party';
import { createBillFieldsForProposer, getBillProposer } from '$lib/politigraph/bill/proposer';
import { billStatusList } from '$lib/politigraph/bill/status';
import type { BillWhere, Bill } from '$lib/politigraph/genql';
import { graphql } from '$lib/politigraph/server';
import { createSeo } from '$lib/seo';
import { BillProposerType } from '$models/bill';
import { MP_OTHER_TERMS } from '../../../../constants/bills';
import { error } from '@sveltejs/kit';

const BILL_SAMPLE_LIMIT = 3;
const LATEST_ENACTED_BILL_LIMIT = 10;

export async function load({ params }) {
	const allMpTerms = [
		{
			id: MP_OTHER_TERMS.id,
			term: null,
			founding_date: '',
			dissolution_date: MP_OTHER_TERMS.dissolution_date
		},
		...(
			await graphql.query({
				organizations: {
					__args: {
						where: { classification: { eq: 'HOUSE_OF_REPRESENTATIVE' } },
						sort: [{ founding_date: 'ASC' }]
					},
					id: true,
					term: true,
					founding_date: true,
					dissolution_date: true
				}
			})
		).organizations
	];

	const thisTerm = allMpTerms.find((mp) => mp.id === params.id);

	if (!thisTerm) {
		throw error(404, 'Term not found');
	}

	const billWhereTerm: BillWhere = {
		...(thisTerm.founding_date && { proposal_date: { gte: thisTerm.founding_date } }),
		...(thisTerm.dissolution_date && { proposal_date: { lte: thisTerm.dissolution_date } })
	};

	const totalCount = (
		await graphql.query({
			billsConnection: {
				__args: { where: billWhereTerm },
				totalCount: true
			}
		})
	).billsConnection.totalCount;

	const byStatus: BillsByStatus[] = (await queryBillSummaryByStatus(billWhereTerm)).filter(
		(group) => group.count
	);

	// TODO: until we have a protocol to maintain bill category data
	const byCategory: BillsByCategory[] = [];

	const byProposerType: BillsByProposerType[] = [
		{
			proposerType: BillProposerType.Politician,
			...(await queryBillSummaryByProposerType({
				...billWhereTerm,
				creators: {
					some: {
						Person: {
							memberships: {
								some: {
									posts: {
										some: {
											organizations: {
												some: {
													classification: { in: ['HOUSE_OF_REPRESENTATIVE', 'HOUSE_OF_SENATE'] }
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}))
		},
		{
			proposerType: BillProposerType.Assembly,
			...(await queryBillSummaryByProposerType({
				...billWhereTerm,
				creators: {
					some: {
						Organization: {
							classification: { eq: 'CABINET' }
						}
					}
				}
			}))
		},
		{
			proposerType: BillProposerType.Unknown,
			...(await queryBillSummaryByProposerType({
				...billWhereTerm,
				creators: {
					none: {
						Organization: { NOT: { id: { eq: null } } },
						Person: { NOT: { id: { eq: null } } }
					}
				}
			}))
		}
	];

	const billsInTerm = (
		await graphql.query({
			bills: {
				__args: { where: billWhereTerm },
				id: true,
				title: true,
				nickname: true,
				status: true,
				proposal_date: true,
				creators: {
					on_Person: {
						name: true,
						memberships: {
							__args: {
								where: {
									posts: {
										some: {
											organizations: {
												some: {
													classification: { eq: 'POLITICAL_PARTY' }
												}
											}
										}
									}
								}
							},
							start_date: true,
							end_date: true,
							posts: {
								organizations: {
									id: true
								}
							}
						}
					}
				},
				co_proposers: {
					name: true,
					memberships: {
						__args: {
							where: {
								posts: {
									some: {
										organizations: {
											some: {
												classification: {
													eq: 'POLITICAL_PARTY'
												}
											}
										}
									}
								}
							}
						},
						start_date: true,
						end_date: true,
						posts: {
							organizations: {
								id: true
							}
						}
					}
				}
			}
		})
	).bills;

	const billsWithParty = billsInTerm.flatMap(({ creators, co_proposers, ...bill }) =>
		[...getInvolvedPartyIdSet({ creators, co_proposers, ...bill })].map((party) => {
			return { ...bill, party };
		})
	);

	const billsGroupedByParty = Object.groupBy(billsWithParty, (bill) => bill.party);

	const partiesLogo = new Map(
		(
			await graphql.query({
				organizations: {
					__args: {
						where: {
							id: { in: Object.entries(billsGroupedByParty).map(([party]) => party) }
						},
						sort: [{ founding_date: 'DESC' }]
					},
					id: true,
					image: true
				}
			})
		).organizations.map(({ id, image }) => {
			return [id, image];
		})
	);

	const byParty: BillsByParty[] = Object.entries(billsGroupedByParty)
		.map(([party, billsInParty]) => {
			const samples = (billsInParty || [])
				.map(setBillNicknameFromTitleAsFallback)
				.flatMap(({ id, nickname }) => {
					return { id, nickname: nickname ?? '' };
				})
				.slice(0, BILL_SAMPLE_LIMIT);

			const groupedByStatus = Object.groupBy(billsInParty || [], (bill) => bill.status);
			const countByStatus = Object.fromEntries(
				Object.entries(groupedByStatus).map(([type, itemsInGroup]) => [type, itemsInGroup.length])
			) as BillsByProposerType['countByStatus'];

			const summary = {
				samples,
				count: billsInParty?.length ?? 0,
				countByStatus
			};
			return {
				party,
				imageSrc: partiesLogo.get(party) ?? '/images/parties/_placeholder.webp',
				...summary
			};
		})
		.sort((a, z) => z.count - a.count);

	const lastEnactedBills = (
		await graphql.query({
			billEnactEvents: {
				__args: {
					where: {
						NOT: { start_date: { eq: null } },
						bills: {
							some: billWhereTerm
						}
					},
					sort: [{ start_date: 'DESC' }],
					limit: LATEST_ENACTED_BILL_LIMIT
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
		allMpTerms,
		thisTerm,
		totalCount,
		byStatus,
		byCategory,
		byProposerType,
		byParty,
		lastEnactedBills,
		lastEnactedBillProposers,
		seo: createSeo({
			title: 'สำรวจร่างกฎหมายในสภา'
		})
	};
}

function queryBillSummaryByStatus(andWhere: BillWhere = {}) {
	return Promise.all(
		billStatusList.map(async (status) => {
			const where = {
				...andWhere,
				status: {
					eq: status
				}
			};
			const { bills, billsConnection } = await graphql.query({
				billsConnection: {
					__args: { where },
					totalCount: true
				},
				bills: {
					__args: { where, sort: [{ proposal_date: 'DESC' }], limit: BILL_SAMPLE_LIMIT },
					id: true,
					title: true,
					nickname: true
				}
			});

			return {
				status,
				samples: bills.map(setBillNicknameFromTitleAsFallback),
				count: billsConnection.totalCount
			};
		})
	);
}

async function queryBillSummaryByProposerType(where?: BillWhere) {
	const byStatus = await queryBillSummaryByStatus(where);

	return {
		samples: byStatus.flatMap(({ samples }) => samples).slice(0, BILL_SAMPLE_LIMIT),
		count: byStatus.reduce((sum, { count }) => sum + count, 0),
		countByStatus: Object.fromEntries(
			byStatus.map(({ status, count }) => [status, count])
		) as BillsByProposerType['countByStatus']
	};
}

function setBillNicknameFromTitleAsFallback({
	id,
	title,
	nickname
}: Pick<Bill, 'id' | 'title' | 'nickname'>) {
	return { id, nickname: nickname || title };
}
