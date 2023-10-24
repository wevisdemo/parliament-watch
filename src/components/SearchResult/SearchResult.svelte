<script lang="ts">
	import NoResultItemsFound from '$components/SearchResultGroup/NoResultItemsFound.svelte';
	import SearchResultGroup from '$components/SearchResultGroup/SearchResultGroup.svelte';
	import LawIcon from '$components/icons/LawIcon.svelte';
	import PoliticianIcon from '$components/icons/PoliticianIcon.svelte';
	import VoteIcon from '$components/icons/VoteIcon.svelte';
	import type { SearchResults } from '$models/search';

	export let searchResults: SearchResults;
	let hasAnyResult = false;
	$: hasAnyResult = Object.values(searchResults).some((results) => results.length > 0);
</script>

<div class="w-[320px] overflow-y-scroll max-h-[calc(100vh-3rem)]">
	{#if hasAnyResult}
		<SearchResultGroup heading="นักการเมือง" items={searchResults.politicians}>
			<PoliticianIcon slot="icon" class="fill-interactive-01" />
		</SearchResultGroup>
		<SearchResultGroup heading="การออกกฎหมาย" items={searchResults.bills}>
			<LawIcon slot="icon" class="fill-interactive-01" />
		</SearchResultGroup>
		<SearchResultGroup heading="การลงมติ" items={searchResults.votings}>
			<VoteIcon slot="icon" class="fill-interactive-01" />
		</SearchResultGroup>
	{:else}
		<NoResultItemsFound />
	{/if}
</div>
