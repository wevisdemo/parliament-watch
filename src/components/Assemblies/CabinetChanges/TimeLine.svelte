<script lang="ts">
	import Tooltip from '../Tooltip.svelte';
	import { createEventDispatcher } from 'svelte';
	import SquareIcon from './squareIcon.svelte';

	interface timeLineProps {
		date: Date;
		in: number;
		out: number;
		event?: string;
	}
	export let data: timeLineProps[];
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

	const compareDate = (date1: Date, date2: Date) => {
		return (
			date1.getFullYear() === date2.getFullYear() &&
			date1.getMonth() === date2.getMonth() &&
			date1.getDate() === date2.getDate()
		);
	};

	const thaiMonthNames = [
		'ม.ค.',
		'ก.พ.',
		'มี.ค.',
		'เม.ย.',
		'พ.ค.',
		'มิ.ย.',
		'ก.ค.',
		'ส.ค.',
		'ก.ย.',
		'ต.ค.',
		'พ.ย.',
		'ธ.ค.'
	];

	const formatThaiDate = (date: Date): string => {
		const day = date.getDate();
		const month = thaiMonthNames[date.getMonth()];
		const year = (date.getFullYear() + 543).toString().slice(-2);

		return `${day} ${month} ${year}`;
	};

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

<div class="relative flex h-[65px]">
	{#each dateData as year}
		{#each year.months as month}
			<div class="relative flex">
				{#each month.days as day}
					{#if day.event}
						<div
							class="absolute left-1 top-0 -mt-16 flex h-full flex-col border-l border-dashed border-black px-1 text-text-02"
						>
							<p class="text-text-01">
								{formatThaiDate(day.date)}
								{month.id === 0 ? year.yaer.toString().slice(-2) : ''}
							</p>
							<p>{day.event}</p>
						</div>
					{/if}
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
						<div
							slot="tooltip"
							class="sticky flex h-full w-full flex-col items-start justify-center"
						>
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
				{/each}
				<div class="absolute bottom-0 left-0 z-20 -mb-7 text-text-02">
					{thaiMonthNames[month.id]}
					{month.id === 0 ? year.yaer.toString().slice(-2) : ''}
				</div>
			</div>
		{/each}
	{/each}
</div>
