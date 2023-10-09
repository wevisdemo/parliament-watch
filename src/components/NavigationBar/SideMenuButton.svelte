<script lang="ts">
	import MenuIcon from 'carbon-icons-svelte/lib/Menu.svelte';
	import CloseIcon from 'carbon-icons-svelte/lib/Close.svelte';

	export let isActive = false;
</script>

<button
	class="flex items-center justify-left bg-gray-100 border-0 p-0 mr-4 cursor-pointer lg:hidden"
	on:click
>
	{#if !isActive}
		<MenuIcon fill="white" size={24} aria-label="Open Menu" />
	{:else}
		<CloseIcon fill="white" size={24} aria-label="Close Menu" />
	{/if}
</button>
