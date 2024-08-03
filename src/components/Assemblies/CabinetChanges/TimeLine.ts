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

export const getDateData = (data: TimeLine[]) => {
	const minYear = Math.min(...data.map((d) => d.date.getFullYear()));
	const maxYear = Math.max(
		Math.max(...data.map((d) => d.date.getFullYear())),
		new Date().getFullYear()
	);
	const calendar = [];
	for (let year = minYear; year <= maxYear; year++) {
		const monthsInYear = [];
		for (let month = 0; month < 12; month++) {
			const numberDaysInMonth = new Date(year, month + 1, 0).getDate();
			const daysInMonth = [];
			for (let day = 1; day <= numberDaysInMonth; day++) {
				const date = new Date(year, month, day);
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
			yaer: year,
			months: monthsInYear
		});
	}
	return calendar;
};
