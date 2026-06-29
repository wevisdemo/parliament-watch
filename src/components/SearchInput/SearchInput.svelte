<script lang="ts">
	import { search } from '$lib/search';
	import { type SearchIndexes, type SearchResults, SearchIndexCategory } from '$models/search';
	import { TextInput } from 'carbon-components-svelte';

	interface Props {
		categories?: SearchIndexCategory[];
		searchResults: SearchResults | null;
		searchValue?: string | null;
		ref?: HTMLInputElement | null;
		// Carbon components are typed as Svelte 4 classes; accept any component constructor
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		as?: any;
		[key: string]: unknown;
	}

	let {
		categories = Object.values(SearchIndexCategory),
		searchResults = $bindable(),
		searchValue = $bindable(''),
		ref = $bindable(null),
		as: AsComponent = TextInput,
		...rest
	}: Props = $props();

	let searchIndexes: SearchIndexes | null = $state(null);

	$effect(() => {
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
</script>

<AsComponent bind:ref bind:value={searchValue} onfocus={fetchIndexes} {...rest} />
