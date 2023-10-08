<script lang="ts">
	import type { Link } from '$models/link';
	import { ArrowUpRight } from 'carbon-icons-svelte';

	export let title: string;
	export let url: string | undefined = undefined;
	export let menuItems: Link[] = [];
</script>

<div>
	{#if url}
		<a href={url} class="text-gray-30 hover:text-white no-underline">
			<div class="flex flex-row items-center font-semibold text-base mb-2">
				<slot name="titleIcon" />
				<span class="ml-3 mr-2">{title}</span>
				<ArrowUpRight size={16} />
			</div>
		</a>
	{:else}
		<div class="flex flex-row items-center font-semibold text-base mb-2">
			<slot name="titleIcon" />
			<span class="ml-3">{title}</span>
		</div>
	{/if}
	<div class="flex flex-col">
		{#each menuItems as menuItem}
			<a href={menuItem.url} class="text-gray-30 hover:text-white no-underline">
				<div class="flex flex-row items-center">
					<span class="mr-2">{menuItem.label}</span>
					<ArrowUpRight size={16} />
				</div>
			</a>
		{/each}
	</div>
</div>
