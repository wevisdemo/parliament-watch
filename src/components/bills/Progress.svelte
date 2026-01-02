<script lang="ts">
	// import VoteCard from '$components/VoteCard/VoteCard.svelte';
	import { ArrowRight, CheckmarkFilled, DocumentMultiple_02 } from 'carbon-icons-svelte';
	import RoyalGazette from './RoyalGazette.svelte';
	import { Button } from 'carbon-components-svelte';
	// import BillCard from '$components/BillCard/BillCard.svelte';
	// import type { ComponentProps } from 'svelte';
	import type { Link, BillEvent } from '$lib/politigraph/genql';
	import { formatThaiDate } from '$lib/date';

	export let type: BillEvent['__typename'];
	export let title: string;
	export let description: string;
	export let date: string | null;
	export let links: Pick<Link, 'note' | 'url'>[];
	// export let tooltipText: string;
	// export let voteEvent: ComponentProps<VoteCard>;
	// export let mergedIntoBill: Bill | undefined;
	// export let mergedIntoBillLatestEvent: Event | undefined;
</script>

<li class="-mt-1 mb-10 ms-4">
	<CheckmarkFilled size={24} class="absolute -start-3 bg-ui-background" />

	<div class="flex flex-col md:flex-row">
		<div class="ml-1 flex w-full max-w-md flex-col md:pr-6">
			{#if date}
				<p>
					{formatThaiDate(date, { shortMonth: true, shortYear: true })}
				</p>
			{/if}
			<div>
				<b>{title}</b>
				{#if description}
					<p>
						{description}
					</p>
				{/if}
			</div>
		</div>
		<!-- TODO: Connect with vote event -->
		<!-- {#if voting}
			<div class="flex flex-1 flex-col">
				<p class="text-text-02">ผลการลงมติ</p>
				<VoteCard isFullWidth {...voting} />
			</div> -->
		{#if type === 'BillEnactEvent' && links.length}
			<div class="pt-5">
				<RoyalGazette />
				<Button
					class="mt-1 w-full"
					href={links[0].url}
					target="_blank"
					kind="tertiary"
					icon={ArrowRight}
					size="small">{links[0].note}</Button
				>
			</div>
			<!-- TODO: Merged bill -->
			<!-- {:else if mergedIntoBill}
			<div class="flex flex-1 flex-col gap-2">
				<DocumentMultiple_02 size={24} color="#2600A3" />
				<b class="heading-compact-01">ถูกนำไปรวมร่างกับ</b>
				<div class="w-full rounded-sm border border-gray-20">
					<BillCard
						{...mergedIntoBill}
						isFullWidth={true}
					/>
				</div>
				<div class="text-text-02">
					{tooltipText}
				</div>
			</div> -->
		{/if}
	</div>
</li>
