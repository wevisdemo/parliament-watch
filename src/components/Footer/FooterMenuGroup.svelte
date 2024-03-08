<script lang="ts">
	import type { Menu } from '$models/menu';
	import { ArrowUpRight } from 'carbon-icons-svelte';

	export let title: string;
	export let url: string | undefined = undefined;
	export let menuItems: Menu[] = [];
</script>

<div>
	{#if url}
		<a href={url} class="text-gray-30 no-underline hover:text-gray-10">
			<div class="mb-2 flex flex-row items-center text-base font-semibold">
				<slot name="titleIcon" />
				<span class="ml-3 mr-2">{title}</span>
				<ArrowUpRight size={16} />
			</div>
		</a>
	{:else}
		<div class="mb-2 flex flex-row items-center text-base font-semibold">
			<slot name="titleIcon" />
			<span class="ml-3">{title}</span>
		</div>
	{/if}
	<div class="flex flex-col">
		{#each menuItems as menuItem}
			<a href={menuItem.url} class="text-gray-30 no-underline hover:text-gray-10">
				<div class="flex h-6 w-min flex-row items-center">
					<span class="mr-2 whitespace-nowrap">{menuItem.label}</span>
					<ArrowUpRight size={16} />
				</div>
			</a>
		{/each}
	</div>
</div>
