import { parseThaiDate, formatThaiDate } from '../date-parser';
import { describe, expect, it, vi } from 'vitest';

describe('parse and fomat Thai date', () => {
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
			const formattedDate = formatThaiDate(date, true);
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
