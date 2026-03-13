import { decodeQueryState, encodeQueryState, type QueryStateConfig } from '../query-state';
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

		expect(encoded.toString()).toBe(
			'tab=votes&q=%E0%B8%87%E0%B8%9A%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%A1%E0%B8%B2%E0%B8%93&voteType=%E0%B9%80%E0%B8%AB%E0%B9%87%E0%B8%99%E0%B8%94%E0%B9%89%E0%B8%A7%E0%B8%A2&voteType=%E0%B8%87%E0%B8%94%E0%B8%AD%E0%B8%AD%E0%B8%81%E0%B9%80%E0%B8%AA%E0%B8%B5%E0%B8%A2%E0%B8%87&party=%E0%B8%82'
		);

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
					mode: 'flags',
					paramsByValue: { ผ่าน: 'pass', ไม่ผ่าน: 'notPass' },
					fallbackParam: 'result'
				}
			}
		};
		const checkboxChoices = { filterResult: ['ผ่าน', 'ไม่ผ่าน', 'รอตรวจสอบ'] };

		const encoded = encodeQueryState({
			baseSearchParams: new URLSearchParams('tab=votes&q=old&pass=true&notPass=true'),
			config,
			searchQuery: '',
			selectedCheckboxValue: { filterResult: ['ผ่าน', 'ไม่ผ่าน', 'รอตรวจสอบ'] },
			selectedComboboxValue: {},
			checkboxChoices
		});

		expect(encoded.toString()).toBe('tab=votes');
	});

	it('supports pass/notPass flags with fallback values for future results', () => {
		const config: QueryStateConfig = {
			checkbox: {
				filterResult: {
					mode: 'flags',
					paramsByValue: { ผ่าน: 'pass', ไม่ผ่าน: 'notPass' },
					fallbackParam: 'result'
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

		expect(encoded.get('notPass')).toBe('true');
		expect(encoded.getAll('result')).toEqual(['รอตรวจสอบ']);

		const decoded = decodeQueryState({
			searchParams: encoded,
			config,
			checkboxChoices,
			comboboxChoices: {}
		});
		expect(decoded.selectedCheckboxValue.filterResult).toEqual(['ไม่ผ่าน', 'รอตรวจสอบ']);
	});

	it('reads legacy params and normalizes to canonical shape', () => {
		const config: QueryStateConfig = {
			search: { param: 'q', legacyParams: ['search'] },
			checkbox: {
				filterVoteType: {
					mode: 'list',
					param: 'voteType',
					legacyParams: ['votetype']
				}
			}
		};
		const checkboxChoices = { filterVoteType: ['เห็นด้วย', 'ไม่เห็นด้วย', 'ลา / ขาดลงมติ'] };

		const decoded = decodeQueryState({
			searchParams: new URLSearchParams('search=ทดสอบ&votetype=ลา%20/%20ขาดลงมติ'),
			config,
			checkboxChoices,
			comboboxChoices: {}
		});

		expect(decoded.searchQuery).toBe('ทดสอบ');
		expect(decoded.selectedCheckboxValue.filterVoteType).toEqual(['ลา / ขาดลงมติ']);

		const reEncoded = encodeQueryState({
			baseSearchParams: new URLSearchParams('search=ทดสอบ&votetype=ลา%20/%20ขาดลงมติ'),
			config,
			searchQuery: decoded.searchQuery,
			selectedCheckboxValue: decoded.selectedCheckboxValue,
			selectedComboboxValue: {},
			checkboxChoices
		});

		expect(reEncoded.get('q')).toBe('ทดสอบ');
		expect(reEncoded.getAll('voteType')).toEqual(['ลา / ขาดลงมติ']);
		expect(reEncoded.has('search')).toBe(true);
		expect(reEncoded.has('votetype')).toBe(true);
	});

	it('falls back to default checkbox selection when params are unknown', () => {
		const config: QueryStateConfig = {
			checkbox: {
				filterResult: {
					mode: 'flags',
					paramsByValue: { ผ่าน: 'pass', ไม่ผ่าน: 'notPass' },
					fallbackParam: 'result'
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
