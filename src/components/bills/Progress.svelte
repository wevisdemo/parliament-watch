<script lang="ts">
	import VoteCard from '$components/VoteCard/VoteCard.svelte';
	import { type Bill } from '$models/bill';
	import { type BillEvent } from '$models/bill-event';
	import { ArrowRight, CheckmarkFilled, DocumentMultiple_02 } from 'carbon-icons-svelte';
	import RoyalGazette from './RoyalGazette.svelte';
	import { Button } from 'carbon-components-svelte';
	import BillCard from '$components/BillCard/BillCard.svelte';
	import type { ComponentProps } from 'svelte';

	export let event: BillEvent;
	export let tooltipText: string;
	export let relatedVoteEvents: ComponentProps<VoteCard>[];
	export let mergedIntoBill: Bill | undefined;
	export let mergedIntoBillLatestEvent: BillEvent | undefined;

	const dateTimeFormat: Intl.DateTimeFormatOptions = {
		year: '2-digit',
		month: 'short',
		day: 'numeric'
	};

	$: voting =
		event.votedInVotingId && relatedVoteEvents.find((v) => v.id === event.votedInVotingId);
</script>

<li class="-mt-1 mb-10 ms-4">
	<CheckmarkFilled size={24} class="absolute -start-3 bg-ui-background" />

	<div class="flex flex-col md:flex-row">
		<div class="ml-1 flex w-full max-w-md flex-col md:pr-6">
			{#if event.date}
				<p>
					{event.date.toLocaleDateString('th-TH', dateTimeFormat)}
				</p>
			{/if}
			<div>
				<b>{event.title}</b>
				<p>{event.description}</p>
			</div>
		</div>
		{#if voting}
			<div class="flex flex-1 flex-col">
				<p class="text-text-02">ผลการลงมติ</p>
				<VoteCard isFullWidth {...voting} />
			</div>
		{:else if event.enforcementDocumentUrl}
			<div class="flex-1 pt-5">
				<RoyalGazette />
				<Button
					class="ml-0.5 mt-1"
					href={event.enforcementDocumentUrl}
					target="_blank"
					kind="tertiary"
					icon={ArrowRight}
					size="small">ดูประกาศราชกิจจา</Button
				>
			</div>
		{:else if mergedIntoBill}
			<div class="flex flex-1 flex-col gap-2">
				<DocumentMultiple_02 size={24} color="#2600A3" />
				<b class="heading-compact-01">ถูกนำไปรวมร่างกับ</b>
				<div class="w-full rounded-sm border border-gray-20">
					<BillCard
						orientation="portrait"
						{...mergedIntoBill}
						isFullWidth={true}
						currentState={mergedIntoBillLatestEvent ? event.title : ''}
					/>
				</div>
				<div class="text-text-02">
					{tooltipText}
				</div>
			</div>
		{/if}
	</div>
</li>
