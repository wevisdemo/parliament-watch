<script lang="ts">
	import type { SearchResultItem } from '$models/search';
	import ResultItem from './ResultItem.svelte';

	export let heading: string;
	export let items: SearchResultItem[] | undefined;
</script>

<div>
	<div class="px-4 py-2 flex items-center gap-2 bg-ui-01">
		<slot name="icon" />
		<span class="text-xs text-gray-90">{heading}</span>
	</div>
	{#if items}
		{#each items as item}
			<ResultItem {item} />
		{/each}
	{/if}
</div>
