<script lang="ts">
	import { type SearchIndexes, type SearchResults, SearchIndexCategory } from '$models/search';
	import { TextInput } from 'carbon-components-svelte';
	import { search } from '$lib/search';
	import type { ComponentType, SvelteComponent } from 'svelte';

	export let categories: SearchIndexCategory[] = Object.values(SearchIndexCategory);
	export let searchResults: SearchResults | null;
	export let searchValue: string | null = '';
	export let ref: HTMLInputElement | null = null;
	export let as: ComponentType<SvelteComponent> = TextInput;

	let searchIndexes: SearchIndexes | null = null;

	$: if (searchIndexes && searchValue?.trim()) {
		searchResults = search(searchValue.trim(), searchIndexes);
	} else {
		searchResults = null;
		searchValue = '';
	}

	async function fetchIndexes() {
		if (!searchIndexes) {
			searchIndexes = await Object.fromEntries(
				await Promise.all(
					categories.map(async (category) => [
						category,
						(await (
							await fetch(`/files/search-indexes/${category}.json`)
						).json()) as SearchResults[SearchIndexCategory]
					])
				)
			);
		}
	}
</script>

<svelte:component
	this={as}
	bind:ref
	bind:value={searchValue}
	on:focus={fetchIndexes}
	{...$$restProps}
	on:change
	on:input
	on:keydown
	on:keyup
	on:blur
	on:paste
/>
