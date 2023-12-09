<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	import SearchInput from './SearchInput.svelte';
	import type { SearchResults, SearchIndexes } from '$models/search';
	import { searchIndexes } from '../../mocks/data/searchIndexes';
	import SearchResult from '$components/SearchResult/SearchResult.svelte';
	export let Hst: Hst;

	let searchResults: SearchResults | null;
</script>

<Hst.Story title="SearchInput">
	<SearchInput bind:searchResults {searchIndexes} />
	{#if searchResults}
		<SearchResult {searchResults} />
	{/if}
</Hst.Story>
