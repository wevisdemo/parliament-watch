import { isDateInRange, sameDate, shortMonthNames } from '$lib/date-parser';

export interface TimeLine {
	date: Date;
	in: number;
	out: number;
	event?: string;
}

export const getDateData = (
	data: TimeLine[],
	startedAt: Date | undefined,
	endedAt: Date | undefined
) => {
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
				const dataInDay = data.find((d) => sameDate(d.date, date)) || {
					date: date,
					in: 0,
					out: 0
				};
				daysInMonth.push(dataInDay);
			}
			monthsInYear.push({
				id: month,
				month: shortMonthNames[month],
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
