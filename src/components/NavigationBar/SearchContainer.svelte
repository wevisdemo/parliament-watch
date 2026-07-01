<script lang="ts">
	import SearchInput from '$components/SearchInput/SearchInput.svelte';
	import SearchResult from '$components/SearchResult/SearchResult.svelte';
	import { SearchIndexCategory, type SearchResults } from '$models/search';
	import CloseIcon from 'carbon-icons-svelte/lib/Close.svelte';
	import SearchIcon from 'carbon-icons-svelte/lib/Search.svelte';
	import { slide } from 'svelte/transition';

	interface Props {
		activeSearch?: boolean;
		searchResults?: SearchResults | null;
		onactivate?: () => void;
		ondeactivate?: () => void;
	}

	let {
		activeSearch = $bindable(false),
		searchResults = $bindable(null),
		onactivate,
		ondeactivate
	}: Props = $props();
	let searchInput: HTMLInputElement | null = $state(null);
	let searchValue = $state('');
	let elContainer: HTMLDivElement | undefined = $state();

	function searchClickHandle() {
		if (!activeSearch) {
			activeSearch = true;
			onactivate?.();
			searchInput?.focus();
		}
	}

	function introEndHandler() {
		searchInput?.focus();
	}

	function closeClickHandle(e: FocusEvent, force = false) {
		if (!elContainer) return;
		if (force || !elContainer.contains(e.relatedTarget as Node)) {
			activeSearch = false;
			searchValue = '';
			searchResults = null;
			ondeactivate?.();
		}
	}
</script>

<div bind:this={elContainer} onfocusout={closeClickHandle} class="absolute right-0" tabindex="-1">
	<div class="flex h-full {activeSearch ? 'bg-gray-90' : ''}">
		<button
			type="button"
			form="top-search-input"
			class="grid h-12 w-12 cursor-pointer place-content-center border-0 bg-white/0 text-white"
			onclick={searchClickHandle}
		>
			<SearchIcon />
		</button>

		{#if activeSearch}
			<div
				class="flex h-full"
				transition:slide={{ axis: 'x', duration: 250 }}
				onintroend={introEndHandler}
			>
				<SearchInput
					bind:ref={searchInput}
					bind:searchResults
					bind:searchValue
					categories={[
						SearchIndexCategory.Politicians,
						SearchIndexCategory.Votings,
						SearchIndexCategory.Bills
					]}
					name="navSearch"
					type="text"
					class="h-12 w-[calc(320px-6rem)] border-0 bg-white/0 p-0 text-white outline-none focus:outline-none"
					placeholder="ค้นหาชื่อบุคคล/มติ/ร่างกฎหมาย"
				/>
				<button
					class="grid h-12 w-12 cursor-pointer place-content-center border-0 bg-white/0 text-white"
					onclick={(e) => closeClickHandle(e, true)}
				>
					<CloseIcon />
				</button>
			</div>
		{/if}
	</div>
	{#if searchResults !== null}
		<SearchResult {searchResults} />
	{/if}
</div>
