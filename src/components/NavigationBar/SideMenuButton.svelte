<script lang="ts">
	import MenuIcon from 'carbon-icons-svelte/lib/Menu.svelte';
	import CloseIcon from 'carbon-icons-svelte/lib/Close.svelte';

	export let isActive = false;
</script>

<button
	class="justify-left flex cursor-pointer items-center border-0 bg-gray-100 p-0 pl-4 lg:hidden"
	on:click
>
	{#if !isActive}
		<MenuIcon fill="white" size={24} aria-label="Open Menu" />
	{:else}
		<CloseIcon fill="white" size={24} aria-label="Close Menu" />
	{/if}
</button>
