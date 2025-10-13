<script lang="ts">
	import type { SearchResultItem } from '$models/search';
	import ResultItem from './ResultItem.svelte';

	export let heading: string;
	export let items: SearchResultItem[] | undefined;
</script>

<div>
	<div class="flex items-center gap-2 bg-ui-01 px-4 py-2">
		<slot name="icon" />
		<span class="text-xs text-gray-90">{heading}</span>
	</div>
	{#if items}
		{#each items as item, index (index)}
			<ResultItem {item} />
		{/each}
	{/if}
</div>
