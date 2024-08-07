export interface TimeLine {
	date: Date;
	in: number;
	out: number;
	event?: string;
}

export const compareDate = (date1: Date, date2: Date) => {
	return (
		date1.getFullYear() === date2.getFullYear() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getDate() === date2.getDate()
	);
};

export const thaiMonthNames = [
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

export const formatThaiDate = (date: Date): string => {
	const day = date.getDate();
	const month = thaiMonthNames[date.getMonth()];
	const year = (date.getFullYear() + 543).toString().slice(-2);

	return `${day} ${month} ${year}`;
};

export const isDateInRange = (date: Date, minDate: Date, maxDate: Date): boolean => {
	const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
	const minDateOnly = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
	const maxDateOnly = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
	return dateOnly >= minDateOnly && dateOnly <= maxDateOnly;
};

export const getDateData = (data: TimeLine[], startedAt: Date | null, endedAt: Date | null) => {
	const minDate = startedAt ? startedAt : new Date(Math.min(...data.map((d) => d.date.getTime())));
	const maxDate = endedAt ? endedAt : new Date();

	const minYear = minDate.getFullYear();
	const maxYear = maxDate.getFullYear();

	const calendar = [];
	for (let year = minYear; year <= maxYear; year++) {
		const monthsInYear = [];
		for (let month = 0; month < 12; month++) {
			const numberDaysInMonth = new Date(year, month + 1, 0).getDate();
			const daysInMonth = [];
			for (let day = 1; day <= numberDaysInMonth; day++) {
				const date = new Date(year, month, day);
				if (!isDateInRange(date, minDate, maxDate)) {
					continue;
				}
				const dataInDay = data.find((d) => compareDate(d.date, date)) || {
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
			year: year,
			months: monthsInYear.filter((month) => month.days.length > 0)
		});
	}
	return calendar;
};
