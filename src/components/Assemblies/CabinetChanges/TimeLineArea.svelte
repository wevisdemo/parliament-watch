<script lang="ts">
	import type { RoleChange } from '../../../routes/assemblies/[id]/+page.server';
	import SquareIcon from './squareIcon.svelte';
	import TimeLine from './TimeLine.svelte';
	import { group } from 'd3';

	export let changes: RoleChange[];
	export let selectedDate: Date;
	export let handleSelectDate: (event: CustomEvent<{ value: Date }>) => void;

	$: groupChangeData = group(changes, (d) => d?.date.toISOString());
	$: timeLineData = Array.from(groupChangeData, ([date, value]) => ({
		date: new Date(date),
		in: value.filter((d) => d.type === 'in').length,
		out: value.filter((d) => d.type === 'out').length
	}));
</script>

<div class="flex flex-col gap-1 pb-8">
	<p class="heading-compact-01 text-text-01">เลือกดูช่วงที่มีความเปลี่ยนแปลง</p>
	<div class="flex items-center gap-1">
		<SquareIcon width={10} color="#00B9C4" />
		<p class="mr-1">เข้า</p>
		<SquareIcon width={10} color="#B12000" />
		<p>ออก</p>
	</div>
	<div class="no-scrollbar flex items-end overflow-x-scroll pb-10 pt-20">
		<TimeLine data={timeLineData} {selectedDate} on:selectDate={handleSelectDate} />
	</div>
</div>

<style>
	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}
	.no-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>
