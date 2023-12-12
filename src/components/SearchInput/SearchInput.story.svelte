<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	import SearchInput from './SearchInput.svelte';
	import type { SearchIndexes, SearchResults } from '$models/search';
	import { searchIndexes } from '../../mocks/data/searchIndexes';
	import { Button } from 'carbon-components-svelte';
	import SearchResult from '$components/SearchResult/SearchResult.svelte';

	export let Hst: Hst;

	let searchResults: SearchResults | null;
	let fewerIndexesSearchResults: SearchResults | null;
	let clearSampleSearchResults: SearchResults | null;

	const fewerIndexes: SearchIndexes = { bills: searchIndexes.bills };

	let clearSampleSearchValue = '';
</script>

<Hst.Story title="SearchInput" layout={{ type: 'grid', width: 350 }}>
	<Hst.Variant title="Default">
		<SearchInput bind:searchResults {searchIndexes} />
		{#if searchResults}
			<SearchResult {searchResults} />
		{/if}
	</Hst.Variant>
	<Hst.Variant title="Fewer Indexes">
		<SearchInput bind:searchResults={fewerIndexesSearchResults} searchIndexes={fewerIndexes} />
		<SearchResult searchResults={fewerIndexesSearchResults} />
	</Hst.Variant>
	<Hst.Variant title="With sample clear button">
		<SearchInput
			bind:searchValue={clearSampleSearchValue}
			bind:searchResults={clearSampleSearchResults}
			{searchIndexes}
		/>
		<Button
			on:click={() => {
				clearSampleSearchValue = '';
			}}>Clear</Button
		>
		{#if clearSampleSearchResults}
			<SearchResult searchResults={clearSampleSearchResults} />
		{/if}
	</Hst.Variant>
</Hst.Story>
