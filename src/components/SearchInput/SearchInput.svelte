<script lang="ts">
	import type { SearchIndexes, SearchResults } from '$models/search';
	import { TextInput } from 'carbon-components-svelte';
	import { search } from '$lib/search';

	export let searchIndexes: SearchIndexes;
	export let searchResults: SearchResults | null;
	export let searchValue: string | null = '';
	export let ref: HTMLInputElement | null = null;

	$: if (searchValue?.trim()) {
		searchResults = search(searchValue.trim(), searchIndexes);
	} else {
		searchResults = null;
		searchValue = '';
	}
</script>

<TextInput
	bind:ref
	bind:value={searchValue}
	{...$$restProps}
	on:change
	on:input
	on:keydown
	on:keyup
	on:focus
	on:blur
	on:paste
/>
