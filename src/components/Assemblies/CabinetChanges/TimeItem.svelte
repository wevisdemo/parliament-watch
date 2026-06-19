<script lang="ts">
	import { isSameDate } from '$lib/date';
	import type { TimeLine } from './TimeLine.ts';

	interface Props {
		day: TimeLine;
		selectedDate: Date;
		max: number;
		handleSelectDate: (date: Date) => void;
		align?: 'vertical' | 'horizontal';
	}

	let { day, selectedDate, max, handleSelectDate, align = 'horizontal' }: Props = $props();

	let isHorizontal = $derived(align === 'horizontal');
</script>

<button
	onclick={() => handleSelectDate(day.date)}
	aria-label="select date"
	class="flex items-center border-[0.4px] border-ui-01 bg-ui-02 hover:border-ui-03 hover:bg-ui-03
				{isHorizontal ? 'h-full w-[8px] flex-col' : 'h-[8px]'}
        {isSameDate(day.date, selectedDate) ? 'border-ui-05 bg-ui-03' : ''}"
>
	<div class="flex {isHorizontal ? 'h-1/2 w-full items-end' : 'h-full w-1/2 justify-end'}">
		<div
			class="bg-teal-40 {isHorizontal ? 'w-full' : 'h-full'}"
			style="{isHorizontal ? 'height' : 'width'}: {Math.round((day.in / max) * 100)}%;"
		></div>
	</div>
	<div class="bg-black {isHorizontal ? 'h-[2px] w-[8px]' : 'h-[8px] w-[2px]'}"></div>
	<div class="flex {isHorizontal ? 'h-1/2 w-full items-start' : 'h-full w-1/2'}">
		<div
			class=" bg-red-70 {isHorizontal ? 'w-full' : 'h-full'}"
			style="{isHorizontal ? 'height' : 'width'}: {Math.round((day.out / max) * 100)}%;"
		></div>
	</div>
</button>
