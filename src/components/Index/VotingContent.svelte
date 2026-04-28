<script context="module" lang="ts">
	export const MAX_LATEST_VOTE = 10;
	export const VOTE_STATUSES = [
		{ value: 'all', label: `${MAX_LATEST_VOTE} มติล่าสุด` },
		{ value: 'passed', label: `${MAX_LATEST_VOTE} มติที่ผ่านล่าสุด` },
		{ value: 'failed', label: `${MAX_LATEST_VOTE} มติที่ไม่ผ่านล่าสุด` }
	] as const;
</script>

<script lang="ts">
	import VoteCard from '$components/VoteCard/VoteCard.svelte';
	import { Button, InlineLoading } from 'carbon-components-svelte';
	import { type ComponentProps, onMount } from 'svelte';
	import Carousel from './Carousel.svelte';
	import { ArrowRight } from 'carbon-icons-svelte';

	export let representativeVotesLabel: string;
	export let senateVotesLabel: string;

	let isLoading = true;
	let latestVoteEvents: ComponentProps<VoteCard>[] = [];
	let selectedStatus: (typeof VOTE_STATUSES)[number]['value'] = 'all';

	async function loadVoteEvents() {
		isLoading = true;
		const res = await fetch(`/files/vote-event-overview/${selectedStatus}.json`);
		if (res.ok) {
			latestVoteEvents = await res.json();
		}
		isLoading = false;
	}

	onMount(() => {
		loadVoteEvents();
	});

	function selectStatus(status: (typeof VOTE_STATUSES)[number]['value']) {
		selectedStatus = status;
		loadVoteEvents();
	}
</script>

<div class="relative flex flex-col gap-4">
	<div class="flex min-h-48 flex-col gap-4">
		<div class="flex flex-col gap-2 md:flex-row">
			<h3 class="fluid-heading-04 text-nowrap">เลือกดู</h3>
			<div class="flex flex-row flex-wrap items-center gap-1">
				{#each VOTE_STATUSES as status (status.value)}
					<button
						class="helper-text-02 rounded-full border border-gray-80 px-3 py-1 {status.value ===
						selectedStatus
							? 'bg-gray-80 text-white'
							: 'text-gray-80 hover:bg-gray-20'}"
						on:click={() => selectStatus(status.value)}
					>
						{status.label}
					</button>
				{/each}
			</div>
		</div>
		<div class="relative min-h-64">
			{#if isLoading}
				<div class="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
					<InlineLoading class="flex items-center justify-center" />
				</div>
			{/if}
			{#if latestVoteEvents.length}
				{#key selectedStatus + isLoading}
					<Carousel>
						{#each latestVoteEvents as voting (voting.id)}
							<VoteCard class="keen-slider__slide" {...voting} />
						{/each}
					</Carousel>
				{/key}
			{/if}
		</div>
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
</div>
