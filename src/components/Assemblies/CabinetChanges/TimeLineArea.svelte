<script lang="ts">
	import type { RoleChange } from '../../../routes/assemblies/[id]/+page.server';
	import SquareIcon from './SquareIcon.svelte';
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

<div class="flex flex-col gap-1 px-[16px] md:px-[64px]">
	<p class="heading-compact-01 text-text-01">เลือกดูช่วงที่มีความเปลี่ยนแปลง</p>
	<div class="flex items-center gap-1">
		<SquareIcon width={10} color="#00B9C4" />
		<p class="mr-1">เข้า</p>
		<SquareIcon width={10} color="#B12000" />
		<p>ออก</p>
	</div>
</div>

<TimeLine data={timeLineData} {selectedDate} on:selectDate={handleSelectDate} />
