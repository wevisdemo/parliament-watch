import {
	ALL_CATEGORY_KEY,
	MAX_BILL_BY_STATUS,
	type BillByCategoryAndStatus,
	type BillCategoryWithStatus
} from '$components/Index/BillContent.svelte';
import type { HighlightedPolitician } from '$components/Index/StatCard.svelte';
import { HighlightedReason } from '$components/Index/StatCard.svelte';
import type VoteCard from '$components/VoteCard/VoteCard.svelte';
import {
	fetchAssemblies,
	fetchBills,
	fetchPoliticians,
	fetchPromises,
	fetchVotes,
	fetchVotings
} from '$lib/datasheets';
import { safeFind } from '$lib/datasheets/processor.js';
import { getHighlightedVoteByGroups } from '$lib/datasheets/voting.js';
import { toVoteCardVoting } from '$lib/model-component-adapters/votecardvoting';
import { BillStatus } from '$models/bill';
import { PromiseStatus } from '$models/promise';
import type { PromisesByStatus } from './promises/+page.server';
import { groups, rollup } from 'd3-array';
import type { ComponentProps } from 'svelte';

const MAX_LATEST_VOTE = 5;
const MAX_ENACTED_BILL = 10;
const MAX_PROMISES_SAMPLE = 3;

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
	const bills = await fetchBills();
	const promises = await fetchPromises();
	const assembles = await fetchAssemblies();

	const activePoliticians = politicians.filter(({ isActive }) => isActive);

	const chuanLeekpai = safeFind(activePoliticians, (p) => p.id === 'ชวน-หลีกภัย');
	const banyatBantadtan = safeFind(activePoliticians, (p) => p.id === 'บัญญัติ-บรรทัดฐาน');

	const highlightedPoliticians: HighlightedPolitician[] = [
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
		.slice(0, MAX_LATEST_VOTE)
		.map((voting) =>
			toVoteCardVoting(voting, getHighlightedVoteByGroups(voting, votes, politicians, assembles))
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
		latestVotings,
		billByCategoryAndStatus,
		promiseSummary
	};
}
