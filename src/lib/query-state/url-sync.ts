import {
	decodeQueryState,
	encodeQueryState,
	type QueryParamValue,
	type QueryStateConfig
} from './codec';

export interface FilterGroupChoices {
	key: string;
	values: QueryParamValue[];
}

export interface FilterState {
	searchQuery: string;
	selectedCheckboxValue: Record<string, QueryParamValue[]>;
	selectedComboboxValue: Record<string, QueryParamValue | undefined>;
}

export interface QueryStateChoices {
	checkbox: FilterGroupChoices[];
	combobox: FilterGroupChoices[];
}

const toChoiceRecord = (groups: FilterGroupChoices[]): Record<string, QueryParamValue[]> =>
	Object.fromEntries(groups.map(({ key, values }) => [key, values]));

export function normalizeQueryStateConfig(
	config: QueryStateConfig | undefined,
	{ checkbox, combobox }: QueryStateChoices
): QueryStateConfig {
	return {
		search: config?.search,
		checkbox: Object.fromEntries(
			checkbox.map(({ key }) => [key, config?.checkbox?.[key] ?? { mode: 'list', param: key }])
		),
		combobox: Object.fromEntries(
			combobox.map(({ key }) => [key, config?.combobox?.[key] ?? { param: key }])
		)
	};
}

/** Returns the url to navigate to, or `null` when the current url already matches the state. */
export function getNextQueryUrl(
	url: URL,
	config: QueryStateConfig,
	state: FilterState,
	choices: QueryStateChoices
): string | null {
	const encoded = encodeQueryState({
		baseSearchParams: url.searchParams,
		config,
		searchQuery: state.searchQuery,
		selectedCheckboxValue: state.selectedCheckboxValue,
		selectedComboboxValue: state.selectedComboboxValue,
		checkboxChoices: toChoiceRecord(choices.checkbox)
	});

	const nextSearch = encoded.toString();
	if (nextSearch === url.searchParams.toString()) return null;

	return `${url.pathname}${nextSearch ? `?${nextSearch}` : ''}${url.hash}`;
}

export function readQueryState(
	url: URL,
	config: QueryStateConfig,
	choices: QueryStateChoices,
	defaultSearchQuery = ''
): FilterState {
	return decodeQueryState({
		searchParams: url.searchParams,
		config,
		defaultSearchQuery,
		checkboxChoices: toChoiceRecord(choices.checkbox),
		comboboxChoices: toChoiceRecord(choices.combobox)
	});
}
