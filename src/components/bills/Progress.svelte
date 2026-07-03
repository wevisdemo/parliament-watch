<script lang="ts">
	import BillCard from '$components/BillCard/BillCard.svelte';
	import type { ProposerProps } from '$components/Proposer/Proposer.svelte';
	import { formatThaiDate } from '$lib/date';
	import type { Link, BillEvent, BillStatus } from '$lib/politigraph/genql';
	import RoyalGazette from './RoyalGazette.svelte';
	import { Button } from 'carbon-components-svelte';
	import ArrowRight from 'carbon-icons-svelte/lib/ArrowRight.svelte';
	import CheckmarkFilled from 'carbon-icons-svelte/lib/CheckmarkFilled.svelte';
	import DocumentMultiple_02 from 'carbon-icons-svelte/lib/DocumentMultiple_02.svelte';

	interface Props {
		type: BillEvent['__typename'];
		title: string;
		description: string;
		date: string | null;
		links: Pick<Link, 'note' | 'url'>[];
		mergedIntoBill?: {
			id: string;
			nickname: string;
			title: string | null;
			proposedOn: Date | null;
			status: BillStatus;
			proposer?: ProposerProps['proposer'];
		};
	}

	let { type, title, description, date, links, mergedIntoBill }: Props = $props();
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
		{:else if mergedIntoBill}
			<div class="flex flex-1 flex-col gap-2">
				<div class="flex flex-row items-center gap-1">
					<DocumentMultiple_02 size={24} color="#2600A3" />
					<b class="heading-compact-01">ถูกนำไปรวมร่างกับ</b>
				</div>
				<div class="w-full rounded-sm border border-gray-20">
					<BillCard {...mergedIntoBill} isFullWidth />
				</div>
			</div>
		{/if}
	</div>
</li>
