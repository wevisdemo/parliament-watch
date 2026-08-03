import { clampPage, isFilterEdited } from '$lib/query-state/data-page-state';
import { describe, expect, it } from 'vitest';

describe('clampPage', () => {
	it('keeps a page that still has rows', () => {
		expect(clampPage(3, 10, 25)).toBe(3);
		expect(clampPage(1, 10, 5)).toBe(1);
	});

	it('clamps to the last page that still has rows', () => {
		expect(clampPage(5, 10, 25)).toBe(3);
		expect(clampPage(3, 10, 20)).toBe(2);
	});

	it('resets to the first page when there is no data', () => {
		expect(clampPage(4, 10, 0)).toBe(1);
	});

	it('handles invalid page and page size', () => {
		expect(clampPage(0, 10, 100)).toBe(1);
		expect(clampPage(-2, 10, 100)).toBe(1);
		expect(clampPage(3, 0, 100)).toBe(1);
	});
});

describe('isFilterEdited', () => {
	const allChoices = {
		filterVoteType: ['เห็นด้วย', 'ไม่เห็นด้วย'],
		filterPosition: ['สส.']
	};

	it('is false for the untouched default state', () => {
		expect(
			isFilterEdited({
				searchQuery: '',
				selectedCheckboxValue: allChoices,
				selectedComboboxValue: { filterParty: undefined },
				checkboxChoicesCount: 3
			})
		).toBe(false);
	});

	it('treats an empty string combobox value as untouched', () => {
		expect(
			isFilterEdited({
				searchQuery: '',
				selectedCheckboxValue: allChoices,
				selectedComboboxValue: { filterParty: '' },
				checkboxChoicesCount: 3
			})
		).toBe(false);
	});

	it('is true when a combobox value is selected', () => {
		expect(
			isFilterEdited({
				searchQuery: '',
				selectedCheckboxValue: allChoices,
				selectedComboboxValue: { filterParty: 'ก' },
				checkboxChoicesCount: 3
			})
		).toBe(true);
	});

	it('is true when a checkbox is unticked', () => {
		expect(
			isFilterEdited({
				searchQuery: '',
				selectedCheckboxValue: { ...allChoices, filterPosition: [] },
				selectedComboboxValue: {},
				checkboxChoicesCount: 3
			})
		).toBe(true);
	});

	it('is true when searching, but not for whitespace only', () => {
		expect(
			isFilterEdited({
				searchQuery: 'ทดสอบ',
				selectedCheckboxValue: allChoices,
				selectedComboboxValue: {},
				checkboxChoicesCount: 3
			})
		).toBe(true);
		expect(
			isFilterEdited({
				searchQuery: '   ',
				selectedCheckboxValue: allChoices,
				selectedComboboxValue: {},
				checkboxChoicesCount: 3
			})
		).toBe(false);
	});
});
