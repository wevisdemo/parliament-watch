<script lang="ts">
	import type { Menu } from '$models/menu';
	import ArrowUpRight from 'carbon-icons-svelte/lib/ArrowUpRight.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		url?: string | undefined;
		menuItems?: Menu[];
		titleIcon?: Snippet;
	}

	let { title, url = undefined, menuItems = [], titleIcon }: Props = $props();
</script>

<div>
	{#if url}
		<a href={url} class="text-gray-30 no-underline hover:text-gray-10">
			<div class="mb-2 flex flex-row items-center text-base font-semibold">
				{@render titleIcon?.()}
				<span class="ml-3 mr-2">{title}</span>
				<ArrowUpRight size={16} />
			</div>
		</a>
	{:else}
		<div class="mb-2 flex flex-row items-center text-base font-semibold">
			{@render titleIcon?.()}
			<span class="ml-3">{title}</span>
		</div>
	{/if}
	<div class="flex flex-col">
		{#each menuItems as menuItem (menuItem.label)}
			<a href={menuItem.url} class="text-gray-30 no-underline hover:text-gray-10">
				<div class="flex h-6 w-min flex-row items-center">
					<span class="mr-2 whitespace-nowrap">{menuItem.label}</span>
					<ArrowUpRight size={16} />
				</div>
			</a>
		{/each}
	</div>
</div>
