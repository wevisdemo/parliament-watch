import type {
	BillsByCategory,
	BillsByProposerType,
	BillsByStatus,
	BillsByParty
} from '$components/LawStatusCard/LawStatusCard.svelte';
import { queryLastEnactedBillsWithProposers } from '$lib/politigraph/bill/enacted';
import { getInvolvedPartyIdSet } from '$lib/politigraph/bill/party';
import {
	BILL_SAMPLE_LIMIT,
	setBillNicknameFromTitleAsFallback,
	summarizeBillsByProposerType,
	summarizeBillsByStatus
} from '$lib/politigraph/bill/summary';
import { graphql } from '$lib/politigraph/client';
import type { BillWhere } from '$lib/politigraph/genql';
import { createSeo } from '$lib/seo';
import { error } from '@sveltejs/kit';

const LATEST_ENACTED_BILL_LIMIT = 10;

export async function load({ params }) {
	const allMpTerms = (
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
	).organizations;

	const thisTerm = allMpTerms.find((mp) => mp.id === params.id);

	if (!thisTerm) {
		throw error(404, 'Term not found');
	}

	const billWhereTerm: BillWhere = {
		organizations: {
			some: {
				id: { eq: thisTerm.id }
			}
		}
	};

	const [billsInTerm, { lastEnactedBills, lastEnactedBillProposers }] = await Promise.all([
		queryBillsInTerm(billWhereTerm),
		queryLastEnactedBillsWithProposers(billWhereTerm, LATEST_ENACTED_BILL_LIMIT)
	]);

	const totalCount = billsInTerm.length;

	const byStatus: BillsByStatus[] = summarizeBillsByStatus(billsInTerm)
		.filter((group) => group.count)
		.map(({ status, samples, count }) => ({
			status,
			samples: samples.map(setBillNicknameFromTitleAsFallback),
			count
		}));

	// TODO: until we have a protocol to maintain bill category data
	const byCategory: BillsByCategory[] = [];

	const byProposerType: BillsByProposerType[] = summarizeBillsByProposerType(billsInTerm).map(
		({ samples, ...group }) => ({
			...group,
			samples: samples.map(setBillNicknameFromTitleAsFallback)
		})
	);

	const billsWithParty = billsInTerm.flatMap(({ creators, co_creators, ...bill }) =>
		[...getInvolvedPartyIdSet({ creators, co_creators, ...bill })].map((party) => {
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
		.toSorted((a, z) => z.count - a.count);

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

async function queryBillsInTerm(where: BillWhere) {
	const { bills } = await graphql.query({
		bills: {
			__args: { where, sort: [{ proposal_date: 'DESC' }] },
			id: true,
			title: true,
			nickname: true,
			status: true,
			proposal_date: true,
			creator_type: true,
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
			co_creators: {
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
	});

	return bills;
}
