<script lang="ts">
	import { Select, SelectItem } from 'carbon-components-svelte';
	import PromiseCard from './PromiseCard.svelte';
	import Grid from 'carbon-icons-svelte/lib/Grid.svelte';
	import List from 'carbon-icons-svelte/lib/List.svelte';
	import type { ComponentProps } from 'svelte';

	export let summaries: ComponentProps<PromiseCard>['promiseSummary'][];

	type SortByOptions = 'วันที่เคลื่อนไหวล่าสุด' | 'ตัวอักษร' | 'สถานะ';
	let sortBy: SortByOptions = 'วันที่เคลื่อนไหวล่าสุด';

	function handleChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		const value = target?.value as SortByOptions;
		if (
			Object.values<SortByOptions>(['วันที่เคลื่อนไหวล่าสุด', 'ตัวอักษร', 'สถานะ']).includes(value)
		) {
			sortBy = value;
		}
	}

	$: sortedData = (() => {
		const data = Array.from(summaries);
		switch (sortBy) {
			case 'วันที่เคลื่อนไหวล่าสุด':
				return data.sort(
					(a, b) => (b.latestProgressDate?.getTime() || 0) - (a.latestProgressDate?.getTime() || 0)
				);
			case 'ตัวอักษร':
				return data.sort((a, b) => (a.statements[0] ?? '').localeCompare(b.statements[0] ?? ''));
			case 'สถานะ':
				return data.sort((a, b) => a.status.localeCompare(b.status));
			default:
				return data;
		}
	})();

	let isList = false;

	const handleChangeView = (label: string) => {
		if (label === 'List') {
			isList = true;
		} else if (label === 'Grid') {
			isList = false;
		}
	};
</script>

<div class="mx-auto max-w-[1280px] px-4 py-6 md:px-16">
	<div class="flex flex-col justify-between gap-1 pb-4 md:flex-row md:items-center">
		<p class="fluid-heading-03 font-bold">ผลลัพธ์ {sortedData.length} คำสัญญา</p>
		<div class="flex items-center gap-[16px]">
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
				{#each [{ icon: List, label: 'List' }, { icon: Grid, label: 'Grid' }] as { icon, label } (label)}
					<button
						class="h-8 w-8 rounded-[2px] p-1 duration-200 hover:bg-[#CACACA]
						{(isList && label === 'List') || (!isList && label === 'Grid') ? 'bg-[#CACACA]' : 'bg-none'}"
						on:click={() => handleChangeView(label)}
					>
						<svelte:component this={icon} class="h-6 w-6" />
					</button>
				{/each}
			</div>
		</div>
	</div>
	{#if isList}
		<div class="body-01 grid grid-cols-7 gap-2 px-5 pb-2 text-text-02">
			<p class="col-span-3">พรรค</p>
			<p class="">คีย์เวิร์ด</p>
			<p>หมวด</p>
			<p>สถานะ</p>
			<p>เคลื่อนไหวล่าสุด</p>
		</div>
	{/if}
	<div class="{isList ? 'flex flex-col gap-[2px]' : 'grid gap-6 md:grid-cols-3'} mx-auto w-fit">
		{#each sortedData as promiseSummary, index (index)}
			<PromiseCard {promiseSummary} {isList} />
		{/each}
	</div>
</div>
