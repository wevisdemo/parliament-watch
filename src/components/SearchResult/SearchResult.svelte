<script lang="ts">
	import NoResultItemsFound from '$components/SearchResultGroup/NoResultItemsFound.svelte';
	import SearchResultGroup from '$components/SearchResultGroup/SearchResultGroup.svelte';
	import LawIcon from '$components/icons/LawIcon.svelte';
	import PoliticianIcon from '$components/icons/PoliticianIcon.svelte';
	import VoteIcon from '$components/icons/VoteIcon.svelte';
	import type { SearchResults } from '$models/search';
	import { SkeletonIcon, SkeletonText } from 'carbon-components-svelte';
	import { twMerge } from 'tailwind-merge';

	interface Props {
		class?: string;
		searchResults?: SearchResults | null;
		isLoading?: boolean;
	}

	let { class: className = '', searchResults = null, isLoading = false }: Props = $props();

	const skeletonGroups = [0, 1, 2];
	const skeletonItems = [0, 1, 2];

	const containerClass = 'max-h-[calc(100vh-3rem)] w-[320px] overflow-y-scroll';
	const containerStyle = 'box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.30);';
</script>

{#if isLoading}
	<div
		class={twMerge(containerClass, className)}
		style={containerStyle}
		role="status"
		aria-label="กำลังโหลดผลการค้นหา"
	>
		{#each skeletonGroups as groupIndex (groupIndex)}
			<div>
				<div class="flex items-center gap-2 bg-ui-01 px-4 py-2">
					<SkeletonIcon />
					<SkeletonText width="96px" class="!mb-0" />
				</div>
				{#each skeletonItems as itemIndex (itemIndex)}
					<div class="bg-ui-background px-4">
						<div class="border-b border-ui-01 px-0 py-2">
							<SkeletonText width="80%" class="!mb-1" />
							<SkeletonText width="45%" class="!mb-0" />
						</div>
					</div>
				{/each}
			</div>
		{/each}
	</div>
{:else if searchResults}
	<div class={twMerge(containerClass, className)} style={containerStyle}>
		{#if Object.values(searchResults).some((results) => results?.length > 0)}
			{#if searchResults.politicians}
				<SearchResultGroup heading="นักการเมือง" items={searchResults.politicians}>
					{#snippet icon()}
						<PoliticianIcon class="fill-interactive-01" />
					{/snippet}
				</SearchResultGroup>
			{/if}
			{#if searchResults.votings}
				<SearchResultGroup heading="การลงมติ" items={searchResults.votings}>
					{#snippet icon()}
						<VoteIcon class="fill-interactive-01" />
					{/snippet}
				</SearchResultGroup>
			{/if}
			{#if searchResults.bills}
				<SearchResultGroup heading="การออกกฎหมาย" items={searchResults.bills}>
					{#snippet icon()}
						<LawIcon class="fill-interactive-01" />
					{/snippet}
				</SearchResultGroup>
			{/if}
			{#if searchResults.billProposers}
				<SearchResultGroup heading="ชื่อผู้เสนอร่าง" items={searchResults.billProposers}>
					{#snippet icon()}
						<VoteIcon class="fill-interactive-01" />
					{/snippet}
				</SearchResultGroup>
			{/if}
		{:else}
			<NoResultItemsFound />
		{/if}
	</div>
{/if}
