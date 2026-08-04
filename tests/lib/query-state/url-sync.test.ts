import {
	getNextQueryUrl,
	normalizeQueryStateConfig,
	readQueryState,
	type QueryStateChoices
} from '$lib/query-state/url-sync';
import { describe, expect, it } from 'vitest';

const choices: QueryStateChoices = {
	checkbox: [{ key: 'filterStatus', values: ['ผ่าน', 'ไม่ผ่าน'] }],
	combobox: [{ key: 'filterProposerName', values: ['ครม.', 'สส.'] }]
};

const config = normalizeQueryStateConfig(
	{ search: { param: 'q' }, combobox: { filterProposerName: { param: 'proposername' } } },
	choices
);

const defaultState = {
	searchQuery: '',
	selectedCheckboxValue: { filterStatus: ['ผ่าน', 'ไม่ผ่าน'] },
	selectedComboboxValue: { filterProposerName: undefined }
};

describe('normalizeQueryStateConfig', () => {
	it('falls back to the group key as param name', () => {
		expect(normalizeQueryStateConfig(undefined, choices)).toEqual({
			search: undefined,
			checkbox: { filterStatus: { mode: 'list', param: 'filterStatus' } },
			combobox: { filterProposerName: { param: 'filterProposerName' } }
		});
	});

	it('keeps explicitly configured params', () => {
		expect(config.combobox?.filterProposerName).toEqual({ param: 'proposername' });
	});
});

describe('getNextQueryUrl', () => {
	it('returns null when the url already matches the state', () => {
		const url = new URL('https://a.test/bills/explore');
		expect(getNextQueryUrl(url, config, defaultState, choices)).toBeNull();
	});

	it('encodes search and combobox selection', () => {
		const url = new URL('https://a.test/bills/explore');
		expect(
			getNextQueryUrl(
				url,
				config,
				{
					...defaultState,
					searchQuery: 'งบประมาณ',
					selectedComboboxValue: { filterProposerName: 'ครม.' }
				},
				choices
			)
		).toBe(
			`/bills/explore?q=${encodeURIComponent('งบประมาณ')}&proposername=${encodeURIComponent('ครม.')}`
		);
	});

	it('keeps unrelated params and the hash', () => {
		const url = new URL('https://a.test/bills/explore?page=2#table');
		expect(getNextQueryUrl(url, config, { ...defaultState, searchQuery: 'x' }, choices)).toBe(
			'/bills/explore?page=2&q=x#table'
		);
	});

	it('drops the search param back to a bare path when cleared', () => {
		const url = new URL('https://a.test/bills/explore?q=x');
		expect(getNextQueryUrl(url, config, defaultState, choices)).toBe('/bills/explore');
	});
});

describe('readQueryState', () => {
	it('round-trips a state through the url', () => {
		const state = {
			searchQuery: 'มติ',
			selectedCheckboxValue: { filterStatus: ['ผ่าน'] },
			selectedComboboxValue: { filterProposerName: 'สส.' }
		};
		const nextUrl = getNextQueryUrl(new URL('https://a.test/x'), config, state, choices);

		expect(readQueryState(new URL(nextUrl!, 'https://a.test'), config, choices)).toEqual(state);
	});

	it('decodes an absent param as every choice selected', () => {
		expect(readQueryState(new URL('https://a.test/x'), config, choices)).toEqual(defaultState);
	});
});
