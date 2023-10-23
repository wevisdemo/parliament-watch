<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	import SearchResult from './SearchResult.svelte';
	import type { SearchResults } from '$models/search';
	export let Hst: Hst;

	const searchResults: SearchResults = {
		politicians: [],
		bills: [],
		votings: []
	};
</script>

<Hst.Story title="SearchResult">
	<SearchResult {searchResults} />
</Hst.Story>
