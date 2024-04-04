import {
	ALL_CATEGORY_KEY,
	type BillByCategoryAndStatus,
	type BillCategoryWithStatus
} from '$components/Index/BillContent.svelte';
import type { HighlightedPolitician } from '$components/Index/StatCard.svelte';
import { HighlightedReason } from '$components/Index/StatCard.svelte';
import type VoteCard from '$components/VoteCard/VoteCard.svelte';
import { fetchBills, fetchPoliticians, fetchVotes, fetchVotings } from '$lib/datasheets';
import { safeFind } from '$lib/datasheets/processor.js';
import { getHighlightedVoteByGroups } from '$lib/datasheets/voting.js';
import { DefaultVoteOption } from '$models/voting.js';
import { rollup } from 'd3-array';
import dayjs from 'dayjs';
import type { ComponentProps } from 'svelte';

const MAX_LASTEST_VOTE = 5;
const MAX_BILL_BY_STATUS = 3;

enum PoliticialPosition {
	MP = 'สส.',
	Senate = 'สว.',
	Cabinet = 'รัฐมนตรี'
}

interface LongestServedInPoliticalPositionsPolitician extends HighlightedPolitician {
	position: PoliticialPosition;
	year: number;
}

interface MostFrequentlyServedAsMinisterPolitician extends HighlightedPolitician {
	cabinetTerms: number[];
}

export async function load() {
	const politicians = await fetchPoliticians();
	const votes = await fetchVotes();
	const votings = await fetchVotings();
	const bills = await fetchBills();

	const activePoliticians = politicians.filter(({ isActive }) => isActive);

	const votesInActiveAssemblies = votes.filter(({ votingId }) =>
		votings
			.find(({ id }) => id === votingId)
			?.participatedAssemblies.some(({ endedAt }) => endedAt === undefined)
	);

	const highlightedPoliticians: HighlightedPolitician[] = [
		// TODO: Not release assets and debts yet
		// {
		// 	reason: HighlightedReason.HighestAssetOwned,
		// 	value: 95787230000,
		// 	politician: movingForwardPolitician
		// },
		// {
		// 	reason: HighlightedReason.HighestDebtOwned,
		// 	value: 1862770000,
		// 	politician: movingForwardPolitician
		// },
		{
			reason: HighlightedReason.HighestPartySwitching,
			...activePoliticians
				.map((politician) => ({
					politician,
					value: new Set(politician.partyRoles.map(({ party }) => party.name)).size
				}))
				.sort((a, z) => z.value - a.value)[0]
		},
		{
			reason: HighlightedReason.HighestAbsentRate,
			...activePoliticians
				.map((politician) => {
					const theirVotes = votesInActiveAssemblies.filter(
						({ politicianId }) => politicianId === politician.id
					);

					return {
						politician,
						value:
							theirVotes.filter(({ voteOption }) => voteOption === DefaultVoteOption.Absent)
								.length / theirVotes.length
					};
				})
				.sort((a, z) => z.value - a.value)[0]
		},
		{
			reason: HighlightedReason.HighestBillProposed,
			...activePoliticians
				.map((politician) => ({
					politician,
					value: bills.filter((bill) => bill.proposedLedByPolitician?.id === politician.id).length
				}))
				.sort((a, z) => z.value - a.value)[0]
		},
		{
			reason: HighlightedReason.Youngest,
			...activePoliticians
				.map((politician) => ({
					politician,
					value: politician.birthdate ? dayjs().diff(politician.birthdate, 'years') : 999
				}))
				.sort((a, z) => a.value - z.value)[0]
		}
	];

	const chuanLeekpai = safeFind(activePoliticians, (p) => p.id === 'ชวน-หลีกภัย');
	const banyatBantadtan = safeFind(activePoliticians, (p) => p.id === 'บัญญัติ-บรรทัดฐาน');

	const otherSourcesHighlightedPoliticians: HighlightedPolitician[] = [
		{
			reason: HighlightedReason.LongestServedInPoliticalPositions,
			value: 54,
			politician: chuanLeekpai,
			position: PoliticialPosition.MP,
			year: 2512
		} as LongestServedInPoliticalPositionsPolitician,
		{
			reason: HighlightedReason.MostFrequentlyElectedInConstituency,
			value: 12,
			politician: banyatBantadtan
		},
		{
			reason: HighlightedReason.MostFrequentlyServedAsMinister,
			value: 5,
			politician: chuanLeekpai,
			cabinetTerms: [38, 42, 43, 45, 53]
		} as MostFrequentlyServedAsMinisterPolitician,
		{
			reason: HighlightedReason.MostDiverseServedAsMinister,
			value: 6,
			politician: chuanLeekpai
		}
	];

	const latestVotings: ComponentProps<VoteCard>[] = [...(await fetchVotings())]
		.sort((a, z) => z.date.getTime() - a.date.getTime())
		.slice(0, MAX_LASTEST_VOTE)
		.map((voting) => ({
			voting,
			highlightedVoteByGroups: getHighlightedVoteByGroups(voting, votes, politicians)
		}));

	const billByCategoryAndStatus: BillByCategoryAndStatus = rollup(
		bills.flatMap(({ categories, ...rest }) =>
			categories.map((category) => ({ category, categories, ...rest }))
		),
		(billsByCategory): BillCategoryWithStatus => ({
			count: billsByCategory.length,
			billsByStatus: rollup(
				billsByCategory,
				(billsByStatus) => ({
					samples: billsByStatus.slice(0, MAX_BILL_BY_STATUS),
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
				samples: billsByStatus.slice(0, MAX_BILL_BY_STATUS),
				count: billsByStatus.length
			}),
			(bill) => bill.status
		)
	});

	return {
		highlightedPoliticians,
		otherSourcesHighlightedPoliticians,
		latestVotings,
		billByCategoryAndStatus
	};
}
