import { decodeQueryState, encodeQueryState, type QueryStateConfig } from '$lib/query-state/codec';
import { describe, expect, it } from 'vitest';

describe('query-state codec', () => {
	it('encodes and decodes roundtrip for search, checkbox list, and combobox', () => {
		const config: QueryStateConfig = {
			search: { param: 'q' },
			checkbox: {
				filterVoteType: { mode: 'list', param: 'voteType' }
			},
			combobox: {
				filterParty: { param: 'party' }
			}
		};
		const checkboxChoices = { filterVoteType: ['เห็นด้วย', 'ไม่เห็นด้วย', 'งดออกเสียง'] };
		const comboboxChoices = { filterParty: ['ก', 'ข', 'ค'] };

		const encoded = encodeQueryState({
			baseSearchParams: new URLSearchParams('tab=votes'),
			config,
			searchQuery: ' งบประมาณ ',
			selectedCheckboxValue: { filterVoteType: ['เห็นด้วย', 'งดออกเสียง'] },
			selectedComboboxValue: { filterParty: 'ข' },
			checkboxChoices
		});

		const expected = new URLSearchParams();
		expected.set('tab', 'votes');
		expected.set('q', 'งบประมาณ');
		expected.append('voteType', 'เห็นด้วย');
		expected.append('voteType', 'งดออกเสียง');
		expected.set('party', 'ข');
		expect(encoded.toString()).toBe(expected.toString());

		const decoded = decodeQueryState({
			searchParams: encoded,
			config,
			checkboxChoices,
			comboboxChoices
		});

		expect(decoded.searchQuery).toBe('งบประมาณ');
		expect(decoded.selectedCheckboxValue.filterVoteType).toEqual(['เห็นด้วย', 'งดออกเสียง']);
		expect(decoded.selectedComboboxValue.filterParty).toBe('ข');
	});

	it('clears default state params but preserves unrelated params', () => {
		const config: QueryStateConfig = {
			search: { param: 'q' },
			checkbox: {
				filterResult: {
					mode: 'list',
					param: 'result'
				}
			}
		};
		const checkboxChoices = { filterResult: ['ผ่าน', 'ไม่ผ่าน', 'รอตรวจสอบ'] };

		const encoded = encodeQueryState({
			baseSearchParams: new URLSearchParams('tab=votes&q=old&result=ผ่าน&result=ไม่ผ่าน'),
			config,
			searchQuery: '',
			selectedCheckboxValue: { filterResult: ['ผ่าน', 'ไม่ผ่าน', 'รอตรวจสอบ'] },
			selectedComboboxValue: {},
			checkboxChoices
		});

		expect(encoded.toString()).toBe('tab=votes');
	});

	it('encodes list checkbox with non-default selection', () => {
		const config: QueryStateConfig = {
			checkbox: {
				filterResult: {
					mode: 'list',
					param: 'result'
				}
			}
		};
		const checkboxChoices = { filterResult: ['ผ่าน', 'ไม่ผ่าน', 'รอตรวจสอบ'] };

		const encoded = encodeQueryState({
			baseSearchParams: new URLSearchParams(),
			config,
			searchQuery: '',
			selectedCheckboxValue: { filterResult: ['ไม่ผ่าน', 'รอตรวจสอบ'] },
			selectedComboboxValue: {},
			checkboxChoices
		});

		expect(encoded.getAll('result')).toEqual(['ไม่ผ่าน', 'รอตรวจสอบ']);

		const decoded = decodeQueryState({
			searchParams: encoded,
			config,
			checkboxChoices,
			comboboxChoices: {}
		});
		expect(decoded.selectedCheckboxValue.filterResult).toEqual(['ไม่ผ่าน', 'รอตรวจสอบ']);
	});

	it('encodes canonical params and does not emit legacy keys', () => {
		const config: QueryStateConfig = {
			search: { param: 'q' },
			checkbox: {
				filterVoteType: {
					mode: 'list',
					param: 'voteType'
				}
			}
		};
		const checkboxChoices = { filterVoteType: ['เห็นด้วย', 'ไม่เห็นด้วย', 'ลา / ขาดลงมติ'] };

		const reEncoded = encodeQueryState({
			baseSearchParams: new URLSearchParams(),
			config,
			searchQuery: 'ทดสอบ',
			selectedCheckboxValue: { filterVoteType: ['ลา / ขาดลงมติ'] },
			selectedComboboxValue: {},
			checkboxChoices
		});

		expect(reEncoded.get('q')).toBe('ทดสอบ');
		expect(reEncoded.getAll('voteType')).toEqual(['ลา / ขาดลงมติ']);
		expect(reEncoded.has('search')).toBe(false);
		expect(reEncoded.has('votetype')).toBe(false);
	});

	it('falls back to empty selection when params are unknown', () => {
		const config: QueryStateConfig = {
			checkbox: {
				filterResult: {
					mode: 'list',
					param: 'result'
				}
			}
		};
		const checkboxChoices = { filterResult: ['ผ่าน', 'ไม่ผ่าน', 'รอตรวจสอบ'] };

		const decoded = decodeQueryState({
			searchParams: new URLSearchParams('result=ไม่รู้จัก'),
			config,
			checkboxChoices,
			comboboxChoices: {}
		});

		expect(decoded.selectedCheckboxValue.filterResult).toEqual([]);
	});
});
