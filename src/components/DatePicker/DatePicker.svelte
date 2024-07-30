<script lang="ts">
	import { formatThaiDate, parseThaiDate } from '$lib/date-parser';
	import { DatePicker, DatePickerInput } from 'carbon-components-svelte';

	export let value = formatThaiDate(new Date());
</script>

<DatePicker
	{value}
	datePickerType="single"
	locale={{
		weekdays: {
			shorthand: ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'],
			longhand: ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์']
		},
		months: {
			shorthand: [
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
			],
			longhand: [
				'มกราคม',
				'กุมภาพันธ์',
				'มีนาคม',
				'เมษายน',
				'พฤษภาคม',
				'มิถุนายน',
				'กรกฎาคม',
				'สิงหาคม',
				'กันยายน',
				'ตุลาคม',
				'พฤศจิกายน',
				'ธันวาคม'
			]
		}
	}}
	maxDate="today"
	flatpickrProps={{
		formatDate: (date) => formatThaiDate(date),
		parseDate: parseThaiDate
	}}
>
	<DatePickerInput />
</DatePicker>
