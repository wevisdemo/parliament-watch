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
	import { BillStatus, type Bill } from '$models/bill';
	import { EventStatus, type Event, EventActionType } from '$models/event';
	import {
		ArrowRight,
		CheckmarkFilled,
		CircleDash,
		DocumentMultiple_02,
		Misuse
	} from 'carbon-icons-svelte';
	import RoyalGazette from './RoyalGazette.svelte';
	import { Button } from 'carbon-components-svelte';
	import BillCard from '$components/BillCard/BillCard.svelte';
	import type { Voting } from '$models/voting';
	import type { ComponentProps } from 'svelte';

	export let event: Event;
	export let billStatus: BillStatus;
	export let tooltipText: string;
	export let relatedVotingResults: RelatedVotingResults;
	export let mergedIntoBill: Bill | undefined;
	export let mergedIntoBillLatestEvent: Event | undefined;

	const dateTimeFormat: Intl.DateTimeFormatOptions = {
		year: '2-digit',
		month: 'short',
		day: 'numeric'
	};

	const eventDescription = {
		hearing: {
			title: 'รับฟังความเห็น',
			description: ''
		},
		mp1: {
			title: 'สส. พิจารณา วาระ 1',
			description: 'รับหลักการและตั้งกรรมาธิการ'
		},
		mp2: {
			title: 'สส. พิจารณา วาระ 2',
			description: 'ขั้นกรรมาธิการ และ สส. ลงมติรับรายมาตรา'
		},
		mp3: {
			title: 'สส. พิจารณา วาระ 3',
			description: 'ขั้นลงมติเห็นชอบ'
		},
		senate1: {
			title: 'สว. พิจารณา วาระ 1',
			description: 'รับหลักการและตั้งกรรมาธิการ'
		},
		senate2: {
			title: 'สว. พิจารณา วาระ 2',
			description: 'ขั้นกรรมาธิการ และ สส. ลงมติรับรายมาตรา'
		},
		senate3: {
			title: 'สว. พิจารณา วาระ 3',
			description: 'ขั้นลงมติเห็นชอบ'
		},
		royalAssent: {
			title: 'พระมหากษัตริย์ลงปรมาภิไธย',
			description: ''
		},
		enforcement: {
			title: 'ออกเป็นกฎหมาย',
			description: ''
		},
		other: {
			title: 'รับฟังความเห็น',
			description: ''
		}
	};

	$: voting = ((votingResultsId?: string) => {
		if (votingResultsId === undefined) return undefined;
		let voting: ComponentProps<VoteCard>['voting'] = {
			id: votingResultsId,
			date: relatedVotingResults[Number(votingResultsId)].voting.date,
			title: relatedVotingResults[Number(votingResultsId)].voting.title,
			result: relatedVotingResults[Number(votingResultsId)].voting.result
		};
		return voting;
	})(event.votedInVotingId);

	function getHighlightedVoteByGroups(id: string | undefined, eventType: string) {
		if (id === undefined) return undefined;
		let resultSummary = relatedVotingResults[id].resultSummary;
		if (resultSummary.subResults) {
			return resultSummary.subResults.map((subResult) => {
				return {
					name: subResult.affiliationName,
					count: Number(subResult.agreed),
					total: Number(subResult.total)
				};
			});
		} else if (eventType.includes('senate')) {
			return [
				{
					name: 'สว.',
					count: Number(resultSummary.agreed),
					total: Number(resultSummary.total)
				}
			];
		}
		return undefined;
	}
</script>

<li class="mb-10 ms-4 -mt-1">
	{#if event.status === EventStatus.Succeed || billStatus === BillStatus.Merged}
		<CheckmarkFilled size={24} class="absolute -start-3 bg-ui-background" />
	{:else if event.status === EventStatus.InProgress}
		<CircleDash size={24} class="absolute -start-3 bg-ui-background" color="#8D8D8D" />
	{:else if event.status === EventStatus.Failed}
		<Misuse size={24} class="absolute -start-3 bg-ui-background" color="#981B00" />
	{/if}
	<div class="flex flex-col md:flex-row">
		<div class="flex flex-col ml-1 md:basis-1/3 md:pr-6">
			{#if !(event.status === EventStatus.InProgress && billStatus === BillStatus.InProgress)}
				<p>
					{event.date.toLocaleDateString('th-TH', dateTimeFormat)}
				</p>
			{/if}
			<div
				class={event.status === EventStatus.InProgress && billStatus === BillStatus.InProgress
					? 'text-text-02'
					: 'text-text-primary'}
			>
				<b>{eventDescription[event.type].title}</b>
				<p>{eventDescription[event.type].description}</p>
			</div>
		</div>
		{#if event.actionType === EventActionType.Voted && voting}
			<div class="flex flex-col md:basis-2/3">
				<p class="text-text-02">ผลการลงมติ</p>
				<VoteCard
					isFullWidth={true}
					{voting}
					highlightedVoteByGroups={getHighlightedVoteByGroups(voting.id, event.type)}
				/>
			</div>
		{:else if event.actionType === EventActionType.Enforced}
			<div class="w-full pt-5 md:basis-2/3">
				<RoyalGazette />
				<Button
					class="mt-1 ml-0.5"
					href={event.enforcementDocumentUrl}
					target="_blank"
					kind="tertiary"
					icon={ArrowRight}
					size="small">ดูประกาศราชกิจจา</Button
				>
			</div>
		{:else if event.actionType === EventActionType.Merged && mergedIntoBill}
			<div class="flex flex-col gap-2 md:basis-2/3">
				<DocumentMultiple_02 size={24} color="#2600A3" />
				<b class="heading-compact-01">ถูกนำไปรวมร่างกับ</b>
				<div class="w-full border border-gray-20 rounded-sm">
					<BillCard
						orientation="portrait"
						nickname={mergedIntoBill.nickname}
						status={mergedIntoBill.status}
						billUrl="/bills/{mergedIntoBill.id}"
						isFullWidth={true}
						currentState={mergedIntoBillLatestEvent
							? eventDescription[mergedIntoBillLatestEvent.type].title
							: ''}
					/>
				</div>
				<div class="text-text-02">
					{tooltipText}
				</div>
			</div>
		{/if}
	</div>
</li>
