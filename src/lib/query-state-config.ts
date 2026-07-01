import type {
	CheckboxFlagsQueryConfig,
	CheckboxListQueryConfig,
	ComboboxQueryConfig,
	QueryStateConfig
} from '$lib/query-state';

export const CANONICAL_SEARCH_PARAM = 'q';
export const DEFAULT_SEARCH_QUERY_CONFIG = {
	param: CANONICAL_SEARCH_PARAM
} as const;

export function listCheckboxQueryConfig(param: string): CheckboxListQueryConfig {
	return {
		mode: 'list',
		param
	};
}

export function flagsCheckboxQueryConfig(
	paramsByValue: CheckboxFlagsQueryConfig['paramsByValue'],
	options?: Pick<CheckboxFlagsQueryConfig, 'fallbackParam'>
): CheckboxFlagsQueryConfig {
	return {
		mode: 'flags',
		paramsByValue,
		...(options ?? {})
	};
}

export function comboboxQueryConfig(param: string): ComboboxQueryConfig {
	return {
		param
	};
}

export function buildVoteQueryStateConfig({
	checkbox,
	combobox
}: Pick<QueryStateConfig, 'checkbox' | 'combobox'>): QueryStateConfig {
	return {
		search: DEFAULT_SEARCH_QUERY_CONFIG,
		checkbox,
		combobox
	};
}
