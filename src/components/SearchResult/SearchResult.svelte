<script lang="ts">
	import NoResultItemsFound from '$components/SearchResultGroup/NoResultItemsFound.svelte';
	import SearchResultGroup from '$components/SearchResultGroup/SearchResultGroup.svelte';
	import LawIcon from '$components/icons/LawIcon.svelte';
	import PoliticianIcon from '$components/icons/PoliticianIcon.svelte';
	import PromiseIcon from '$components/icons/PromiseIcon.svelte';
	import VoteIcon from '$components/icons/VoteIcon.svelte';
	import type { SearchResults } from '$models/search';
	import { twMerge } from 'tailwind-merge';

	let className = '';
	export { className as class };

	export let searchResults: SearchResults | null = null;
</script>

{#if searchResults}
	<div
		class={twMerge('max-h-[calc(100vh-3rem)] w-[320px] overflow-y-scroll', className)}
		style="box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.30);"
	>
		{#if Object.values(searchResults).some((results) => results?.length > 0)}
			{#if searchResults.politicians}
				<SearchResultGroup heading="นักการเมือง" items={searchResults.politicians}>
					<PoliticianIcon slot="icon" class="fill-interactive-01" />
				</SearchResultGroup>
			{/if}
			{#if searchResults.votings}
				<SearchResultGroup heading="การลงมติ" items={searchResults.votings}>
					<VoteIcon slot="icon" class="fill-interactive-01" />
				</SearchResultGroup>
			{/if}
			{#if searchResults.bills}
				<SearchResultGroup heading="การออกกฎหมาย" items={searchResults.bills}>
					<LawIcon slot="icon" class="fill-interactive-01" />
				</SearchResultGroup>
			{/if}
			{#if searchResults.billProposers}
				<SearchResultGroup heading="ชื่อผู้เสนอร่าง" items={searchResults.billProposers}>
					<VoteIcon slot="icon" class="fill-interactive-01" />
				</SearchResultGroup>
			{/if}
			{#if searchResults.promises}
				<SearchResultGroup heading="คำสัญญา" items={searchResults.promises}>
					<PromiseIcon slot="icon" class="fill-interactive-01" />
				</SearchResultGroup>
			{/if}
		{:else}
			<NoResultItemsFound />
		{/if}
	</div>
{/if}
