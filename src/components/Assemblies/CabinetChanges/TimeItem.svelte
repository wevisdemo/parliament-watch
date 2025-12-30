<script lang="ts">
	import { isSameDate } from '$lib/date-parser';
	import type { TimeLine } from './TimeLine.ts';

	export let day: TimeLine;
	export let selectedDate: Date;
	export let max: number;
	export let handleSelectDate: (date: Date) => void;
	export let align: 'vertical' | 'horizontal' = 'horizontal';

	$: isHorizontal = align === 'horizontal';
</script>

<button
	on:click={() => handleSelectDate(day.date)}
	class="flex items-center border-[0.4px] border-ui-01 bg-ui-02 hover:border-ui-03 hover:bg-ui-03
				{isHorizontal ? 'h-full w-[8px] flex-col' : 'h-[8px]'}
        {isSameDate(day.date, selectedDate) ? 'border-ui-05 bg-ui-03' : ''}"
>
	<div class="flex {isHorizontal ? 'h-1/2 w-full items-end' : 'h-full w-1/2 justify-end'}">
		<div
			class="bg-teal-40 {isHorizontal ? 'w-full' : 'h-full'}"
			style="{isHorizontal ? 'height' : 'width'}: {Math.round((day.in / max) * 100)}%;"
		/>
	</div>
	<div class="bg-black {isHorizontal ? 'h-[2px] w-[8px]' : 'h-[8px] w-[2px]'}" />
	<div class="flex {isHorizontal ? 'h-1/2 w-full items-start' : 'h-full w-1/2'}">
		<div
			class=" bg-red-70 {isHorizontal ? 'w-full' : 'h-full'}"
			style="{isHorizontal ? 'height' : 'width'}: {Math.round((day.out / max) * 100)}%;"
		/>
	</div>
</button>
