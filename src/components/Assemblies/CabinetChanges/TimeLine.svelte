<script lang="ts">
	import {
		thaiMonthNames,
		formatThaiDate,
		type TimeLine,
		getDateData,
		compareDate
	} from './TimeLine';
	import { ChevronLeft, ChevronRight } from 'carbon-icons-svelte';
	import TimeItem from './TimeItem.svelte';
	import Tooltip from '../Tooltip.svelte';
	import TimeLineToolTip from './TimeLineToolTip.svelte';

	export let timeLineData: TimeLine[];
	export let selectedDate: Date;
	export let handleSelectDate: (date: Date) => void;

	$: max = Math.max(...timeLineData.map((d) => Math.max(d.in, d.out)));

	$: dateData = getDateData(timeLineData);
</script>

<div class="flex">
	<div class="chevron w-[16px] sm:w-[64px]">
		<ChevronLeft size={32} />
	</div>
	<div class="no-scrollbar flex overflow-x-auto pb-10 pt-20">
		<div class="flex h-[65px]">
			{#each dateData as year}
				{#each year.months as month}
					<div class="relative flex">
						{#each month.days as day}
							<div class="relative flex">
								{#if day.event}
									<div
										class="absolute left-1 -mt-14 h-full border-l border-dashed border-black px-1 text-text-02"
									>
										<p class="label-01 w-fit min-w-[60px] text-text-01">
											{formatThaiDate(day.date)}
										</p>
										<p class="label-01">{day.event}</p>
									</div>
								{/if}
								<Tooltip
									direction="top"
									showAllTime={compareDate(day.date, selectedDate)}
									open={compareDate(day.date, selectedDate)}
									style={compareDate(day.date, selectedDate) ? '' : 'background-color: white;'}
								>
									<TimeItem {day} {selectedDate} {max} {handleSelectDate} />
									<div slot="tooltip">
										<TimeLineToolTip {day} {selectedDate} />
									</div>
								</Tooltip>
							</div>
						{/each}

						<div class="label-01 absolute bottom-0 -mb-7 text-text-02">
							{thaiMonthNames[month.id]}
							{month.id === 0 ? (year.yaer + 543).toString().slice(-2) : ''}
						</div>
					</div>
				{/each}
			{/each}
		</div>
	</div>
	<div class="chevron w-[16px] sm:w-[64px]">
		<ChevronRight size={32} />
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
	.chevron {
		display: flex;
		flex: none;
		align-items: center;
		justify-content: center;
		background-color: 'ui-01';
		padding-top: 80px;
		padding-bottom: 40px;
	}
</style>
