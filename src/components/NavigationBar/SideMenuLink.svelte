<script lang="ts">
	import type { Menu } from '$models/menu';
	import ArrowUpRightIcon from 'carbon-icons-svelte/lib/ArrowUpRight.svelte';
	import { twMerge } from 'tailwind-merge';
	import { getContext } from 'svelte';
	const closeSideNav: () => void = getContext('closeSideNav');

	export let linkMenu: Menu;
	export let additionalClass = '';
</script>

{#if linkMenu.type === 'link'}
	<div class="w-screen pr-2 md:w-80">
		<hr class=" z-40 m-0 ml-auto w-11/12 border-0 border-b border-gray-30/20 p-0" />
	</div>
{/if}
<a
	on:click={() => closeSideNav()}
	href={linkMenu.url}
	class={twMerge(
		'flex w-screen items-center pl-4 text-gray-30 no-underline decoration-gray-30 transition-all duration-200 hover:text-gray-10 md:w-80',
		additionalClass
	)}
>
	<div class="flex w-4">
		<svelte:component this={linkMenu.icon} class="text-inverse-link" />
	</div>
	<p class="whitespace-nowrap p-3">{linkMenu.label}</p>
	<div class="ml-auto mr-4 flex">
		<ArrowUpRightIcon />
	</div>
</a>
