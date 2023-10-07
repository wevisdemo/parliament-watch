<script lang="ts">
	import type { Link } from '$models/link';
	import { ArrowUpRight } from 'carbon-icons-svelte';
	import { stringify } from 'postcss';

	export let title: string;
	export let menuItems: Link[];
</script>

<div>
	<div class="flex flex-row items-center font-semibold text-base mb-2">
		<slot name="titleIcon" />
		<span class="ml-3">{title}</span>
	</div>
	<div class="flex flex-col">
		{#each menuItems as menuItem}
			<a href={menuItem.url} class="text-gray-30">
				<div class="flex flex-row items-center">
					<span class="mr-2">{menuItem.label}</span>
					<ArrowUpRight size={16} />
				</div>
			</a>
		{/each}
	</div>
</div>
