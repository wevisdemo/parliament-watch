<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	import SearchResult from './SearchResult.svelte';
	export let Hst: Hst;
</script>

<Hst.Story title="SearchResult">
	<SearchResult />
</Hst.Story>
