<script lang="ts">
	import CloseIcon from 'carbon-icons-svelte/lib/Close.svelte';
	import MenuIcon from 'carbon-icons-svelte/lib/Menu.svelte';
	import { createBubbler } from 'svelte/legacy';

	const bubble = createBubbler();

	interface Props {
		isActive?: boolean;
		onclick?: (e: MouseEvent) => void;
	}

	let { isActive = false, onclick }: Props = $props();
</script>

<button
	class="justify-left flex cursor-pointer items-center border-0 bg-gray-100 p-0 pl-4 lg:hidden"
	onclick={(e) => {
		bubble('click')(e);
		onclick?.(e);
	}}
>
	{#if !isActive}
		<MenuIcon fill="white" size={24} aria-label="Open Menu" />
	{:else}
		<CloseIcon fill="white" size={24} aria-label="Close Menu" />
	{/if}
</button>
