<script lang="ts">
	import type { SearchResultItem } from '$models/search';
	import ResultItem from './ResultItem.svelte';

	export let heading: string;
	export let items: SearchResultItem[];
</script>

<div>
	<div class="px-4 py-2 flex items-center gap-2 bg-ui-01">
		<slot name="icon" />
		<span class="text-xs">{heading}</span>
	</div>
	{#each items as item}
		<ResultItem {item} />
	{/each}
</div>
