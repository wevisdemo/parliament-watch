import {
	parseThaiDate,
	formatThaiDate,
	sameDate,
	isDateInRange,
	formatDateRange
} from '../date-parser';
import { describe, expect, it, vi } from 'vitest';

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
			const formattedDate = formatThaiDate(date, { hideDate: true });
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

describe('sameDate checks if two datetime are in same day', () => {
	it('returns true for same Y/M/D', () => {
		expect(sameDate(new Date('2024-01-01T00:00:00'), new Date('2024-01-01T23:59:59'))).toBe(true);
	});

	it('returns false for different dates', () => {
		expect(sameDate(new Date('2024-01-01'), new Date('2024-01-02'))).toBe(false);
	});
});

describe('isDateInRange checks date in range', () => {
	const min = new Date('2024-01-01');
	const max = new Date('2024-01-31');

	it('includes boundary dates', () => {
		expect(isDateInRange(new Date('2024-01-01'), min, max)).toBe(true);
		expect(isDateInRange(new Date('2024-01-02'), min, max)).toBe(true);
		expect(isDateInRange(new Date('2024-01-05'), min, max)).toBe(true);
		expect(isDateInRange(new Date('2024-01-31'), min, max)).toBe(true);
	});

	it('excludes dates outside range', () => {
		expect(isDateInRange(new Date('2023-12-31'), min, max)).toBe(false);
		expect(isDateInRange(new Date('2024-02-01'), min, max)).toBe(false);
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
		expect(formatDateRange('2024-01-01', '2024-12-31', { hideDate: true })).toBe(
			'มกราคม 2567 - ธันวาคม 2567'
		);
	});

	it('formats full range discard empty range', () => {
		expect(formatDateRange('2024-12-01', '2024-12-31', { hideDate: true })).toBe('ธันวาคม 2567');
	});
});
