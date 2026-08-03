import type { QueryParamValue } from './codec';

export type FilterValue = QueryParamValue;

export interface FilterEditedInput {
	searchQuery: string;
	selectedCheckboxValue: Record<string, FilterValue[]>;
	selectedComboboxValue: Record<string, FilterValue | undefined>;
	checkboxChoicesCount: number;
}

export function clampPage(page: number, pageSize: number, totalRows: number): number {
	if (page <= 1 || pageSize <= 0) return 1;
	return Math.min(page, Math.max(1, Math.ceil(totalRows / pageSize)));
}

export function isComboboxValueSelected(value: FilterValue | undefined): boolean {
	return value !== undefined && value !== '';
}

export function isFilterEdited({
	searchQuery,
	selectedCheckboxValue,
	selectedComboboxValue,
	checkboxChoicesCount
}: FilterEditedInput): boolean {
	return (
		searchQuery.trim().length > 0 ||
		Object.values(selectedCheckboxValue).flat().length < checkboxChoicesCount ||
		Object.values(selectedComboboxValue).some(isComboboxValueSelected)
	);
}
