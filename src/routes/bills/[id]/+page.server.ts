import { createBillFieldsForProposer, getBillProposer } from '$lib/politigraph/bill/proposer.js';
import type { Event, VoteEventType } from '$lib/politigraph/genql/schema.js';
import { graphql } from '$lib/politigraph/server';
import { createSeo } from '$lib/seo';
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

export async function entries() {
	return (await graphql.query({ bills: { id: true } })).bills;
}

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
		bills: [{ creators, co_proposers, people_signature_count, bill_events }]
	} = await graphql.query({
		bills: {
			__args: {
				where: {
					id: { eq: params.id }
				},
				limit: 1
			},
			...createBillFieldsForProposer(bill.proposal_date),
			co_proposers: {
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
						},
						limit: 1
					},
					posts: {
						organizations: {
							id: true,
							name: true,
							image: true,
							founding_date: true
						}
					}
				}
			},
			bill_events: {
				__typename: true,
				on_Event: {
					id: true,
					start_date: true,
					description: true
				},
				on_BillVoteEvent: {
					classification: true
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
					main_bill_id: true,
					bills: {
						id: true,
						title: true,
						nickname: true,
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

	const proposer = getBillProposer({ creators, people_signature_count });

	const events = bill_events
		.map((event) => ({
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
						: event.__typename === 'BillVoteEvent' &&
							event.classification &&
							voteEventDefaultTitleDescription.get(event.classification)?.description) || '',
			date: event.start_date,
			links: event.links
		}))
		.sort((a, z) =>
			a.date && z.date
				? z.date.localeCompare(a.date) || z.title.localeCompare(a.title)
				: eventDefaultSortPriority.indexOf(z.type) - eventDefaultSortPriority.indexOf(a.type)
		);

	const mergeEvent = bill_events.find((e) => e.__typename === 'BillMergeEvent');
	const mergeEventBills = mergeEvent?.bills.map((b) => ({
		id: b.id,
		name: b.nickname ?? b.title,
		proposedBy: b.creators[0]?.name
	}));

	return {
		bill,
		proposer,
		coProposers: co_proposers.map(({ memberships, ...politician }) => ({
			...politician,
			party: memberships[0]?.posts[0]?.organizations[0]
		})),
		mergeDetail:
			mergeEvent && mergeEventBills
				? {
						mainBill: mergeEventBills.find((b) => b.id === mergeEvent.main_bill_id),
						otherBills: mergeEventBills.filter(
							(b) => b.id !== bill.id && b.id !== mergeEvent.main_bill_id
						)
					}
				: null,
		events,
		seo: createSeo({
			title: bill.nickname ?? bill.title
		})
	};
}
