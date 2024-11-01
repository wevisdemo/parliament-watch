<script lang="ts">
	import { formatThaiDate, longMonthNames, parseThaiDate, shortMonthNames } from '$lib/date-parser';
	import { DatePicker, DatePickerInput } from 'carbon-components-svelte';

	export let handleSelectDate: (date: Date) => void;
	export let selectedDate: Date;

	$: value = selectedDate ? formatThaiDate(selectedDate) : '';
</script>

<DatePicker
	{value}
	on:change={(e) => {
		if (typeof e.detail === 'string') return;
		selectedDate = e.detail.selectedDates[0];
		handleSelectDate(selectedDate);
	}}
	datePickerType="single"
	locale={{
		weekdays: {
			shorthand: ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'],
			longhand: ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์']
		},
		months: {
			shorthand: shortMonthNames,
			longhand: longMonthNames
		}
	}}
	flatpickrProps={{
		formatDate: (date) => formatThaiDate(date),
		parseDate: parseThaiDate
	}}
>
	<DatePickerInput />
</DatePicker>
