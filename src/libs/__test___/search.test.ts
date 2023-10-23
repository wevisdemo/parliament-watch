import { describe, expect, it } from 'vitest';
import { normalizeSearchQuery, calculateScore, highlightText } from '../search';

describe('normalizeSearchQuery', () => {
	it('should add spaces after dots from words', () => {
		const query = 'Mr.John Doe';
		const normalizedQuery = normalizeSearchQuery(query);
		expect(normalizedQuery).toEqual(['Mr.', 'John', 'Doe']);
	});

	it('should add spaces around numbers', () => {
		const query = 'I have 3apples and 2oranges';
		const normalizedQuery = normalizeSearchQuery(query);
		expect(normalizedQuery).toEqual(['I', 'have', '3', 'apples', 'and', '2', 'oranges']);
	});

	it('should remove duplicate words', () => {
		const query = 'apple apple orange';
		const normalizedQuery = normalizeSearchQuery(query);
		expect(normalizedQuery).toEqual(['apple', 'orange']);
	});

	it('should remove empty strings', () => {
		const query = '  ';
		const normalizedQuery = normalizeSearchQuery(query);
		expect(normalizedQuery).toEqual([]);
	});
});

describe('calculateScore', () => {
	it('should return score 0 when no query is matched', () => {
		const queries = ['กก'];
		const items = [{ name: 'ข้อความที่ไม่ตรง' }];
		const result = calculateScore(queries, items);
		expect(result).length(1);
		expect(result[0].score).toEqual(0);
	});

	it('should return score 1 when all queries are matched', () => {
		const queries = ['ข้อความ', 'ที่', 'ตรง'];
		const items = [{ name: 'ข้อความที่ตรง' }];
		const result = calculateScore(queries, items);
		expect(result).length(1);
		expect(result[0].score).toEqual(1);
	});

	it('should return higher score when more queries are matched', () => {
		const queries = ['กก', 'ขข'];
		const items = [{ name: 'กข' }, { name: 'กก' }, { name: 'ขข' }, { name: 'กกขข' }];
		const result = calculateScore(queries, items, false);
		expect(result).length(4);
		expect(result.sort((a, b) => b.score - a.score).map((r) => r.item.name)).toEqual([
			'กกขข',
			'กก',
			'ขข',
			'กข'
		]);
	});

	it('should return zero when only some queries are matched and includeAllQuery is true', () => {
		const queries = ['กก', 'ขข'];
		const items = [{ name: 'กก' }];
		const result = calculateScore(queries, items);
		expect(result).length(1);
		expect(result[0].score).toEqual(0);
	});
});

describe('highlightText', () => {
	it.each([
		{
			text: 'กขคง',
			indices: [0, 2],
			expected: [
				{ text: 'ก', highlight: true },
				{ text: 'ข', highlight: false },
				{ text: 'ค', highlight: true },
				{ text: 'ง', highlight: false }
			]
		},
		{
			text: 'ไก่จิกเด็กตาย',
			indices: [0, 1, 2, 3, 4, 5],
			expected: [
				{ text: 'ไก่จิก', highlight: true },
				{ text: 'เด็กตาย', highlight: false }
			]
		},
		{
			text: 'ไก่จิกเด็กตาย',
			indices: [10, 11, 12],
			expected: [
				{ text: 'ไก่จิกเด็ก', highlight: false },
				{ text: 'ตาย', highlight: true }
			]
		},
		{
			text: 'ไก่จิกเด็กตาย',
			indices: [],
			expected: [{ text: 'ไก่จิกเด็กตาย', highlight: false }]
		}
	])('should return highlighted text $text $indices', ({ text, indices, expected }) => {
		const result = highlightText(text, indices);
		expect(result).toEqual(expected);
	});
});
