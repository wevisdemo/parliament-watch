<script lang="ts">
	import Tooltip from '../Tooltip.svelte';
	import SquareIcon from './SquareIcon.svelte';
	import { compareDate, formatThaiDate } from './TimeLine';
	import type { TimeLine } from './TimeLine.ts';

	export let day: TimeLine;
	export let selectedDate: Date;
	export let max: number;
	export let handleSelectDate: (date: Date) => void;
</script>

<Tooltip
	direction="top"
	showAllTime={compareDate(day.date, selectedDate)}
	open={compareDate(day.date, selectedDate)}
	style={compareDate(day.date, selectedDate) ? '' : 'background-color: white;'}
>
	<button
		on:click={() => handleSelectDate(day.date)}
		class="flex h-full w-[8px] flex-col items-center border-[0.4px] border-ui-01 bg-ui-02 hover:border-ui-03 hover:bg-ui-03
                    {compareDate(day.date, selectedDate) ? 'border-ui-05 bg-ui-03' : ''}"
	>
		<div class="flex h-1/2 w-full items-end">
			<div class="w-full bg-teal-40" style="height: {(day.in / max) * 100}%;"></div>
		</div>
		<div class=" h-[2px] w-[8px] bg-black" />
		<div class="flex h-1/2 w-full items-start">
			<div class="w-full bg-red-70" style="height: {(day.out / max) * 100}%;"></div>
		</div>
	</button>
	<div slot="tooltip" class="flex flex-col items-start justify-center">
		{#if compareDate(day.date, selectedDate)}
			<div class="text-text-03">
				{formatThaiDate(day.date)}
			</div>
			{#if !day.in && !day.out}
				<div class="flex items-center gap-1 text-text-04">ไม่มีการปรับ</div>
			{/if}
			{#if day.in}
				<div class="flex items-center gap-1 text-text-04">
					<SquareIcon color="#00B9C4" />
					<span>เข้า</span>
					&nbsp; {day.in} ตำแหน่ง
				</div>
			{/if}
			{#if day.out}
				<span class="flex items-center gap-1 text-text-04">
					<SquareIcon color="#C72502" />
					ออก {day.out} ตำแหน่ง</span
				>
			{/if}
		{:else}
			<div class="text-black">
				{formatThaiDate(day.date)}
			</div>
			{#if day.in}
				<div class="text-text-02">
					<span class="text-teal-60">เข้า</span>
					&nbsp; {day.in} ตำแหน่ง
				</div>
			{/if}
			{#if day.out}
				<span class="text-text-02"
					><span class="text-support-01"> ออก </span>
					{day.out} ตำแหน่ง</span
				>
			{/if}
		{/if}
	</div>
</Tooltip>
