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
