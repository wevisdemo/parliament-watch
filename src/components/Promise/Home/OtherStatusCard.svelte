<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { PromiseSample } from '../../../routes/promises/+page.server';

	export let title: string;
	export let status: string;
	export let description: string;
	export let statusCount: number;
	export let samples: PromiseSample[] = [];

	const dispatch = createEventDispatcher<{ buttonClick: { status: string } }>();

	const handleViewAll = (): void => {
		dispatch('buttonClick', { status });
	};
</script>

<div class="flex w-full flex-col gap-2 bg-gray-10 p-6">
	<p class="heading-01">{statusCount} {title}</p>
	<p class="body-01">
		{description}
	</p>
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
	<div class="py-1">
		<button class="helper-text-01 text-blue-60 underline" on:click={handleViewAll}>ดูทั้งหมด</button
		>
	</div>
</div>
