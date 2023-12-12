<script lang="ts">
	import { slide } from 'svelte/transition';
	import SearchIcon from 'carbon-icons-svelte/lib/Search.svelte';
	import CloseIcon from 'carbon-icons-svelte/lib/Close.svelte';
	import { createEventDispatcher } from 'svelte';
	import type { SearchResults } from '$models/search';
	import { searchIndexes } from '../../mocks/data/searchIndexes';
	import SearchInput from '$components/SearchInput/SearchInput.svelte';

	const { politicians, votings, bills } = searchIndexes;

	const dispatch = createEventDispatcher<{
		activate: void;
		deactivate: void;
	}>();

	export let activeSearch = false;
	export let searchResults: SearchResults | null;
	let searchButton: HTMLButtonElement;
	let searchInput: HTMLInputElement;
	let searchValue = '';

	function searchClickHandle() {
		if (!activeSearch) {
			activeSearch = true;
			dispatch('activate');
			searchInput.focus();
		}
	}

	function introEndHandler() {
		searchInput.focus();
	}

	function closeClickHandle() {
		activeSearch = false;
		searchValue = '';
		searchResults = null;
		dispatch('deactivate');
	}
</script>

<div class="flex h-full {activeSearch ? 'bg-gray-90' : ''}">
	<button
		bind:this={searchButton}
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
				searchIndexes={{ politicians, votings, bills }}
				bind:ref={searchInput}
				bind:searchResults
				bind:searchValue
				on:blur={() => {
					closeClickHandle();
				}}
				name="navSearch"
				type="text"
				class="w-[calc(320px-6rem)] h-12 p-0 bg-white/0 outline-none border-0 text-white focus:outline-none"
				placeholder="ค้นหาชื่อบุคคล/มติ/ร่างกฎหมาย"
			/>
			<button
				class="grid place-content-center bg-white/0 border-0 text-white cursor-pointer w-12 h-12"
				on:click={closeClickHandle}
			>
				<CloseIcon />
			</button>
		</div>
	{/if}
</div>
