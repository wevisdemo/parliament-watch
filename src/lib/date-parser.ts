export const longMonthNames = [
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
];

export const shortMonthNames = [
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

export function parseThaiDate(dateString: string): Date {
	const [day, month, year] = dateString.split(' ');
	let monthIndex = longMonthNames.indexOf(month);
	if (monthIndex === -1) {
		monthIndex = shortMonthNames.indexOf(month);
	}
	return new Date(+year - 543, monthIndex, +day);
}

export function formatThaiDate(date: Date, shortMonth = false): string {
	return date.toLocaleDateString('th-TH', {
		day: 'numeric',
		month: shortMonth ? 'short' : 'long',
		year: 'numeric'
	});
}
