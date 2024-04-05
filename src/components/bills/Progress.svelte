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
	import { type BillEvent, BillEventActionType } from '$models/bill-event';
	import { ArrowRight, CheckmarkFilled, DocumentMultiple_02 } from 'carbon-icons-svelte';
	import RoyalGazette from './RoyalGazette.svelte';
	import { Button } from 'carbon-components-svelte';
	import BillCard from '$components/BillCard/BillCard.svelte';
	import type { Voting } from '$models/voting';

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

	$: voting = event.votedInVotingId
		? relatedVotingResults?.[event.votedInVotingId]?.voting
		: undefined;

	$: highlightedVoteByGroups = (() => {
		if (!event.votedInVotingId) return undefined;

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

		return undefined;
	})();
</script>

<li class="-mt-1 mb-10 ms-4">
	<CheckmarkFilled size={24} class="absolute -start-3 bg-ui-background" />

	<div class="flex flex-col md:flex-row">
		<div class="ml-1 flex flex-col md:basis-1/3 md:pr-6">
			<p>
				{event.date.toLocaleDateString('th-TH', dateTimeFormat)}
			</p>
			<div>
				<b>{event.title}</b>
				<p>{event.description}</p>
			</div>
		</div>
		{#if voting && highlightedVoteByGroups}
			<div class="flex flex-col md:basis-2/3">
				<p class="text-text-02">ผลการลงมติ</p>
				<VoteCard isFullWidth={true} {voting} {highlightedVoteByGroups} />
			</div>
		{:else if event.actionType === BillEventActionType.Enforced}
			<div class="w-full pt-5 md:basis-2/3">
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
		{:else if event.actionType === BillEventActionType.Merged && mergedIntoBill}
			<div class="flex flex-col gap-2 md:basis-2/3">
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
