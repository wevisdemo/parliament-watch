<script lang="ts">
	import type { Menu } from '$models/menu';
	import ArrowUpRightIcon from 'carbon-icons-svelte/lib/ArrowUpRight.svelte';
	export let linkMenu: Menu;
	export let additionalClass = '';
</script>

{#if linkMenu.type === 'link'}
	<div class="w-screen md:w-80 pr-2">
		<hr class=" border-0 border-b p-0 m-0 border-gray-30/20 z-40 w-11/12 ml-auto" />
	</div>
{/if}
<a
	href="/"
	class="flex items-center w-screen md:w-80 pl-4 text-gray-30 hover:text-gray-10 decoration-gray-30 no-underline transition-all duration-200 {additionalClass}"
>
	<div class="flex w-4">
		<svelte:component this={linkMenu.icon} class="text-inverse-link" />
	</div>
	<p class="p-3 whitespace-nowrap">{linkMenu.label}</p>
	<div class="flex ml-auto mr-4">
		<ArrowUpRightIcon />
	</div>
</a>
