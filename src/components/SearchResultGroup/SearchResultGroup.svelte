<script lang="ts">
	import type { SearchResultItem } from '$models/search';
	import ResultItem from './ResultItem.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		heading: string;
		items: SearchResultItem[] | undefined;
		icon?: Snippet;
	}

	let { heading, items, icon }: Props = $props();
</script>

<div>
	<div class="flex items-center gap-2 bg-ui-01 px-4 py-2">
		{@render icon?.()}
		<span class="text-xs text-gray-90">{heading}</span>
	</div>
	{#if items}
		{#each items as item, index (index)}
			<ResultItem {item} />
		{/each}
	{/if}
</div>
