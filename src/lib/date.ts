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

export const getStartOfDay = (date: Date) =>
	new Date(date.getFullYear(), date.getMonth(), date.getDate());
export const isSameDate = (date1: Date, date2: Date) =>
	getStartOfDay(date1).getTime() == getStartOfDay(date2).getTime();
export const isDatetimeInRange = (date: Date, minDate: Date, maxDate: Date) =>
	minDate <= date && date <= maxDate;
export const isDateInRange = (date: Date, minDate: Date, maxDate: Date) =>
	isDatetimeInRange(getStartOfDay(date), getStartOfDay(minDate), getStartOfDay(maxDate));

type DateConstructor = ConstructorParameters<typeof Date>[0];
type FormatOptions = {
	hideDay?: boolean;
	hideMonth?: boolean;
	shortMonth?: boolean;
	shortYear?: boolean;
};

export function formatThaiDate(date: DateConstructor, options?: FormatOptions): string {
	const dt = new Date(date);
	if (options?.hideMonth) {
		// return only year
		const thaiYear = String(dt.getFullYear() + 543);
		return options?.shortYear ? thaiYear.slice(-2) : thaiYear;
	}

	return dt.toLocaleDateString('th-TH', {
		...(options?.hideDay ? {} : { day: 'numeric' }),
		month: options?.shortMonth ? 'short' : 'long',
		year: options?.shortYear ? '2-digit' : 'numeric'
	});
}

export function formatDateRange(
	dateStart?: DateConstructor | null,
	dateEnd?: DateConstructor | null,
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
	dateStart?: DateConstructor | null,
	dateEnd?: DateConstructor | null,
	options?: FormatOptions
): string | undefined {
	return formatDateRange(dateStart, dateEnd, { ...options, hideMonth: true });
}
