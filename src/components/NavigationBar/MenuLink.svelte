<script lang="ts">
	import type { Menu } from '$models/menu';
	import { twMerge } from 'tailwind-merge';
	export let linkMenu: Menu;
	export let additionalClass = '';

	$: hoverClass = linkMenu.type === 'both' ? 'hover:bg-gray-90' : 'hover:bg-gray-80';
</script>

<a
	href={linkMenu.url}
	class={twMerge(
		'flex items-center px-4 text-gray-30 hover:text-gray-10',
		hoverClass,
		'no-underline decoration-gray-30 transition-all duration-200',
		additionalClass
	)}
>
	{#if linkMenu.icon}
		<div class="flex w-4">
			<svelte:component this={linkMenu.icon} class="text-inverse-link" />
		</div>
	{/if}
	<p class="whitespace-nowrap p-3">{linkMenu.label}</p>
</a>
