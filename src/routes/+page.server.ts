import { building } from '$app/environment';
import type { HighlightedPolitician } from '$components/Index/StatCard.svelte';
import { HighlightedReason } from '$components/Index/StatCard.svelte';
import { getMostGun } from '$lib/ranking/gun.js';
import { getPoliticianWithMostViewLastMonth } from '$lib/ranking/wikipedia.js';
import { movingForwardPolitician } from '../mocks/data/politician.js';

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
			politician: movingForwardPolitician,
			position: PoliticialPosition.MP,
			year: 2512
		} as LongestServedInPoliticalPositionsPolitician,
		{
			reason: HighlightedReason.MostFrequentlyElectedInConstituency,
			value: 12,
			politician: movingForwardPolitician
		},
		{
			reason: HighlightedReason.MostFrequentlyServedAsMinister,
			value: 5,
			politician: movingForwardPolitician,
			cabinetTerms: [38, 42, 43, 45, 53]
		} as MostFrequentlyServedAsMinisterPolitician,
		{
			reason: HighlightedReason.MostDiverseServedAsMinister,
			value: 6,
			politician: movingForwardPolitician
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

	return {
		highlightedPoliticians,
		otherSourcesHighlightedPoliticians
	};
}
