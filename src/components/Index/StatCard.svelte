<script lang="ts" context="module">
	import type { Politician } from '$models/politician.js';

	export enum HighlightedReason {
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

	export interface HighlightedPolitician {
		reason: HighlightedReason;
		value: number;
		politician: Politician;
	}
</script>

<script lang="ts">
	import PoliticianPicture from '$components/PoliticianPicture/PoliticianPicture.svelte';
	import { ArrowRight } from 'carbon-icons-svelte';
	import { twMerge } from 'tailwind-merge';

	let className = '';
	export { className as class };

	export let politicianData: HighlightedPolitician;
	$: ({ reason, value, politician } = politicianData);

	let formattedValue: string;
	let unit: string;

	// Unit Lookup
	const UNIT_LOOKUP: Record<string, string | undefined> = {
		[HighlightedReason.HighestAssetOwned]: 'ล้านบาท',
		[HighlightedReason.HighestDebtOwned]: 'ล้านบาท',
		[HighlightedReason.HighestPartySwitching]: 'พรรค',
		[HighlightedReason.HighestAbsentRate]: 'ของมติทั้งหมด',
		[HighlightedReason.HighestBillProposed]: 'ร่างกฎหมาย',
		[HighlightedReason.Youngest]: 'ปี',
		[HighlightedReason.MostFrequentlyElectedInConstituency]: 'สมัย',
		[HighlightedReason.MostDiverseServedAsMinister]: 'กระทรวง',
		[HighlightedReason.MostGunOwned]: 'กระบอก'
	};

	$: switch (reason) {
		case HighlightedReason.LongestServedInPoliticalPositions:
			if ('year' in politicianData && 'position' in politicianData) {
				unit = 'ปี (เป็น ' + politicianData.position + ' ครั้งแรกในปี ' + politicianData.year + ')';
			}
			break;
		case HighlightedReason.MostFrequentlyServedAsMinister:
			if ('cabinetTerms' in politicianData) {
				unit = 'คณะ (ชุดที่ ' + (politicianData.cabinetTerms as Array<string>).join(', ') + ')';
			}
			break;
		case HighlightedReason.MostVisitedInWikipediaLastMonth: {
			const previousMonthDate = new Date();
			previousMonthDate.setDate(0);
			unit =
				'ครั้ง ในเดือน ' +
				previousMonthDate.toLocaleDateString('th-TH', { month: 'short', year: '2-digit' });
			break;
		}
		default:
			unit = UNIT_LOOKUP[reason] ?? 'หน่วย';
	}

	// Value Lookup
	$: switch (reason) {
		case HighlightedReason.HighestAssetOwned:
		case HighlightedReason.HighestDebtOwned:
			formattedValue = (value / 1_000_000).toLocaleString('th-TH', {
				maximumFractionDigits: 2
			});
			break;
		case HighlightedReason.HighestAbsentRate:
			formattedValue =
				(value * 100).toLocaleString('th-TH', {
					maximumFractionDigits: 2
				}) + '%';
			break;
		default:
			formattedValue = value.toLocaleString('th-TH', {
				maximumFractionDigits: 2
			});
	}

	// Description Lookup
	const DESC_LOOKUP: Record<string, string | undefined> = {
		[HighlightedReason.LongestServedInPoliticalPositions]:
			'พิจารณาจากปีที่นักการเมืองในฐานข้อมูลนี้ ได้รับตำแหน่ง สส. / สว. / ครม.เป็นครั้งแรก',
		[HighlightedReason.MostFrequentlyElectedInConstituency]:
			'พิจารณาจากจำนวนครั้งที่นักการเมืองในฐานข้อมูลนี้ ได้รับเลือกตั้งในระบบเขตทั้งหมด โดยใช้ผลการเลือกตั้งย้อนหลังตั้งแต่ปี 2535',
		[HighlightedReason.MostFrequentlyServedAsMinister]:
			'พิจารณาจากจำนวนคณะรัฐมนตรี ที่นักการเมืองในฐานข้อมูลนี้เคยได้รับตำแหน่งรัฐมนตรี ',
		[HighlightedReason.MostDiverseServedAsMinister]:
			'พิจารณาจากกระทรวงทั้งหมด ที่นักการเมืองในฐานข้อมูลนี้เคยได้รับตำแหน่งรัฐมนตรี โดยไม่นับกระทรวงที่เคยได้ซ้ำ ',
		[HighlightedReason.MostVisitedInWikipediaLastMonth]:
			'ใช้ข้อมูลยอดเข้าชม (pageview) รวมทั้งเดือนจาก Wikipedia API',
		[HighlightedReason.MostGunOwned]:
			'ใช้ข้อมูลจากการยื่นบัญชีทรัพย์สินครั้งล่าสุด จาก <a class="underline text-[color:inherit]" href="https://poldata.actai.co/" target="_blank" rel="nofollow noopener noreferrer">poldata.actai.co</a>'
	};
	$: description = DESC_LOOKUP[reason] ?? '';
</script>

<article class={twMerge('flex flex-col', className)}>
	<h4 class="heading-01 text-blue-70 mb-[2px]">{reason}</h4>
	{#if description}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		<p class="flex-[1_1_70px] label-01 text-gray-60">{@html description}</p>
	{/if}
	<a href={`/politicians/${politician.id}`} class="flex bg-white text-gray-100 mt-1 hover:bg-ui-01">
		<div class="flex flex-col gap-2 p-4 flex-1">
			<PoliticianPicture
				avatar={politician.avatar}
				size="40"
				party={politician.partyRoles[0]?.party}
			/>
			<span class="heading-02 text-gray-100">{politician.firstname} {politician.lastname}</span>
			<span class="-mt-2 label-01 text-gray-60">
				{#if politician.assemblyRoles[0]}
					<span>{politician.assemblyRoles[0].role}</span>
				{/if}
				{#if politician.assemblyRoles[0] && politician.partyRoles[0]}
					<span>|</span>
				{/if}
				{#if politician.partyRoles[0]}
					<span class="whitespace-nowrap">พรรค{politician.partyRoles[0]?.party.name}</span>
				{/if}
			</span>
			<span class="body-01 text-blue-70">{formattedValue} {unit}</span>
		</div>
		<div class="flex items-end p-4"><ArrowRight /></div>
	</a>
</article>
