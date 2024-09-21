<script lang="ts">
	import type { PromiseSummary } from '../../routes/promises/+page.server';
	import { Select, SelectItem } from 'carbon-components-svelte';
	import PromiseCard from './PromiseCard.svelte';
	import Grid from 'carbon-icons-svelte/lib/Grid.svelte';
	import List from 'carbon-icons-svelte/lib/List.svelte';

	export let summaries: PromiseSummary[];
	// export let cappedAt: number | undefined

	let sortBy = 'วันที่เคลื่อนไหวล่าสุด';
	function handleChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		sortBy = target?.value;
		console.log('sortBy', sortBy);
	}

	$: sortedData = Array.from(summaries).sort((a: PromiseSummary, b: PromiseSummary) => {
		if (sortBy === 'วันที่เคลื่อนไหวล่าสุด') {
			return b.latestProgressDate.date.getTime() - a.latestProgressDate.date.getTime();
		}
		if (sortBy === 'ตัวอักษร') {
			return (a.statements[0] ?? '').localeCompare(b.statements[0] ?? '');
		}
		if (sortBy === 'สถานะ') {
			return a.status.localeCompare(b.status);
		}
		return 0;
	});
</script>

<div class="">
	<div class="flex flex-col justify-between gap-1 pb-4 pt-6 md:flex-row md:items-center">
		<p class="fluid-heading-03 font-bold">ผลลัพธ์ {sortedData?.length} คำสัญญา</p>
		<div class="flex items-center gap-[15px]">
			<div class="flex items-center gap-1">
				<p class="body-compact-01 text-text-02">เรียงตาม</p>
				<Select
					class="w-[228px] md:w-[288px]"
					hideLabel
					labelText="Carbon theme"
					on:change={handleChange}
				>
					<SelectItem value="วันที่เคลื่อนไหวล่าสุด" />
					<SelectItem value="ตัวอักษร" />
					<SelectItem value="สถานะ" />
				</Select>
			</div>
			<div class="hidden items-center gap-2 md:flex">
				<button class="h-8 w-8 rounded-[2px] p-1 hover:bg-[#CACACA]"
					><List class="h-6 w-6" /></button
				>
				<button class="h-8 w-8 rounded-[2px] p-1 hover:bg-[#CACACA]"
					><Grid class="h-6 w-6" /></button
				>
			</div>
		</div>
	</div>
	<div class="mx-auto grid w-fit gap-6 md:grid-cols-3">
		{#each sortedData as promiseSummary}
			<PromiseCard {promiseSummary} />
		{/each}
	</div>
</div>
