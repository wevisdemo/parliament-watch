<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let categoryName = '';
	export let inProgressCount = 0;
	export let fulfilledCount = 0;
	export let unhonoredCount = 0;
	export let totalCount = 0;
	export let max = 0;

	const dispatch = createEventDispatcher<{ buttonClick: { category: string } }>();

	const handleViewAll = (): void => {
		dispatch('buttonClick', { category: categoryName });
	};
</script>

<div class="flex min-w-[240px] flex-col gap-1">
	<p class="heading-02 text-text-01">{totalCount} {categoryName}</p>
	<div class="flex gap-3">
		<div class="flex items-center gap-1">
			<div class="legend bg-green-50" />
			<p class="label-01">{fulfilledCount}</p>
		</div>
		<div class="flex items-center gap-1">
			<div class="legend bg-yellow-20" />
			<p class="label-01">{inProgressCount}</p>
		</div>
		<div class="flex items-center gap-1">
			<div class="legend bg-magenta-50" />
			<p class="label-01">{unhonoredCount}</p>
		</div>
	</div>
	<div class="flex" style="width:{Math.round((totalCount / max) * 100)}%;">
		<div
			class="h-2 w-full rounded-sm bg-green-50"
			style="width:{Math.round((fulfilledCount / totalCount) * 100)}%;"
		/>
		<div
			class="h-2 w-full rounded-sm bg-yellow-20"
			style="width:{Math.round((inProgressCount / totalCount) * 100)}%;"
		/>
		<div
			class="h-2 w-full rounded-sm bg-magenta-50"
			style="width:{Math.round((unhonoredCount / totalCount) * 100)}%;"
		/>
	</div>
	<div class="py-1">
		<button class="helper-text-01 text-blue-60 underline" on:click={handleViewAll}>ดูทั้งหมด</button
		>
	</div>
</div>

<style lang="postcss">
	.legend {
		@apply h-[12px] w-[4px];
	}
</style>
