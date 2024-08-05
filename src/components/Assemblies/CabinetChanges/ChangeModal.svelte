<script lang="ts">
	import { Modal } from 'carbon-components-svelte';
	import TimeLineVertical from './TimeLineVertical.svelte';
	import type { TimeLine } from './TimeLine';
	import SquareIcon from './SquareIcon.svelte';
	import DatePicker from '$components/DatePicker/DatePicker.svelte';

	export let timeLineData: TimeLine[];
	export let selectedDate: Date;
	export let startedAt: Date | null;
	export let endedAt: Date | null;
	export let handleSelectDate: (date: Date) => void;

	export let open = false;
	export let onClose: () => void;

	$: changeDate = selectedDate;
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
	on:click:button--primary={() => handleSubmit()}
	secondaryButtonText="ยกเลิก"
	on:click:button--secondary={handleClose}
>
	<div slot="heading">
		<p class="heading-compact-01">การปรับเปลี่ยน</p>
		<div class="label-01 mb-2 flex items-center gap-1">
			<SquareIcon width={10} color="#00B9C4" />
			<p class="mr-1">เข้า</p>
			<SquareIcon width={10} color="#B12000" />
			<p>ออก</p>
		</div>
		<DatePicker selectedDate={changeDate} handleSelectDate={handleChangeDate} />
	</div>
	<TimeLineVertical
		{timeLineData}
		{startedAt}
		{endedAt}
		selectedDate={changeDate}
		handleSelectDate={handleChangeDate}
	/>
</Modal>
