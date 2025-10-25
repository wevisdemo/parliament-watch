import { defaultVoteOptions, DefaultVoteOption, DefaultVotingResult } from '$models/voting';

export function getWinningOption(result: string): string {
	switch (result) {
		case DefaultVotingResult.Passed:
			return DefaultVoteOption.Agreed;
		case DefaultVotingResult.Failed:
			return DefaultVoteOption.Disagreed;
		default:
			return result;
	}
}

type VoteGroupResult = {
	name: string;
	resultSummary: Record<string, number>;
};

export interface VoteOptionSlice {
	option: string;
	label: string;
	count: number;
	percentage: number; // 0-1 range
}

export interface VoteGroupSummary {
	name: string;
	total: number;
	options: VoteOptionSlice[];
}

export type HighlightSource = 'result' | 'override';

export interface VotesSummaryHighlight extends VoteOptionSlice {
	source: HighlightSource;
}

export interface VotesSummary {
	total: number;
	optionOrder: string[];
	winnerOption: string | null;
	highlight: VotesSummaryHighlight | null;
	overall: VoteOptionSlice[];
	groups: VoteGroupSummary[];
}

export interface HighlightOverride {
	option: string | null;
	label?: string;
	source?: HighlightSource;
}

export interface BuildVotesSummaryOptions {
	groups?: VoteGroupResult[];
	result?: string | null;
	optionOrder?: string[];
	highlightOverride?: HighlightOverride;
}

export function resolveHighlightOption(
	result: string | null,
	winnerOption?: string | null
): string | null {
	if (result) {
		return getWinningOption(result);
	}

	return winnerOption ?? null;
}

export function buildVotesSummary({
	groups = [],
	result = null,
	optionOrder,
	highlightOverride
}: BuildVotesSummaryOptions): VotesSummary {
	const canonicalOrder = deriveOptionOrder(groups, optionOrder);
	const groupSummaries = groups.map((group) => normalizeGroup(group, canonicalOrder));
	const total = groupSummaries.reduce((sum, { total }) => sum + total, 0);
	const totalsByOption = aggregateTotals(groupSummaries, canonicalOrder);
	const overall = canonicalOrder.map((option) =>
		buildSlice(option, totalsByOption.get(option) ?? 0, total)
	);
	const winnerFromTally = findWinnerByTotals(totalsByOption);
	const winnerOption = result ? getWinningOption(result) : winnerFromTally;
	const highlightOption = highlightOverride?.option ?? resolveHighlightOption(result, winnerOption);
	const highlight = highlightOption
		? {
				...buildSlice(highlightOption, totalsByOption.get(highlightOption) ?? 0, total),
				source: highlightOverride ? highlightOverride.source ?? 'override' : 'result',
				label: highlightOverride?.label ?? highlightOption
			}
		: null;

	return {
		total,
		optionOrder: canonicalOrder,
		winnerOption: winnerOption ?? null,
		highlight,
		overall,
		groups: groupSummaries
	};
}

export function optionsArrayToResultSummary(
	options: { name: string; count: number }[]
): Record<string, number> {
	return options.reduce<Record<string, number>>((acc, { name, count }) => {
		acc[name] = count;
		return acc;
	}, {});
}

function deriveOptionOrder(groups: VoteGroupResult[], preferredOrder?: string[]): string[] {
	const baseOrder = preferredOrder?.length ? [...preferredOrder] : [...defaultVoteOptions];
	const seen = new Set(baseOrder);
	const extras: string[] = [];

	for (const group of groups) {
		for (const option of Object.keys(group.resultSummary)) {
			if (!seen.has(option)) {
				seen.add(option);
				extras.push(option);
			}
		}
	}

	return [...baseOrder, ...extras];
}

function normalizeGroup(group: VoteGroupResult, optionOrder: string[]): VoteGroupSummary {
	const options = optionOrder.map((option) =>
		buildSlice(option, group.resultSummary[option] ?? 0, 0)
	);
	const total = options.reduce((sum, slice) => sum + slice.count, 0);
	const normalized = options.map((slice) => ({
		...slice,
		percentage: total > 0 ? slice.count / total : 0
	}));

	return {
		name: group.name,
		total,
		options: normalized
	};
}

function aggregateTotals(groups: VoteGroupSummary[], optionOrder: string[]): Map<string, number> {
	const totals = new Map(optionOrder.map((option) => [option, 0] as [string, number]));

	for (const group of groups) {
		for (const slice of group.options) {
			totals.set(slice.option, (totals.get(slice.option) ?? 0) + slice.count);
		}
	}

	return totals;
}

function findWinnerByTotals(totals: Map<string, number>): string | null {
	const entries = [...totals.entries()].sort((a, z) => z[1] - a[1]);
	if (!entries.length || entries[0][1] === 0) return null;
	const [, second] = entries;
	return second && second[1] === entries[0][1] ? null : entries[0][0];
}

function buildSlice(option: string, count: number, total: number): VoteOptionSlice {
	return {
		option,
		label: option,
		count,
		percentage: total > 0 ? count / total : 0
	};
}
