<script lang="ts">
	import VoteCard from '$components/VoteCard/VoteCard.svelte';
	import { Button } from 'carbon-components-svelte';
	import type { ComponentProps } from 'svelte';
	import Carousel from './Carousel.svelte';
	import { ArrowRight } from 'carbon-icons-svelte';

	export let latestVoteEvents: ComponentProps<VoteCard>[];
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
		href="/assemblies/สภาผู้แทนราษฎร-26/votes"
		kind="secondary"
		icon={ArrowRight}
		class="w-full max-w-none"
	>
		ดูการลงมติทั้งหมดของสมาชิกสภาผู้แทนราษฎร ชุดที่ 26
	</Button>
	<Button
		href="/assemblies/วุฒิสภา-13/votes"
		kind="secondary"
		icon={ArrowRight}
		class="w-full max-w-none"
	>
		ดูการลงมติทั้งหมดของสมาชิกวุฒิสภา ชุดที่ 13
	</Button>
</div>
