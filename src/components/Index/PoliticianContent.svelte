<script lang="ts">
	import { fetchExternalPoliticianRanking } from '$lib/politician-ranking';
	import Carousel from './Carousel.svelte';
	import StatCard, { HighlightedReason, type StatCardProps } from './StatCard.svelte';
	import { Button, InlineLoading } from 'carbon-components-svelte';
	import { ArrowRight } from 'carbon-icons-svelte';

	interface MostVisitedInWikipediaLastMonthPolitician extends StatCardProps {
		updatedAt: Date;
	}

	interface Props {
		highlightedPoliticians: StatCardProps[];
		representativeLabel: string;
		senateLabel: string;
		cabinetLabel: string;
	}

	let { highlightedPoliticians, representativeLabel, senateLabel, cabinetLabel }: Props = $props();

	async function getExternalHighlightedPoliticians(): Promise<StatCardProps[]> {
		const { politicianWithMostWikipediaVisit, updatedAt } = await fetchExternalPoliticianRanking();

		return [
			{
				reason: HighlightedReason.MostVisitedInWikipediaLastMonth,
				...politicianWithMostWikipediaVisit,
				updatedAt
			} as MostVisitedInWikipediaLastMonthPolitician
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
		href="/assemblies/latest/representative"
		kind="secondary"
		icon={ArrowRight}
		class="w-full max-w-none"
	>
		{representativeLabel}
	</Button>

	<Button
		href="/assemblies/latest/senate"
		kind="secondary"
		icon={ArrowRight}
		class="w-full max-w-none"
	>
		{senateLabel}
	</Button>

	<Button
		href="/assemblies/latest/cabinet"
		kind="secondary"
		icon={ArrowRight}
		class="w-full max-w-none"
	>
		{cabinetLabel}
	</Button>
</div>
