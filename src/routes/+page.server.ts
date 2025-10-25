import {
	ALL_CATEGORY_KEY,
	MAX_BILL_BY_STATUS,
	type BillByCategoryAndStatus,
	type BillCategoryWithStatus
} from '$components/Index/BillContent.svelte';
import StatCard, { HighlightedReason } from '$components/Index/StatCard.svelte';
import type VoteCard from '$components/VoteCard/VoteCard.svelte';
import { fetchBills, fetchPromises } from '$lib/datasheets';
import { graphql } from '$lib/politigraph';
import { groupVotesByAffiliation, countVotesInEachOption } from '$lib/politigraph/vote/group';
import { queryPoliticiansVote } from '$lib/politigraph/vote/with-politician';
import { buildVotesSummary, optionsArrayToResultSummary } from '$lib/vote-summary';
import { BillStatus } from '$models/bill';
import { PromiseStatus } from '$models/promise';
import type { PromisesByStatus } from './promises/+page.server';
import { groups, rollup } from 'd3-array';
import type { ComponentProps } from 'svelte';

const MAX_LATEST_VOTE = 5;
const MAX_ENACTED_BILL = 10;
const MAX_PROMISES_SAMPLE = 3;

const CHUAN_ID = '891ea463-c463-4f76-840d-e7d24a97d70c';
const BANYAT_ID = 'e26bbc32-f2d5-41f1-8006-2ea439576771';

enum PoliticialPosition {
	MP = 'สส.',
	Senate = 'สว.',
	Cabinet = 'รัฐมนตรี'
}

interface LongestServedInPoliticalPositionsPolitician extends ComponentProps<StatCard> {
	position: PoliticialPosition;
	year: number;
}

interface MostFrequentlyServedAsMinisterPolitician extends ComponentProps<StatCard> {
	cabinetTerms: number[];
}

export async function load() {
	const bills = await fetchBills();
	const promises = await fetchPromises();

	const highlightPoliticians = (
		await graphql.query({
			people: {
				__args: {
					where: {
						id_IN: [CHUAN_ID, BANYAT_ID]
					}
				},
				id: true,
				name: true,
				image: true,
				memberships: {
					__args: {
						where: {
							end_date_EQ: null,
							posts_ALL: {
								organizations_ALL: {
									classification_IN: [
										'CABINET',
										'HOUSE_OF_REPRESENTATIVE',
										'HOUSE_OF_SENATE',
										'POLITICAL_PARTY'
									]
								}
							}
						}
					},
					posts: {
						label: true,
						role: true,
						organizations: {
							classification: true,
							name: true,
							image: true
						}
					}
				}
			}
		})
	).people.map(({ image, memberships, ...rest }) => {
		const assembly = memberships.find(
			(m) => m.posts[0].organizations[0].classification !== 'POLITICAL_PARTY'
		);
		const party = memberships.find(
			(m) => m.posts[0].organizations[0].classification === 'POLITICAL_PARTY'
		);

		return {
			...rest,
			avatar: image ?? '',
			label: assembly?.posts[0].label ?? '',
			partyImage: party?.posts[0].organizations[0].name ?? '',
			partyLogo: party?.posts[0].organizations[0].image ?? '',
			partyName: party?.posts[0].organizations[0].name ?? ''
		};
	});

	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const chuanLeekpai = highlightPoliticians.find((p) => p.id === CHUAN_ID)!;
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const banyatBantadtan = highlightPoliticians.find((p) => p.id === BANYAT_ID)!;

	const highlightedPoliticians: ComponentProps<StatCard>[] = [
		{
			reason: HighlightedReason.LongestServedInPoliticalPositions,
			value: 54,
			...chuanLeekpai,
			position: PoliticialPosition.MP,
			year: 2512
		} as LongestServedInPoliticalPositionsPolitician,
		{
			reason: HighlightedReason.MostFrequentlyElectedInConstituency,
			value: 12,
			...banyatBantadtan
		},
		{
			reason: HighlightedReason.MostFrequentlyServedAsMinister,
			value: 5,
			...chuanLeekpai,
			cabinetTerms: [38, 42, 43, 45, 53]
		} as MostFrequentlyServedAsMinisterPolitician,
		{
			reason: HighlightedReason.MostDiverseServedAsMinister,
			value: 6,
			...chuanLeekpai
		}
	];

	const { voteEvents } = await graphql.query({
		voteEvents: {
			__args: {
				sort: [{ start_date: 'DESC' }],
				limit: MAX_LATEST_VOTE
			},
			id: true,
			title: true,
			nickname: true,
			start_date: true,
			result: true,
			end_date: true,
			organizations: {
				id: true
			}
		}
	});

	const latestVoteEvents: ComponentProps<VoteCard>[] = await Promise.all(
		voteEvents.map(async (voteEvent) => {
			const groupedVotes = groupVotesByAffiliation(await queryPoliticiansVote(voteEvent));
			const groups = groupedVotes.map((aff) => ({
				name: aff.name,
				resultSummary: optionsArrayToResultSummary(countVotesInEachOption(aff.votes))
			}));

			return {
				...voteEvent,
				date: voteEvent.start_date,
				votesSummary: buildVotesSummary({ groups, result: voteEvent.result })
			};
		})
	);

	const billByCategoryAndStatus: BillByCategoryAndStatus = rollup(
		bills.flatMap(({ categories, ...rest }) =>
			categories.map((category) => ({ category, categories, ...rest }))
		),
		(billsByCategory): BillCategoryWithStatus => ({
			count: billsByCategory.length,
			billsByStatus: rollup(
				billsByCategory,
				(billsByStatus) => ({
					samples: billsByStatus.slice(
						0,
						billsByStatus[0].status === BillStatus.Enacted ? MAX_ENACTED_BILL : MAX_BILL_BY_STATUS
					),
					count: billsByStatus.length
				}),
				(bill) => bill.status
			)
		}),
		(bill) => bill.category
	);

	billByCategoryAndStatus.set(ALL_CATEGORY_KEY, {
		count: bills.length,
		billsByStatus: rollup(
			bills,
			(billsByStatus) => ({
				samples: billsByStatus.slice(
					0,
					billsByStatus[0].status === BillStatus.Enacted ? MAX_ENACTED_BILL : MAX_BILL_BY_STATUS
				),
				count: billsByStatus.length
			}),
			(bill) => bill.status
		)
	});

	const promiseSummary = {
		total: promises.length,
		byStatus: groups(
			promises.filter((p) =>
				[PromiseStatus.inProgress, PromiseStatus.fulfilled, PromiseStatus.unhonored].includes(
					p.status
				)
			),
			(p) => p.status
		).map<PromisesByStatus>(([status, promisesByStatus]) => ({
			status,
			samples: promisesByStatus
				.slice(0, MAX_PROMISES_SAMPLE)
				.map(({ id, statements }) => ({ id, statements })),
			count: promisesByStatus.length
		}))
	};

	return {
		highlightedPoliticians,
		latestVoteEvents,
		billByCategoryAndStatus,
		promiseSummary
	};
}
