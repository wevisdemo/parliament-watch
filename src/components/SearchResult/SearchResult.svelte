<script lang="ts">
	import NoResultItemsFound from '$components/SearchResultGroup/NoResultItemsFound.svelte';
	import SearchResultGroup from '$components/SearchResultGroup/SearchResultGroup.svelte';
	import LawIcon from '$components/icons/LawIcon.svelte';
	import PoliticianIcon from '$components/icons/PoliticianIcon.svelte';
	import VoteIcon from '$components/icons/VoteIcon.svelte';
	import type { SearchResults } from '$models/search';

	export let searchResults: SearchResults;
	export let politician = false;
	export let voting = false;
	export let bill = false;
	export let billProposer = false;

	let showAll = !(politician || voting || bill || billProposer);

	let hasAnyResult = false;
	$: hasAnyResult = Object.values(searchResults).some((results) => results.length > 0);
</script>

<div
	class="w-[320px] overflow-y-scroll max-h-[calc(100vh-3rem)]"
	style="box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.30);"
>
	{#if hasAnyResult}
		{#if politician || showAll}
			<SearchResultGroup heading="นักการเมือง" items={searchResults.politicians}>
				<PoliticianIcon slot="icon" class="fill-interactive-01" />
			</SearchResultGroup>
		{/if}
		{#if voting || showAll}
			<SearchResultGroup heading="การลงมติ" items={searchResults.votings}>
				<VoteIcon slot="icon" class="fill-interactive-01" />
			</SearchResultGroup>
		{/if}
		{#if bill || showAll}
			<SearchResultGroup heading="การออกกฎหมาย" items={searchResults.bills}>
				<LawIcon slot="icon" class="fill-interactive-01" />
			</SearchResultGroup>
		{/if}
		{#if billProposer || showAll}
			<SearchResultGroup heading="ชื่อผู้เสนอร่าง" items={searchResults.billProposers}>
				<VoteIcon slot="icon" class="fill-interactive-01" />
			</SearchResultGroup>
		{/if}
	{:else}
		<NoResultItemsFound />
	{/if}
</div>
