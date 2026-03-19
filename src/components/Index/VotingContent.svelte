<script lang="ts">
	import VoteCard from '$components/VoteCard/VoteCard.svelte';
	import { Button } from 'carbon-components-svelte';
	import type { ComponentProps } from 'svelte';
	import Carousel from './Carousel.svelte';
	import { ArrowRight } from 'carbon-icons-svelte';

	export let latestVoteEvents: ComponentProps<VoteCard>[];
	export let representativeVotesLabel: string;
	export let senateVotesLabel: string;
</script>

<div>
	<h3 class="fluid-heading-04 mb-4">{latestVoteEvents.length} ผลการลงมติล่าสุด</h3>
	<Carousel>
		{#each latestVoteEvents as voting}
			<VoteCard class="keen-slider__slide" {...voting} />
		{/each}
	</Carousel>
</div>
<div class="flex flex-col gap-[6px]">
	<Button
		href="/assemblies/latest/representative/votes"
		kind="secondary"
		icon={ArrowRight}
		class="w-full max-w-none"
	>
		{representativeVotesLabel}
	</Button>
	<Button
		href="/assemblies/latest/senate/votes"
		kind="secondary"
		icon={ArrowRight}
		class="w-full max-w-none"
	>
		{senateVotesLabel}
	</Button>
</div>
