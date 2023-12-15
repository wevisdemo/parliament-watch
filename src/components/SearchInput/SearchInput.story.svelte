<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	import SearchInput from './SearchInput.svelte';
	import { SearchIndexCategory, type SearchResults } from '$models/search';
	import { Button } from 'carbon-components-svelte';
	import SearchResult from '$components/SearchResult/SearchResult.svelte';

	export let Hst: Hst;

	let searchResults: SearchResults | null;
	let fewerIndexesSearchResults: SearchResults | null;
	let clearSampleSearchResults: SearchResults | null;

	let clearSampleSearchValue = '';
</script>

<Hst.Story title="SearchInput" layout={{ type: 'grid', width: 350 }}>
	<Hst.Variant title="Default">
		<SearchInput bind:searchResults />
		{#if searchResults}
			<SearchResult {searchResults} />
		{/if}
	</Hst.Variant>
	<Hst.Variant title="Fewer Indexes">
		<SearchInput
			bind:searchResults={fewerIndexesSearchResults}
			categories={[SearchIndexCategory.Politicians]}
		/>
		<SearchResult searchResults={fewerIndexesSearchResults} />
	</Hst.Variant>
	<Hst.Variant title="With sample clear button">
		<SearchInput
			bind:searchValue={clearSampleSearchValue}
			bind:searchResults={clearSampleSearchResults}
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
