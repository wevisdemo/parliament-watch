<script lang="ts">
	import DatePicker from '$components/DatePicker/DatePicker.svelte';
	import SquareIcon from './SquareIcon.svelte';
	import type { TimeLine } from './TimeLine';
	import TimeLineVertical from './TimeLineVertical.svelte';
	import { Modal } from 'carbon-components-svelte';

	interface Props {
		timeLineData: TimeLine[];
		selectedDate: Date;
		startedAt: Date | undefined;
		endedAt: Date | undefined;
		handleSelectDate: (date: Date) => void;
		open?: boolean;
		onClose: () => void;
	}

	let {
		timeLineData,
		selectedDate,
		startedAt,
		endedAt,
		handleSelectDate,
		open = false,
		onClose
	}: Props = $props();

	let changeDate = $derived(selectedDate);
	const handleChangeDate = (date: Date) => {
		changeDate = date;
	};

	const handleSubmit = () => {
		handleSelectDate(changeDate);
		onClose();
	};

	const handleClose = () => {
		changeDate = selectedDate;
		onClose();
	};
</script>

<Modal
	{open}
	on:close={handleClose}
	primaryButtonText="ตกลง"
	on:click:button--primary={handleSubmit}
	secondaryButtonText="ยกเลิก"
	on:click:button--secondary={handleClose}
>
	{#snippet heading()}
		<div>
			<p class="heading-compact-01">การปรับเปลี่ยน</p>
			<div class="label-01 mb-2 flex items-center gap-1">
				<SquareIcon width={10} color="#00B9C4" />
				<p class="mr-1">เข้า</p>
				<SquareIcon width={10} color="#B12000" />
				<p>ออก</p>
			</div>
			<DatePicker selectedDate={changeDate} handleSelectDate={handleChangeDate} />
		</div>
	{/snippet}
	<TimeLineVertical
		{timeLineData}
		{startedAt}
		{endedAt}
		selectedDate={changeDate}
		handleSelectDate={handleChangeDate}
	/>
</Modal>
