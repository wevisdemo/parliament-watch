<script lang="ts">
	import { search } from '$lib/search';
	import { type SearchIndexes, type SearchResults, SearchIndexCategory } from '$models/search';
	import { TextInput } from 'carbon-components-svelte';
	import type { ComponentType } from 'svelte';
	import { run } from 'svelte/legacy';

	interface Props {
		categories?: SearchIndexCategory[];
		searchResults: SearchResults | null;
		searchValue?: string | null;
		ref?: HTMLInputElement | null;
		as?: ComponentType<Record<string, unknown>>;
		[key: string]: unknown;
	}

	let {
		categories = Object.values(SearchIndexCategory),
		searchResults = $bindable(),
		searchValue = $bindable(''),
		ref = $bindable(null),
		as = TextInput,
		...rest
	}: Props = $props();

	let searchIndexes: SearchIndexes | null = $state(null);

	run(() => {
		if (searchIndexes && searchValue?.trim()) {
			searchResults = search(searchValue.trim(), searchIndexes);
		} else {
			searchResults = null;
			searchValue = '';
		}
	});

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

	const SvelteComponent_1 = $derived(as);
</script>

<SvelteComponent_1
	bind:ref
	bind:value={searchValue}
	onfocus={fetchIndexes}
	{...rest}
	onchange
	oninput
	onkeydown
	onkeyup
	onblur
	onpaste
/>
