export type QueryParamValue = string | number | boolean;

export interface SearchQueryConfig {
	param?: string;
}

export interface CheckboxListQueryConfig {
	mode: 'list';
	param?: string;
}

export type CheckboxQueryConfig = CheckboxListQueryConfig;

export interface ComboboxQueryConfig {
	param?: string;
}

export interface QueryStateConfig {
	search?: SearchQueryConfig;
	checkbox?: Record<string, CheckboxQueryConfig>;
	combobox?: Record<string, ComboboxQueryConfig>;
}

export interface EncodeQueryStateInput {
	baseSearchParams: URLSearchParams;
	config: QueryStateConfig;
	searchQuery: string;
	selectedCheckboxValue: Record<string, QueryParamValue[]>;
	selectedComboboxValue: Record<string, QueryParamValue | undefined>;
	checkboxChoices: Record<string, QueryParamValue[]>;
}

export interface DecodeQueryStateInput {
	searchParams: URLSearchParams;
	config: QueryStateConfig;
	defaultSearchQuery?: string;
	checkboxChoices: Record<string, QueryParamValue[]>;
	comboboxChoices: Record<string, QueryParamValue[]>;
}

export interface DecodeQueryStateResult {
	searchQuery: string;
	selectedCheckboxValue: Record<string, QueryParamValue[]>;
	selectedComboboxValue: Record<string, QueryParamValue | undefined>;
}

const DEFAULT_SEARCH_PARAM = 'q';

const normalizeValue = (value: QueryParamValue) => String(value);

const valueLookup = (choices: QueryParamValue[]) =>
	new Map(choices.map((value) => [normalizeValue(value), value]));

const isDefaultSelection = (selectedValues: QueryParamValue[], allValues: QueryParamValue[]) => {
	if (selectedValues.length !== allValues.length) return false;
	const selectedSet = new Set(selectedValues.map(normalizeValue));
	return allValues.every((value) => selectedSet.has(normalizeValue(value)));
};

const dedupeValues = (values: QueryParamValue[]) => {
	const output: QueryParamValue[] = [];
	const seen = new Set<string>();
	for (const value of values) {
		const normalized = normalizeValue(value);
		if (seen.has(normalized)) continue;
		seen.add(normalized);
		output.push(value);
	}
	return output;
};

const collectListParamValues = (searchParams: URLSearchParams, param: string) =>
	dedupeValues(searchParams.getAll(param));

export function encodeQueryState({
	baseSearchParams,
	config,
	searchQuery,
	selectedCheckboxValue,
	selectedComboboxValue,
	checkboxChoices
}: EncodeQueryStateInput): URLSearchParams {
	const next = new URLSearchParams(baseSearchParams);

	const searchParam = config.search?.param ?? DEFAULT_SEARCH_PARAM;
	const trimmedSearch = searchQuery.trim();
	if (trimmedSearch) next.set(searchParam, trimmedSearch);
	else next.delete(searchParam);

	for (const [groupKey, choices] of Object.entries(checkboxChoices)) {
		const groupConfig = config.checkbox?.[groupKey] ?? { mode: 'list', param: groupKey };
		const selectedValues = selectedCheckboxValue[groupKey] ?? choices;

		const listParam = groupConfig.param ?? groupKey;
		next.delete(listParam);
		if (isDefaultSelection(selectedValues, choices)) continue;
		for (const selected of selectedValues) next.append(listParam, normalizeValue(selected));
	}

	for (const [groupKey, selectedValue] of Object.entries(selectedComboboxValue)) {
		const groupConfig = config.combobox?.[groupKey] ?? { param: groupKey };
		const param = groupConfig.param ?? groupKey;
		next.delete(param);
		if (selectedValue !== undefined) next.set(param, normalizeValue(selectedValue));
	}

	return next;
}

export function decodeQueryState({
	searchParams,
	config,
	defaultSearchQuery = '',
	checkboxChoices,
	comboboxChoices
}: DecodeQueryStateInput): DecodeQueryStateResult {
	const searchParam = config.search?.param ?? DEFAULT_SEARCH_PARAM;
	const searchQuery = searchParams.get(searchParam)?.trim();

	const selectedCheckboxValue: Record<string, QueryParamValue[]> = {};
	for (const [groupKey, choices] of Object.entries(checkboxChoices)) {
		const groupConfig = config.checkbox?.[groupKey] ?? { mode: 'list', param: groupKey };
		const lookup = valueLookup(choices);

		const listParam = groupConfig.param ?? groupKey;
		const listValues = collectListParamValues(searchParams, listParam);
		if (listValues.length === 0) {
			selectedCheckboxValue[groupKey] = choices;
			continue;
		}

		selectedCheckboxValue[groupKey] = listValues
			.map((value) => lookup.get(String(value)))
			.filter((value): value is QueryParamValue => value !== undefined);
	}

	const selectedComboboxValue: Record<string, QueryParamValue | undefined> = {};
	for (const [groupKey, choices] of Object.entries(comboboxChoices)) {
		const lookup = valueLookup(choices);
		const groupConfig = config.combobox?.[groupKey] ?? { param: groupKey };
		const param = groupConfig.param ?? groupKey;
		const value = searchParams.get(param);
		selectedComboboxValue[groupKey] =
			value === null || value === undefined ? undefined : lookup.get(value);
	}

	return {
		searchQuery: searchQuery ?? defaultSearchQuery,
		selectedCheckboxValue,
		selectedComboboxValue
	};
}
