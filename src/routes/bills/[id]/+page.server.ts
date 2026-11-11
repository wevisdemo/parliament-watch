import type { VoteCardProps } from '$components/VoteCard/VoteCard.svelte';
import { createBillFieldsForProposer, getBillProposer } from '$lib/politigraph/bill/proposer.js';
import { graphql } from '$lib/politigraph/client';
import type { Event, VoteEventType } from '$lib/politigraph/genql/schema.js';
import { toVoteCardProps } from '$lib/politigraph/vote/card.js';
import { describeBill } from '$lib/seo/description';
import { createSeo } from '$lib/seo/meta';
import { error } from '@sveltejs/kit';

const eventDefaultSortPriority: Event['__typename'][] = [
	'BillMergeEvent',
	'BillVoteEvent',
	'BillRoyalAssentEvent',
	'BillRejectEvent',
	'BillEnactEvent'
];

const voteEventDefaultTitleDescription = new Map<
	VoteEventType,
	{ title: string; description: string }
>([
	[
		'MP_1',
		{
			title: 'สส.พิจารณา วาระ 1',
			description: 'รับหลักการและตั้งกรรมาธิการ'
		}
	],
	[
		'MP_2',
		{
			title: 'สส.พิจารณา วาระ 2',
			description: 'ขั้นกรรมาธิการ และ สส.ลงมติรับรายมาตรา'
		}
	],
	[
		'MP_3',
		{
			title: 'สส.พิจารณา วาระ 3',
			description: 'ขั้นลงมติเห็นชอบ'
		}
	],
	[
		'SENATE_1',
		{
			title: 'สว.พิจารณา วาระ 1',
			description: 'รับร่าง พ.ร.บ. ไว้พิจารณา'
		}
	],
	[
		'SENATE_2',
		{
			title: 'สว.พิจารณา วาระ 2',
			description: 'อยู่ระหว่างการพิจารณา'
		}
	],
	[
		'SENATE_3',
		{
			title: 'สว.พิจารณา วาระ 3',
			description: 'พิจารณาให้ความเห็นชอบ'
		}
	]
]);

export async function load({ params }) {
	const {
		bills: [bill]
	} = await graphql.query({
		bills: {
			__args: {
				where: {
					id: { eq: params.id }
				},
				limit: 1
			},
			id: true,
			title: true,
			nickname: true,
			status: true,
			proposal_date: true,
			text: true,
			categories: true,
			links: {
				url: true,
				note: true
			}
		}
	});

	if (!bill) {
		error(404);
	}

	const {
		bills: [{ creator_type, creators, co_creators, people_signature_count, events }]
	} = await graphql.query({
		bills: {
			__args: {
				where: {
					id: { eq: params.id }
				},
				limit: 1
			},
			...createBillFieldsForProposer(bill.proposal_date),
			co_creators: {
				__args: {
					sort: [{ firstname: 'ASC', lastname: 'ASC' }]
				},
				id: true,
				name: true,
				memberships: {
					__args: {
						where: {
							start_date: { lte: bill.proposal_date },
							OR: [{ end_date: { eq: null } }, { end_date: { gte: bill.proposal_date } }],
							post: {
								organization: {
									classification: {
										eq: 'POLITICAL_PARTY'
									}
								}
							}
						},
						limit: 1
					},
					post: {
						organization: {
							id: true,
							name: true,
							image: true,
							founding_date: true
						}
					}
				}
			},
			events: {
				__typename: true,
				on_Event: {
					id: true,
					start_date: true,
					description: true
				},
				on_BillVoteEvent: {
					id: true,
					classification: true,
					vote_event: {
						id: true,
						title: true,
						nickname: true,
						start_date: true,
						end_date: true,
						result: true,
						organizations: {
							id: true
						}
					}
				},
				on_BillRejectEvent: {
					reject_reason: true
				},
				on_BillRoyalAssentEvent: {
					result: true
				},
				on_BillEnactEvent: {
					links: {
						note: true,
						url: true
					}
				},
				on_BillMergeEvent: {
					start_date: true,
					main_bill: {
						id: true,
						title: true,
						nickname: true,
						proposal_date: true,
						status: true,
						creators: {
							on_Person: {
								name: true
							},
							on_Organization: {
								name: true
							}
						}
					},
					bills: {
						id: true,
						title: true,
						nickname: true,
						proposal_date: true,
						status: true,
						creators: {
							on_Person: {
								name: true
							},
							on_Organization: {
								name: true
							}
						}
					}
				}
			}
		}
	});

	const proposer = getBillProposer({ creator_type, creators, people_signature_count });

	const mergeEvent = events.find((e) => e.__typename === 'BillMergeEvent');
	const toMergeBill = (b: NonNullable<typeof mergeEvent>['bills'][number]) => ({
		id: b.id,
		name: b.nickname ?? b.title,
		proposedBy: b.creators[0]?.name
	});
	const mergeEventBills = mergeEvent?.bills.map(toMergeBill);

	const parsedEvents = events
		.map((event) => {
			const base = {
				id: event.__typename === 'BillVoteEvent' ? event.id : undefined,
				type: event.__typename,
				title:
					event.__typename === 'BillMergeEvent'
						? 'ร่างกฏหมายถูกรวมร่าง'
						: event.__typename === 'BillRoyalAssentEvent'
							? 'นำขึ้นทูลเกล้าทูลกระหม่อมถวาย'
							: event.__typename === 'BillRejectEvent'
								? 'ตกไป'
								: event.__typename === 'BillEnactEvent'
									? 'ออกเป็นกฎหมาย'
									: event.title ||
										(event.__typename === 'BillVoteEvent' &&
											event.classification &&
											voteEventDefaultTitleDescription.get(event.classification)?.title) ||
										'อื่นๆ',
				description:
					(event.__typename === 'BillRoyalAssentEvent'
						? event.result
						: event.__typename === 'BillRejectEvent'
							? event.reject_reason
							: event.__typename === 'BillMergeEvent'
								? event.main_bill?.id === bill.id
									? 'ร่างนี้ถูกใช้เป็นร่างหลักในชั้นการพิจารณา'
									: 'ร่างนี้ถูกนำไปรวมกับร่างอื่นในชั้นการพิจารณา'
								: event.__typename === 'BillVoteEvent' &&
									event.classification &&
									voteEventDefaultTitleDescription.get(event.classification)?.description) || '',
				date: event.start_date,
				links: event.links
			};

			if (event.__typename === 'BillMergeEvent' && mergeEventBills) {
				const mainBillData = event.main_bill;

				if (mainBillData?.id === bill.id) {
					return {
						...base,
						mergeDetail: {
							mainBill: toMergeBill(mainBillData),
							otherBills: mergeEventBills.filter((b) => b.id !== bill.id)
						}
					};
				} else if (mainBillData) {
					return {
						...base,
						mergeDetail: {
							mainBill: {
								id: mainBillData.id,
								name: mainBillData.nickname || mainBillData.title,
								nickname: mainBillData.nickname || mainBillData.title,
								title: mainBillData.nickname ? mainBillData.title : null,
								proposedOn: mainBillData.proposal_date
									? new Date(mainBillData.proposal_date)
									: null,
								status: mainBillData.status,
								proposedBy: mainBillData.creators[0]?.name
							},
							otherBills: mergeEventBills.filter(
								(b) => b.id !== bill.id && b.id !== mainBillData.id
							)
						}
					};
				}
			}

			return base;
		})
		.sort((a, z) =>
			a.date && z.date
				? z.date.localeCompare(a.date) || z.title.localeCompare(a.title)
				: eventDefaultSortPriority.indexOf(z.type) - eventDefaultSortPriority.indexOf(a.type)
		);

	let mergedBillProposer: ReturnType<typeof getBillProposer> = undefined;
	const mainBill = mergeEvent?.main_bill;
	if (mainBill?.proposal_date && mainBill.id !== bill.id) {
		const mergedBillData = await graphql.query({
			bills: {
				__args: {
					where: { id: { eq: mainBill.id } },
					limit: 1
				},
				...createBillFieldsForProposer(mainBill.proposal_date)
			}
		});
		const mergedBill = mergedBillData.bills[0];
		if (mergedBill) {
			mergedBillProposer = getBillProposer({
				creator_type: mergedBill.creator_type,
				creators: mergedBill.creators,
				people_signature_count: mergedBill.people_signature_count
			});
		}
	}

	const billVoteEvents = events.flatMap((e) =>
		e.__typename === 'BillVoteEvent' && e.vote_event ? [{ id: e.id, voteEvent: e.vote_event }] : []
	);

	const votingByEventId = new Map<string, VoteCardProps>();
	await Promise.all(
		billVoteEvents.map(async ({ id: billVoteEventId, voteEvent }) => {
			const { id, date, result, votesSummary } = await toVoteCardProps(voteEvent);
			votingByEventId.set(billVoteEventId, {
				id,
				title: voteEvent.nickname ?? voteEvent.title,
				date,
				result,
				votesSummary
			});
		})
	);

	return {
		bill,
		proposer,
		coProposers: co_creators.map(({ memberships, ...politician }) => ({
			...politician,
			party: memberships[0]?.post?.organization ?? undefined
		})),
		mergeDetail:
			mergeEvent && mergeEventBills
				? {
						mainBill: mainBill ? toMergeBill(mainBill) : undefined,
						otherBills: mergeEventBills.filter((b) => b.id !== bill.id && b.id !== mainBill?.id)
					}
				: null,
		events: parsedEvents.map((event) => {
			if ('mergeDetail' in event && event.mergeDetail && mergedBillProposer) {
				return {
					...event,
					mergeDetail: {
						...event.mergeDetail,
						mainBill: event.mergeDetail.mainBill
							? { ...event.mergeDetail.mainBill, proposer: mergedBillProposer }
							: event.mergeDetail.mainBill
					}
				};
			}
			if (event.type === 'BillVoteEvent' && event.id) {
				const voting = votingByEventId.get(event.id);
				if (voting) {
					return { ...event, voting };
				}
			}
			return event;
		}),
		seo: createSeo({
			title: bill.nickname ?? bill.title,
			description: describeBill(bill, proposer)
		})
	};
}
