<script lang="ts" context="module">
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
		MostVisitedInWikipediaLastMonth = 'ยอดเข้าชมประวัติใน Wikipedia มากสุดในเดือนที่แล้ว'
	}
</script>

<script lang="ts">
	import PoliticianPicture from '$components/PoliticianPicture/PoliticianPicture.svelte';
	import { ArrowRight } from 'carbon-icons-svelte';
	import { twMerge } from 'tailwind-merge';

	let className = '';
	export { className as class };

	export let reason: HighlightedReason;
	export let value: number;
	export let id: string;
	export let name: string;
	export let avatar: string;
	export let label: string;
	export let partyName: string | undefined = undefined;
	export let partyLogo: string | undefined = undefined;

	export let year: number | undefined = undefined;
	export let position: string | undefined = undefined;
	export let cabinetTerms: number[] | undefined = undefined;

	const POSTFIX_LOOKUP: Record<string, string | undefined> = {
		[HighlightedReason.HighestPartySwitching]: '(ข้อมูลย้อนหลังถึงปี 2562)'
	};

	$: postfix = POSTFIX_LOOKUP[reason] ?? '';

	// Unit Lookup
	const UNIT_LOOKUP: Record<string, string | undefined> = {
		[HighlightedReason.HighestAssetOwned]: 'ล้านบาท',
		[HighlightedReason.HighestDebtOwned]: 'ล้านบาท',
		[HighlightedReason.HighestPartySwitching]: 'พรรค',
		[HighlightedReason.HighestAbsentRate]: 'ของมติทั้งหมดในสมัยล่าสุด',
		[HighlightedReason.HighestBillProposed]: 'ร่างกฎหมาย',
		[HighlightedReason.Youngest]: 'ปี',
		[HighlightedReason.MostFrequentlyElectedInConstituency]: 'สมัย',
		[HighlightedReason.MostDiverseServedAsMinister]: 'กระทรวง'
	};

	$: unit = (() => {
		switch (reason) {
			case HighlightedReason.LongestServedInPoliticalPositions:
				if (year && position) {
					return 'ปี (เป็น ' + position + ' ครั้งแรกในปี ' + year + ')';
				}
				break;
			case HighlightedReason.MostFrequentlyServedAsMinister:
				if (cabinetTerms) {
					return 'คณะ (ชุดที่ ' + cabinetTerms.join(', ') + ')';
				}
				break;
			case HighlightedReason.MostVisitedInWikipediaLastMonth: {
				const previousMonthDate = new Date();
				previousMonthDate.setDate(0);
				return (
					'ครั้ง ในเดือน ' +
					previousMonthDate.toLocaleDateString('th-TH', { month: 'short', year: '2-digit' })
				);
			}
			default:
				return UNIT_LOOKUP[reason] ?? 'หน่วย';
		}
	})();

	// Value Lookup
	$: formattedValue = (() => {
		switch (reason) {
			case HighlightedReason.HighestAssetOwned:
			case HighlightedReason.HighestDebtOwned:
				return (value / 1_000_000).toLocaleString('th-TH', {
					maximumFractionDigits: 2
				});
			case HighlightedReason.HighestAbsentRate:
				return (
					(value * 100).toLocaleString('th-TH', {
						maximumFractionDigits: 2
					}) + '%'
				);
			default:
				return value.toLocaleString('th-TH', {
					maximumFractionDigits: 2
				});
		}
	})();

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
			'ใช้ข้อมูลยอดเข้าชม (pageview) รวมทั้งเดือนจาก Wikipedia API'
	};
	$: description = DESC_LOOKUP[reason] ?? '';
</script>

<article class={twMerge('flex flex-col', className)}>
	<h4 class="heading-01 mb-[2px] text-blue-70">
		{reason} <span class="font-normal">{postfix}</span>
	</h4>
	{#if description}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		<p class="label-01 flex-[1_1_70px] text-gray-60">{@html description}</p>
	{/if}
	<a href={`/politicians/${id}`} class="mt-1 flex bg-white text-gray-100 hover:bg-ui-01">
		<div class="flex flex-1 flex-col gap-2 p-4">
			<PoliticianPicture {avatar} {partyLogo} size="40" />
			<span class="heading-02 text-gray-100">{name}</span>
			<span class="label-01 -mt-2 text-gray-60">
				{#if label}
					<span>{label}</span>
				{/if}
				{#if label && partyName}
					<span>|</span>
				{/if}
				{#if partyName}
					<span class="whitespace-nowrap">พรรค{partyName}</span>
				{/if}
			</span>
			<span class="body-01 text-blue-70">{formattedValue} {unit}</span>
		</div>
		<div class="flex items-end p-4"><ArrowRight /></div>
	</a>
</article>
