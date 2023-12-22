<script lang="ts">
	import SearchInput from '$components/SearchInput/SearchInput.svelte';
	import SearchResult from '$components/SearchResult/SearchResult.svelte';
	import { SearchIndexCategory, type SearchResults } from '$models/search';
	import CloseIcon from 'carbon-icons-svelte/lib/Close.svelte';
	import SearchIcon from 'carbon-icons-svelte/lib/Search.svelte';
	import { createEventDispatcher } from 'svelte';
	import { slide } from 'svelte/transition';

	const dispatch = createEventDispatcher<{
		activate: void;
		deactivate: void;
	}>();

	export let activeSearch = false;
	export let searchResults: SearchResults | null = null;
	let searchInput: HTMLInputElement;
	let searchValue = '';
	let elContainer: HTMLDivElement;

	function searchClickHandle() {
		if (!activeSearch) {
			activeSearch = true;
			dispatch('activate');
			searchInput?.focus();
		}
	}

	function introEndHandler() {
		searchInput?.focus();
	}

	function closeClickHandle(e: FocusEvent, force = false) {
		if (force || !elContainer.contains(e.relatedTarget as Node)) {
			activeSearch = false;
			searchValue = '';
			searchResults = null;
			dispatch('deactivate');
		}
	}
</script>

<div bind:this={elContainer} on:focusout={closeClickHandle} class="absolute right-0" tabindex="-1">
	<div class="flex h-full {activeSearch ? 'bg-gray-90' : ''}">
		<button
			type="button"
			form="top-search-input"
			class="grid place-content-center bg-white/0 border-0 text-white cursor-pointer w-12 h-12"
			on:click={searchClickHandle}
		>
			<SearchIcon />
		</button>

		{#if activeSearch}
			<div
				class="flex h-full"
				transition:slide={{ axis: 'x', duration: 250 }}
				on:introend={introEndHandler}
			>
				<SearchInput
					bind:ref={searchInput}
					bind:searchResults
					bind:searchValue
					categories={[
						SearchIndexCategory.Politicians
						// SearchIndexCategory.Votings,
						// SearchIndexCategory.Bills
					]}
					name="navSearch"
					type="text"
					class="w-[calc(320px-6rem)] h-12 p-0 bg-white/0 outline-none border-0 text-white focus:outline-none"
					placeholder="ค้นหาชื่อบุคคล/มติ/ร่างกฎหมาย"
				/>
				<button
					class="grid place-content-center bg-white/0 border-0 text-white cursor-pointer w-12 h-12"
					on:click={(e) => closeClickHandle(e, true)}
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
