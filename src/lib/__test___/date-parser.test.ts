import {
	parseThaiDate,
	formatThaiDate,
	isSameDate,
	isDatetimeInRange,
	formatDateRange,
	getStartOfDay
} from '../date-parser';
import { describe, expect, it } from 'vitest';

describe('parse and format Thai date', () => {
	describe('parse', () => {
		it('should parse a date string in long format', () => {
			const dateString = '1 มกราคม 2565';
			const expectedDate = new Date(2022, 0, 1);
			const parsedDate = parseThaiDate(dateString);
			expect(parsedDate).toEqual(expectedDate);
		});

		it('should parse a date string in short format', () => {
			const dateString = '1 ม.ค. 2565';
			const expectedDate = new Date(2022, 0, 1);
			const parsedDate = parseThaiDate(dateString);
			expect(parsedDate).toEqual(expectedDate);
		});

		it('should handle leap years correctly', () => {
			const dateString = '29 กุมภาพันธ์ 2564';
			const expectedDate = new Date(2021, 1, 29);
			const parsedDate = parseThaiDate(dateString);
			expect(parsedDate).toEqual(expectedDate);
		});
	});

	describe('format', () => {
		it('should format a date in long format', () => {
			const date = new Date(2012, 0, 1);
			const expectedDateString = '1 มกราคม 2555';
			const formattedDate = formatThaiDate(date);
			expect(formattedDate).toEqual(expectedDateString);
		});

		it('should format a date in short format', () => {
			const date = new Date(2012, 0, 1);
			const expectedDateString = '1 ม.ค. 2555';
			const formattedDate = formatThaiDate(date, { shortMonth: true });
			expect(formattedDate).toEqual(expectedDateString);
		});

		it('should format with short year', () => {
			const date = new Date(2003, 3, 28);
			const expectedDateString = '28 เมษายน 46';
			const formattedDate = formatThaiDate(date, { shortYear: true });
			expect(formattedDate).toEqual(expectedDateString);
		});

		it('should format hide day', () => {
			const date = new Date(2012, 10, 25);
			const expectedDateString = 'พฤศจิกายน 2555';
			const formattedDate = formatThaiDate(date, { hideDay: true });
			expect(formattedDate).toEqual(expectedDateString);
		});

		it('should format year', () => {
			const date = new Date(2010, 3, 7);
			const expectedDateString = '2553';
			const formattedDate = formatThaiDate(date, { hideMonth: true });
			expect(formattedDate).toEqual(expectedDateString);
		});
	});

	describe('parse and format', () => {
		it.each([new Date(2022, 0, 1), new Date(2022, 1, 1), new Date(2002, 1, 1)])(
			'should parse and format a date correctly',
			(date) => {
				const formattedDate = formatThaiDate(date);
				expect(parseThaiDate(formattedDate)).toEqual(date);
			}
		);
	});
});

describe('getStartOfDay discards the time part', () => {
	const cases = [
		new Date(2024, 0, 1, 23, 59, 59, 999),
		new Date(2024, 5, 10, 15, 30, 45, 123),
		new Date(2024, 11, 31, 0, 0, 1, 1),
		new Date(2023, 2, 28, 12, 0, 0, 0)
	];

	for (const input of cases) {
		it(`discards time for ${input.toISOString()}`, () => {
			const result = getStartOfDay(input);
			expect(result.getFullYear()).toBe(input.getFullYear());
			expect(result.getMonth()).toBe(input.getMonth());
			expect(result.getDate()).toBe(input.getDate());
			expect(result.getHours()).toBe(0);
			expect(result.getMinutes()).toBe(0);
			expect(result.getSeconds()).toBe(0);
			expect(result.getMilliseconds()).toBe(0);
		});
	}

	for (const input of cases) {
		it('does not mutate the original date', () => {
			const date = new Date(2024, 5, 10, 15, 30);
			getStartOfDay(date);
			expect(date == input);
		});
	}
});

describe('isSameDate checks if two datetime are in same day', () => {
	it('returns true for same Y/M/D', () => {
		expect(isSameDate(new Date('2025-05-05T00:00:00'), new Date('2025-05-05T00:00:00'))).toBe(true);
		expect(isSameDate(new Date('2021-02-01T00:00:00'), new Date('2021-02-01T23:59:59'))).toBe(true);
		expect(isSameDate(new Date('2024-01-01T22:11:23'), new Date('2024-01-01T23:59:59'))).toBe(true);
	});

	it('returns false for different dates', () => {
		expect(isSameDate(new Date('2024-01-01T00:00:00'), new Date('2024-01-02T00:00:00'))).toBe(
			false
		);
		expect(isSameDate(new Date('2025-01-01T00:00:00'), new Date('2025-02-01T00:00:00'))).toBe(
			false
		);
		expect(isSameDate(new Date('2026-01-01'), new Date('2027-01-01'))).toBe(false);
	});
});

describe('isDatetimeInRange checks date in range', () => {
	const min = new Date('2024-01-01T00:00:00');
	const max = new Date('2024-01-31T05:34:56');

	it('includes boundary dates and time', () => {
		expect(isDatetimeInRange(new Date('2024-01-01T00:00:00'), min, max)).toBe(true);
		expect(isDatetimeInRange(new Date('2024-01-05'), min, max)).toBe(true);
		expect(isDatetimeInRange(new Date('2024-01-20'), min, max)).toBe(true);
		expect(isDatetimeInRange(new Date('2024-01-31T05:34:56'), min, max)).toBe(true);
	});

	it('excludes datetime outside range', () => {
		expect(isDatetimeInRange(new Date('2023-12-31T23:59:59'), min, max)).toBe(false);
		expect(isDatetimeInRange(new Date('2024-01-31T05:34:57'), min, max)).toBe(false);
		expect(isDatetimeInRange(new Date('2024-02-03'), min, max)).toBe(false);
	});
});

describe('format Thai date ranges', () => {
	it('returns undefined if both dates missing', () => {
		expect(formatDateRange(null, undefined)).toBeUndefined();
	});

	it('formats open-ended ranges', () => {
		expect(formatDateRange(null, '2024-01-01')).toBe('ก่อน 1 มกราคม 2567');

		expect(formatDateRange('2024-01-01', null)).toBe('1 มกราคม 2567 - ปัจจุบัน');
	});

	it('formats full range', () => {
		expect(formatDateRange('2024-01-01', '2024-12-31', { hideDay: true })).toBe(
			'มกราคม 2567 - ธันวาคม 2567'
		);
	});

	it('formats full range discard empty range', () => {
		expect(formatDateRange('2024-12-01', '2024-12-31', { hideDay: true })).toBe('ธันวาคม 2567');
	});
});
