<script lang="ts">
	import { type TimeLine, getDateData } from './TimeLine';
	import { ChevronLeft, ChevronRight } from 'carbon-icons-svelte';
	import TimeItem from './TimeItem.svelte';
	import Tooltip from '../Tooltip.svelte';
	import TimeLineToolTip from './TimeLineToolTip.svelte';
	import { formatThaiDate, sameDate, shortMonthNames } from '$lib/date-parser';
	import { afterUpdate, onMount, tick } from 'svelte';

	export let timeLineData: TimeLine[];
	export let startedAt: Date | undefined;
	export let endedAt: Date | undefined;
	export let selectedDate: Date;
	export let handleSelectDate: (date: Date) => void;

	$: max = Math.max(...timeLineData.map((d) => Math.max(d.in, d.out)));

	$: dateData = getDateData(timeLineData, startedAt, endedAt);

	let timelineContainer: HTMLDivElement;
	let prevStartedAt: Date | undefined;
	let selectedDateElement: HTMLElement;

	const handleNext = () => {
		timelineContainer.scrollBy({ left: -timelineContainer.clientWidth, behavior: 'smooth' });
	};

	const handlePrev = () => {
		timelineContainer.scrollBy({ left: timelineContainer.clientWidth, behavior: 'smooth' });
	};

	const scrollToSelectedDate = async () => {
		await tick();
		if (selectedDateElement) {
			selectedDateElement.scrollIntoView({ behavior: 'smooth', inline: 'center' });
		}
	};

	onMount(() => {
		scrollToSelectedDate();
	});

	afterUpdate(() => {
		if (startedAt !== prevStartedAt) {
			scrollToSelectedDate();
			prevStartedAt = startedAt;
		}
	});
</script>

<div class="relative">
	<div
		class="no-scrollbar flex overflow-x-auto px-[16px] pb-10 pt-20 sm:px-[64px]"
		bind:this={timelineContainer}
	>
		<div class="chevron absolute left-0 -mt-20 w-[16px] bg-ui-01 sm:w-[64px]">
			<button on:click={handleNext}>
				<ChevronLeft size={32} />
			</button>
		</div>
		{#each dateData as year (year)}
			{#each year.months as month (month)}
				<div class="relative z-[0]">
					<p class="label-01 absolute bottom-0 -mb-7 w-12 text-text-02">
						{shortMonthNames[month.id]}
						{month.id === 0 ? (year.year + 543).toString().slice(-2) : ''}
					</p>
				</div>
				{#each month.days as day (day)}
					{@const isSelectedDate = sameDate(day.date, selectedDate)}
					{#if day.event}
						<div class="relative z-[0]">
							<div
								class="absolute left-1 -mt-14 h-full border-l border-dashed border-black px-1 text-text-02"
							>
								<p class="label-01 w-fit min-w-[60px] text-text-01">
									{formatThaiDate(day.date, { shortMonth: true, shortYear: true })}
								</p>
								<p class="label-01">{day.event}</p>
							</div>
						</div>
					{/if}
					{#if isSelectedDate}
						<div bind:this={selectedDateElement} />
					{/if}
					<div class={isSelectedDate ? 'sticky left-0 right-0 z-[2]' : ''}>
						<Tooltip
							direction="top"
							showAllTime={isSelectedDate}
							open={isSelectedDate}
							tooltipStyle={isSelectedDate ? '' : 'background-color: white;'}
						>
							<div class="h-[65px]">
								<TimeItem {day} {selectedDate} {max} {handleSelectDate} />
							</div>
							<div slot="tooltip">
								<TimeLineToolTip {day} {selectedDate} />
							</div>
						</Tooltip>
					</div>
				{/each}
			{/each}
		{/each}
		<div class="chevron absolute right-0 -mt-20 w-[16px] bg-ui-01 sm:w-[64px]">
			<button on:click={handlePrev}>
				<ChevronRight size={32} />
			</button>
		</div>
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
		height: 100%;
		padding-top: 80px;
		padding-bottom: 40px;
		z-index: 1;
	}
</style>
