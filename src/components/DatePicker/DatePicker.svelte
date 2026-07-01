<script lang="ts">
	import { formatThaiDate, longMonthNames, parseThaiDate, shortMonthNames } from '$lib/date';
	import { DatePicker, DatePickerInput } from 'carbon-components-svelte';

	interface Props {
		handleSelectDate: (date: Date) => void;
		selectedDate: Date;
	}

	let { handleSelectDate, selectedDate = $bindable() }: Props = $props();

	let value = $derived(selectedDate ? formatThaiDate(selectedDate) : '');
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
