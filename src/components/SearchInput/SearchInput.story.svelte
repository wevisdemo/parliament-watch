<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	import SearchInput from './SearchInput.svelte';
	import type { SearchIndexes, SearchResults } from '$models/search';
	import { searchIndexes } from '../../mocks/data/searchIndexes';
	import { Button, CodeSnippet } from 'carbon-components-svelte';
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
			<CodeSnippet type="multi" code={JSON.stringify(searchResults, null, 2)} />
		{/if}
	</Hst.Variant>
	<Hst.Variant title="Fewer Indexes">
		<SearchInput bind:searchResults={fewerIndexesSearchResults} searchIndexes={fewerIndexes} />
		{#if fewerIndexesSearchResults}
			<CodeSnippet type="multi" code={JSON.stringify(fewerIndexesSearchResults, null, 2)} />
		{/if}
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
			<CodeSnippet type="multi" code={JSON.stringify(clearSampleSearchResults, null, 2)} />
		{/if}
	</Hst.Variant>
</Hst.Story>
