<script lang="ts">
	import SquareIcon from './SquareIcon.svelte';
	import { compareDate, formatThaiDate, type TimeLine } from './TimeLine';

	export let day: TimeLine;
	export let selectedDate: Date;
</script>

<div class="label-01 flex flex-col items-start justify-center">
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
