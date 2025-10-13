<script lang="ts">
	import SquareIcon from './SquareIcon.svelte';
	import type { TimeLine } from './TimeLine';
	import TimeLineComponent from './TimeLine.svelte';

	export let timeLineData: TimeLine[];
	export let startedAt: Date | undefined;
	export let endedAt: Date | undefined;
	export let selectedDate: Date;
	export let handleSelectDate: (date: Date) => void;
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

<TimeLineComponent {timeLineData} {startedAt} {endedAt} {selectedDate} {handleSelectDate} />
