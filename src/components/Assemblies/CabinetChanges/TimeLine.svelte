<script lang="ts">
	import { formatThaiDate, isSameDate, shortMonthNames } from '$lib/date';
	import Tooltip from '../Tooltip.svelte';
	import TimeItem from './TimeItem.svelte';
	import { type TimeLine, getDateData } from './TimeLine';
	import TimeLineToolTip from './TimeLineToolTip.svelte';
	import ChevronLeft from 'carbon-icons-svelte/lib/ChevronLeft.svelte';
	import ChevronRight from 'carbon-icons-svelte/lib/ChevronRight.svelte';
	import { onMount, tick } from 'svelte';

	interface Props {
		timeLineData: TimeLine[];
		startedAt: Date | undefined;
		endedAt: Date | undefined;
		selectedDate: Date;
		handleSelectDate: (date: Date) => void;
	}

	let { timeLineData, startedAt, endedAt, selectedDate, handleSelectDate }: Props = $props();

	let max = $derived(Math.max(...timeLineData.map((d) => Math.max(d.in, d.out))));
	let dateData = $derived(getDateData(timeLineData, startedAt, endedAt));

	let timelineContainer: HTMLDivElement | undefined = $state();
	let selectedDateElement: HTMLElement | undefined = $state();

	const handleNext = () => {
		timelineContainer?.scrollBy({
			left: -(timelineContainer?.clientWidth ?? 0),
			behavior: 'smooth'
		});
	};

	const handlePrev = () => {
		timelineContainer?.scrollBy({ left: timelineContainer?.clientWidth ?? 0, behavior: 'smooth' });
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

	$effect(() => {
		if (startedAt) {
			scrollToSelectedDate();
		}
	});
</script>

<div class="relative">
	<div
		class="no-scrollbar flex overflow-x-auto px-[16px] pb-10 pt-20 sm:px-[64px]"
		bind:this={timelineContainer}
	>
		<div class="chevron absolute left-0 -mt-20 w-[16px] bg-ui-01 sm:w-[64px]">
			<button onclick={handleNext}>
				<ChevronLeft size={32} />
			</button>
		</div>
		{#each dateData as year (year)}
			{#each year.months as month (month)}
				<div class="relative z-[0]">
					<p class="label-01 absolute bottom-0 -mb-7 w-12 text-text-02">
						{shortMonthNames[month.id]}
						{month.id === 0 ? year.year.toString().slice(-2) : ''}
					</p>
				</div>
				{#each month.days as day (day)}
					{@const isSelectedDate = isSameDate(day.date, selectedDate)}
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
						<div bind:this={selectedDateElement}></div>
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
							{#snippet tooltip()}
								<TimeLineToolTip {day} {selectedDate} />
							{/snippet}
						</Tooltip>
					</div>
				{/each}
			{/each}
		{/each}
		<div class="chevron absolute right-0 -mt-20 w-[16px] bg-ui-01 sm:w-[64px]">
			<button onclick={handlePrev}>
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
