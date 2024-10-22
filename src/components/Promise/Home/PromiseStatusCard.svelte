<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { PromiseSample } from '../../../routes/promises/+page.server';
	import type { PromiseStatus } from '$models/promise';

	export let status: PromiseStatus.inProgress | PromiseStatus.fulfilled | PromiseStatus.unhonored;
	export let statusCount: number;
	export let description = '';
	export let max: number;
	export let color: string;
	export let samples: PromiseSample[] = [];
	export let hideSeeAll = false;

	const dispatch = createEventDispatcher<{ buttonClick: { status: string } }>();

	const handleViewAll = (): void => {
		dispatch('buttonClick', { status });
	};
</script>

<div class="flex flex-col">
	<div class="flex items-center gap-1">
		<span class="fluid-heading-04">{statusCount}</span>
		<span class="heading-02">{status}</span>
	</div>
	<div
		class="h-4 w-full rounded-sm {color}"
		style="width:{Math.round((statusCount / max) * 100)}%;"
	/>
	<p class="body-01 py-1 pt-2">{description}</p>
	{#if statusCount}
		<div class="flex flex-col gap-1 py-1">
			<p class="body-01 text-text-02">เช่น</p>
			<ul class="list-disc space-y-2 pl-6">
				{#each samples as s}
					<li>
						<a href="/promises/{s.id}" class="body-01 line-clamp-2 text-text-02 underline">
							{s.statements}
						</a>
					</li>
				{/each}
			</ul>
			{#if !hideSeeAll}
				<div class="py-1">
					<button class="link-01 text-blue-60 underline" on:click={handleViewAll}>ดูทั้งหมด</button>
				</div>
			{/if}
		</div>
	{/if}
</div>
