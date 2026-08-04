<script lang="ts">
	import { createDebouncedSync } from '$lib/query-state/sync';
	import { search } from '$lib/search';
	import { type SearchIndexes, type SearchResults, SearchIndexCategory } from '$models/search';
	import { TextInput } from 'carbon-components-svelte';

	const SEARCH_DEBOUNCE_MS = 200;

	interface Props {
		categories?: SearchIndexCategory[];
		searchResults: SearchResults | null;
		isLoading?: boolean;
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
		isLoading = $bindable(false),
		searchValue = $bindable(''),
		ref = $bindable(null),
		as: AsComponent = TextInput,
		...rest
	}: Props = $props();

	let searchIndexes: SearchIndexes | null = $state(null);
	let isFetchingIndexes = $state(false);

	let debouncedSearchValue = $state('');
	let pendingSearchValue = '';
	const debouncedSearchSync = createDebouncedSync(() => {
		debouncedSearchValue = pendingSearchValue;
	}, SEARCH_DEBOUNCE_MS);

	$effect(() => {
		const trimmedSearchValue = searchValue?.trim() ?? '';

		if (!trimmedSearchValue) {
			debouncedSearchSync.cancel();
			debouncedSearchValue = '';
			searchValue = '';
			return;
		}

		pendingSearchValue = trimmedSearchValue;
		debouncedSearchSync.schedule();
		return debouncedSearchSync.cancel;
	});

	$effect(() => {
		searchResults =
			searchIndexes && debouncedSearchValue ? search(debouncedSearchValue, searchIndexes) : null;
	});

	$effect(() => {
		isLoading = isFetchingIndexes && !!searchValue?.trim();
	});

	async function fetchIndexes() {
		if (searchIndexes || isFetchingIndexes) return;

		isFetchingIndexes = true;
		try {
			searchIndexes = Object.fromEntries(
				await Promise.all(
					categories.map(async (category) => {
						const res = await fetch(`/files/search-indexes/${category}.json`);
						if (!res.ok) throw new Error(`Failed to load search index ${category}: ${res.status}`);
						return [category, (await res.json()) as SearchResults[SearchIndexCategory]];
					})
				)
			);
		} catch (e) {
			console.error(e);
		} finally {
			isFetchingIndexes = false;
		}
	}
</script>

<AsComponent bind:ref bind:value={searchValue} onfocus={fetchIndexes} {...rest} />
