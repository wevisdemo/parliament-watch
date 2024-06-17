<script lang="ts">
	import { Button, InlineLoading } from 'carbon-components-svelte';
	import StatCard, { HighlightedReason, type HighlightedPolitician } from './StatCard.svelte';
	import { fetchExternalPoliticianRanking } from '$lib/politician-ranking';
	import Carousel from './Carousel.svelte';
	import { ArrowRight } from 'carbon-icons-svelte';

	interface MostVisitedInWikipediaLastMonthPolitician extends HighlightedPolitician {
		updatedAt: Date;
	}

	export let highlightedPoliticians: HighlightedPolitician[];
	export let otherSourcesHighlightedPoliticians: HighlightedPolitician[];

	async function getExternalHighlightedPoliticians(): Promise<HighlightedPolitician[]> {
		const { politicianWithMostWikipediaVisit, politicianWithMostGun, updatedAt } =
			await fetchExternalPoliticianRanking();

		return [
			{
				reason: HighlightedReason.MostVisitedInWikipediaLastMonth,
				...politicianWithMostWikipediaVisit,
				updatedAt
			} as MostVisitedInWikipediaLastMonthPolitician,
			{
				reason: HighlightedReason.MostGunOwned,
				...politicianWithMostGun
			}
		];
	}
</script>

<div>
	<h3 class="fluid-heading-04">นักการเมืองชุดล่าสุดที่น่าสนใจ</h3>
	<p class="label-01 mb-6 text-gray-60">
		หมายเหตุ : ในกรณีที่มีมากกว่า 1 คน จะเลือกจากลำดับตัวอักษรในชื่อ
	</p>
	<div class="grid grid-cols-1 gap-3 md:grid-cols-3">
		{#each highlightedPoliticians as politicianData (politicianData.reason)}
			<StatCard {politicianData} />
		{/each}
	</div>
</div>
<div>
	<h3 class="heading-01 relative mb-6 text-center">
		<span class="absolute left-0 top-1/2 h-[1px] w-full bg-text-03" aria-hidden="true" />
		<span class="relative z-10 bg-ui-01 px-2 text-text-03">คัดเลือกโดยใช้แหล่งข้อมูลอื่นๆ</span>
	</h3>
	{#await getExternalHighlightedPoliticians()}
		<InlineLoading class="flex items-center justify-center p-12" />
	{:then externalHighlightedPoliticians}
		<Carousel
			arrowLeftClass="top-auto bottom-[75px] translate-y-1/2"
			arrowRightClass="top-auto bottom-[75px] translate-y-1/2"
		>
			{#each [...otherSourcesHighlightedPoliticians, ...externalHighlightedPoliticians] as politicianData (politicianData.reason)}
				<StatCard class="keen-slider__slide" {politicianData} />
			{/each}
		</Carousel>
	{/await}
</div>
<div class="flex flex-col gap-[6px]">
	<Button
		href="/assemblies/สภาผู้แทนราษฎร-26"
		kind="secondary"
		icon={ArrowRight}
		class="w-full max-w-none"
	>
		สมาชิกสภาผู้แทนราษฎร (สส.) ทั้งหมด
	</Button>

	<Button href="/assemblies/วุฒิสภา-12" kind="secondary" icon={ArrowRight} class="w-full max-w-none"
		>สมาชิกวุฒิสภา (สว.) ทั้งหมด</Button
	>
</div>
