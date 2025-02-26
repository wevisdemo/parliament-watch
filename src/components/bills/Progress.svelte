<script lang="ts" context="module">
	export interface VotingResultSummary {
		agreed: number;
		total: number;
		subResults?: {
			affiliationName: string;
			agreed: number;
			total: number;
		}[];
	}

	export interface RelatedVotingResults {
		[id: string]: {
			voting: Voting;
			resultSummary: VotingResultSummary;
		};
	}
</script>

<script lang="ts">
	import VoteCard from '$components/VoteCard/VoteCard.svelte';
	import { type Bill } from '$models/bill';
	import { type BillEvent } from '$models/bill-event';
	import { ArrowRight, CheckmarkFilled, DocumentMultiple_02 } from 'carbon-icons-svelte';
	import RoyalGazette from './RoyalGazette.svelte';
	import { Button } from 'carbon-components-svelte';
	import BillCard from '$components/BillCard/BillCard.svelte';
	import type { Voting } from '$models/voting';
	import { toVoteCardVoting } from '$lib/datasheets/voting';
	export let event: BillEvent;
	export let tooltipText: string;
	export let relatedVotingResults: RelatedVotingResults | undefined;
	export let mergedIntoBill: Bill | undefined;
	export let mergedIntoBillLatestEvent: BillEvent | undefined;

	const dateTimeFormat: Intl.DateTimeFormatOptions = {
		year: '2-digit',
		month: 'short',
		day: 'numeric'
	};

	$: voting = (() => {
		let voting;
		if (event.votedInVotingId) {
			voting = relatedVotingResults?.[event.votedInVotingId]?.voting;
		}
		return voting ? toVoteCardVoting(voting, highlightedVoteByGroups) : undefined;
	})();

	$: highlightedVoteByGroups = (() => {
		if (!event.votedInVotingId) return [];

		const resultSummary = relatedVotingResults?.[event.votedInVotingId]?.resultSummary;

		if (resultSummary?.subResults) {
			return resultSummary?.subResults.map((subResult) => ({
				name: subResult.affiliationName,
				count: subResult.agreed,
				total: subResult.total
			}));
		} else if (resultSummary && event.type.includes('senate')) {
			return [
				{
					name: 'สว.',
					count: resultSummary.agreed,
					total: resultSummary.total
				}
			];
		}

		return [];
	})();
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
				<VoteCard isFullWidth={true} {voting} />
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
						bill={mergedIntoBill}
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
