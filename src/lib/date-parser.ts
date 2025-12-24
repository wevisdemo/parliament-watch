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
] as [
	string,
	string,
	string,
	string,
	string,
	string,
	string,
	string,
	string,
	string,
	string,
	string
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
] as [
	string,
	string,
	string,
	string,
	string,
	string,
	string,
	string,
	string,
	string,
	string,
	string
];

export function parseThaiDate(dateString: string): Date {
	const [day, month, year] = dateString.split(' ');
	let monthIndex = longMonthNames.indexOf(month);
	if (monthIndex === -1) {
		monthIndex = shortMonthNames.indexOf(month);
	}
	return new Date(+year - 543, monthIndex, +day);
}

export const sameDate = (date1: Date, date2: Date) => {
	return (
		date1.getFullYear() === date2.getFullYear() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getDate() === date2.getDate()
	);
};

export const isDateInRange = (date: Date, minDate: Date, maxDate: Date): boolean => {
	const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
	const minDateOnly = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
	const maxDateOnly = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
	return dateOnly >= minDateOnly && dateOnly <= maxDateOnly;
};

type FormatOptions = {
	hideDate?: boolean;
	hideMonth?: boolean;
	shortMonth?: boolean;
	shortYear?: boolean;
};

export function formatThaiDate(date: Date | string, options?: FormatOptions): string {
	if (options?.hideMonth) {
		// return only year
		const thaiYear = new Date(date).getFullYear() + 543;
		return options?.shortYear ? String(thaiYear).slice(-2) : String(thaiYear);
	}

	return new Date(date).toLocaleDateString('th-TH', {
		...(options?.hideDate ? {} : { day: 'numeric' }),
		month: options?.shortMonth ? 'short' : 'long',
		year: options?.shortYear ? '2-digit' : 'numeric'
	});
}

export function formatDateRange(
	dateStart: Date | string | null | undefined,
	dateEnd: Date | string | null | undefined,
	options?: FormatOptions
): string | undefined {
	const startStr = dateStart ? formatThaiDate(dateStart, options ?? {}) : undefined;
	const endStr = dateEnd ? formatThaiDate(dateEnd, options ?? {}) : undefined;
	const isYearMode = options?.hideMonth;

	if (!startStr && !endStr) return undefined;
	if (!startStr && endStr) return `${isYearMode ? 'ก่อนปี' : 'ก่อน'} ${endStr}`;
	if (startStr && !endStr) return `${startStr} - ปัจจุบัน`;

	if (startStr == endStr) return `${startStr}`;
	return `${startStr} - ${endStr}`;
}

export function formatThaiYear(date: Date | string, options?: FormatOptions): string {
	return formatThaiDate(date, { ...options, hideMonth: true });
}

export function formatYearRange(
	dateStart: Date | string | null | undefined,
	dateEnd: Date | string | null | undefined,
	options?: FormatOptions
): string | undefined {
	return formatDateRange(dateStart, dateEnd, { ...options, hideMonth: true });
}
