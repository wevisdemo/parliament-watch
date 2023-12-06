import type { Politician } from '$models/politician.js';
import { movingForwardPolitician } from '../mocks/data/politician.js';

enum HighlightedReason {
	HighestAssetOwned = 'มีทรัพย์สินมากที่สุด',
	HighestDebtOwned = 'มีหนี้สินมากที่สุด',
	HighestPartySwitching = 'ย้ายพรรคบ่อยที่สุด',
	HighestAbsentRate = 'ขาดลงมติมากที่สุด',
	HighestBillProposed = 'เสนอร่างกฎหมายเยอะที่สุด',
	Youngest = 'อายุน้อยที่สุด',

	// From other sources
	LongestServedInPoliticalPositions = 'อยู่ในวงการมานานที่สุด',
	MostFrequentlyElectedInConstituency = 'ได้รับเลือกตั้งระบบเขตบ่อยที่สุด',
	MostFrequentlyServedAsMinister = 'ได้ตำแหน่งรัฐมนตรีบ่อยที่สุด',
	MostDiverseServedAsMinister = 'ได้ตำแหน่งรัฐมนตรีหลากหลายกระทรวงสุด',
	MostVisitedInWikipediaLastMonth = 'ยอดเข้าชมประวัติใน Wikipedia มากสุดในเดือนที่แล้ว',
	MostGunOwned = 'ครอบครองปืนมากที่สุด'
}

interface HighlightedPolitician {
	reason: HighlightedReason;
	value: number;
	politician: Politician;
}

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

export function load({ params }) {
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
			value: 476263,
			politician: movingForwardPolitician,
			updatedAt: new Date('2023-11-01')
		} as MostVisitedInWikipediaLastMonthPolitician,
		{
			reason: HighlightedReason.MostGunOwned,
			value: 25,
			politician: movingForwardPolitician
		}
	];

	return {
		highlightedPoliticians,
		otherSourcesHighlightedPoliticians
	};
}
