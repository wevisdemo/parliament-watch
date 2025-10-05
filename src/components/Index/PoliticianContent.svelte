<script lang="ts">
	import { Button, InlineLoading } from 'carbon-components-svelte';
	import StatCard, { HighlightedReason } from './StatCard.svelte';
	import { fetchExternalPoliticianRanking } from '$lib/politician-ranking';
	import Carousel from './Carousel.svelte';
	import { ArrowRight } from 'carbon-icons-svelte';
	import type { ComponentProps } from 'svelte';

	interface MostVisitedInWikipediaLastMonthPolitician extends ComponentProps<StatCard> {
		updatedAt: Date;
	}

	export let highlightedPoliticians: ComponentProps<StatCard>[];

	async function getExternalHighlightedPoliticians(): Promise<ComponentProps<StatCard>[]> {
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

<div class="space-y-6">
	<h3 class="fluid-heading-04">นักการเมืองที่น่าสนใจ</h3>
	{#await getExternalHighlightedPoliticians()}
		<InlineLoading class="flex items-center justify-center p-12" />
	{:then externalHighlightedPoliticians}
		<Carousel
			arrowLeftClass="top-auto bottom-[75px] translate-y-1/2"
			arrowRightClass="top-auto bottom-[75px] translate-y-1/2"
		>
			{#each [...highlightedPoliticians, ...externalHighlightedPoliticians] as politicianData (politicianData.reason)}
				<StatCard class="keen-slider__slide" {...politicianData} />
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
		สมาชิกสภาผู้แทนราษฎร (สส.) ชุดที่ 26 (ชุดปัจจุบัน)
	</Button>

	<Button
		href="/assemblies/วุฒิสภา-13"
		kind="secondary"
		icon={ArrowRight}
		class="w-full max-w-none"
	>
		สมาชิกวุฒิสภา (สว.) ชุดที่ 13 (ชุดปัจจุบัน)
	</Button>

	<Button
		href="/assemblies/คณะรัฐมนตรี-65"
		kind="secondary"
		icon={ArrowRight}
		class="w-full max-w-none"
	>
		คณะรัฐมนตรี ชุดที่ 65 (ชุดปัจจุบัน)
	</Button>
</div>
