<script lang="ts">
	import { slide } from 'svelte/transition';
	import { enhance } from '$app/forms';
	import SearchIcon from 'carbon-icons-svelte/lib/Search.svelte';
	import CloseIcon from 'carbon-icons-svelte/lib/Close.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let searchActionLink = '';
	export let activeSearch = false;
	let searchButton: HTMLButtonElement;
	let searchInput: HTMLInputElement;
	let searchForm: HTMLFormElement;

	function searchClickHandle() {
		if (!activeSearch) {
			activeSearch = true;
			dispatch('activate');
		}
	}

	function introEndHandler() {
		searchInput.focus();
		searchButton.type = 'submit';
	}

	function closeClickHandle() {
		activeSearch = false;
		searchInput.value = '';
		searchButton.type = 'button';
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
			<form
				id="top-search-input"
				bind:this={searchForm}
				class="flex h-full"
				method="POST"
				action={searchActionLink}
				use:enhance
			>
				<input
					bind:this={searchInput}
					name="navSearch"
					type="text"
					class=" w-52 bg-white/0 outline-none border-0 text-white leading-4"
					placeholder="ค้นหาชื่อบุคคล/ร่างกฎหมาย"
				/>
			</form>
			<button
				class="grid place-content-center bg-white/0 border-0 text-white cursor-pointer w-12 h-12"
				on:click={closeClickHandle}
			>
				<CloseIcon />
			</button>
		</div>
	{/if}
</div>
