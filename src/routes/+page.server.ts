import StatCard, { HighlightedReason } from '$components/Index/StatCard.svelte';
import type VoteCard from '$components/VoteCard/VoteCard.svelte';
import { graphql } from '$lib/politigraph';
import { groupVotesByAffiliation, countVotesInEachOption } from '$lib/politigraph/vote/group';
import { queryPoliticiansVote } from '$lib/politigraph/vote/with-politician';
// import { PromiseStatus } from '$models/promise';
// import type { PromisesByStatus } from './promises/+page.server';
import type { ComponentProps } from 'svelte';

const MAX_LATEST_VOTE = 5;
// const MAX_PROMISES_SAMPLE = 3;

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
		voteEvents.map(async (voteEvent) => ({
			...voteEvent,
			date: voteEvent.start_date,
			votesByGroup: groupVotesByAffiliation(await queryPoliticiansVote(voteEvent)).map((aff) => ({
				name: aff.name,
				options: countVotesInEachOption(aff.votes)
			}))
		}))
	);

	const billCategories = [
		...new Set(
			(
				await graphql.query({
					bills: {
						categories: true
					}
				})
			).bills.flatMap((bill) => bill.categories ?? [])
		)
	].sort((a, z) => a.localeCompare(z));

	// const promiseSummary = {
	// 	total: promises.length,
	// 	byStatus: groups(
	// 		promises.filter((p) =>
	// 			[PromiseStatus.inProgress, PromiseStatus.fulfilled, PromiseStatus.unhonored].includes(
	// 				p.status
	// 			)
	// 		),
	// 		(p) => p.status
	// 	).map<PromisesByStatus>(([status, promisesByStatus]) => ({
	// 		status,
	// 		samples: promisesByStatus
	// 			.slice(0, MAX_PROMISES_SAMPLE)
	// 			.map(({ id, statements }) => ({ id, statements })),
	// 		count: promisesByStatus.length
	// 	}))
	// };

	return {
		highlightedPoliticians,
		latestVoteEvents,
		billCategories
	};
}
