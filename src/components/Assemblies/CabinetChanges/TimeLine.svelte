<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { compareDate, thaiMonthNames, formatThaiDate, type TimeLine } from './TimeLine';
	import { ChevronLeft, ChevronRight } from 'carbon-icons-svelte';
	import TimeItem from './TimeItem.svelte';

	export let data: TimeLine[];
	export let selectedDate: Date;

	const dispatch = createEventDispatcher();
	const handleSelectDate = (dateSelect: Date) => {
		dispatch('selectDate', { value: dateSelect });
	};

	$: max = Math.max(...data.map((d) => Math.max(d.in, d.out)));
	$: minYear = Math.min(...data.map((d) => d.date.getFullYear()));
	$: maxYear = Math.max(
		Math.max(...data.map((d) => d.date.getFullYear())),
		new Date().getFullYear()
	);

	$: getDateData = (minYear: number, maxYear: number) => {
		let calendar = [];
		for (let year = minYear; year <= maxYear; year++) {
			let monthsInYear = [];
			for (let month = 0; month < 12; month++) {
				let numberDaysInMonth = new Date(year, month + 1, 0).getDate();
				let daysInMonth = [];
				for (let day = 1; day <= numberDaysInMonth; day++) {
					let date = new Date(year, month, day);
					let dataInDay = data.find((d) => compareDate(d.date, date)) || {
						date: date,
						in: 0,
						out: 0
					};
					daysInMonth.push(dataInDay);
				}
				monthsInYear.push({
					id: month,
					month: thaiMonthNames[month],
					days: daysInMonth
				});
			}
			calendar.push({
				yaer: year,
				months: monthsInYear
			});
		}
		return calendar;
	};

	$: dateData = getDateData(minYear, maxYear);
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
								<TimeItem {day} {selectedDate} {max} {handleSelectDate} />
							</div>
						{/each}
						<div class="absolute bottom-0 -mb-7 text-text-02">
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
