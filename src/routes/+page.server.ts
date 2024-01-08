import { building } from '$app/environment';
import type { HighlightedPolitician } from '$components/Index/StatCard.svelte';
import { HighlightedReason } from '$components/Index/StatCard.svelte';
import { fetchPoliticians } from '$lib/datasheets/index.js';
import { safeFind } from '$lib/datasheets/processor.js';
import { fetchVotings } from '$lib/datasheets/index.js';
import { getMostGun } from '$lib/ranking/gun.js';
import { getPoliticianWithMostViewLastMonth } from '$lib/ranking/wikipedia.js';
import { movingForwardPolitician } from '../mocks/data/politician.js';
import type { VoteCardProps } from './assemblies/[id]/+page.server.js';

const MAX_LASTEST_VOTE = 5;

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

interface MostVisitedInWikipediaLastMonthPolitician extends HighlightedPolitician {
	updatedAt: Date;
}

export async function load() {
	const politician = await fetchPoliticians();

	const chuanLeekpai = await safeFind(politician, (p) => p.id === 'ชวน-หลีกภัย');
	const banyatBantadtan = await safeFind(politician, (p) => p.id === 'บัญญัติ-บรรทัดฐาน');

	const highlightedPoliticians: HighlightedPolitician[] = [
		{
			reason: HighlightedReason.HighestAssetOwned,
			value: 95787230000,
			politician: movingForwardPolitician
		},
		{
			reason: HighlightedReason.HighestDebtOwned,
			value: 1862770000,
			politician: movingForwardPolitician
		},
		{
			reason: HighlightedReason.HighestPartySwitching,
			value: 12,
			politician: movingForwardPolitician
		},
		{
			reason: HighlightedReason.HighestAbsentRate,
			value: 0.98,
			politician: movingForwardPolitician
		},
		{
			reason: HighlightedReason.HighestBillProposed,
			value: 87,
			politician: movingForwardPolitician
		},
		{
			reason: HighlightedReason.Youngest,
			value: 25,
			politician: movingForwardPolitician
		}
	];

	let wikipediaPolitician: Omit<HighlightedPolitician, 'reason'> = {
		politician: movingForwardPolitician,
		value: 476263
	};
	let gunPolitician: Omit<HighlightedPolitician, 'reason'> = {
		politician: movingForwardPolitician,
		value: 25
	};

	if (building) {
		wikipediaPolitician = await getPoliticianWithMostViewLastMonth();
		gunPolitician = (await getMostGun()) ?? gunPolitician;
	}

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
		},
		{
			reason: HighlightedReason.MostVisitedInWikipediaLastMonth,
			...wikipediaPolitician,
			updatedAt: new Date()
		} as MostVisitedInWikipediaLastMonthPolitician,
		...(gunPolitician
			? [
					{
						reason: HighlightedReason.MostGunOwned,
						politician: gunPolitician.politician,
						value: gunPolitician.value
					}
			  ]
			: [])
	];

	const latestVotings: VoteCardProps[] = [...(await fetchVotings())]
		.sort((a, z) => z.date.getTime() - a.date.getTime())
		.slice(0, MAX_LASTEST_VOTE)
		.map((voting) => ({
			voting,
			// TODO: aggregate votes data
			highlightedVoteByGroups: [
				{
					name: 'สส. ฝ่ายรัฐบาล',
					count: 160,
					total: 315
				},
				{
					name: 'สส. ฝ่ายค้าน',
					count: 164,
					total: 185
				},
				{
					name: 'สว.',
					count: 200,
					total: 250
				}
			]
		}));

	return {
		highlightedPoliticians,
		otherSourcesHighlightedPoliticians,
		latestVotings
	};
}
