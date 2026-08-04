import {
	buildVotesSummary,
	deriveOptionOrder,
	findWinnerByTotals,
	getWinningOption,
	optionsArrayToResultSummary,
	resolveHighlightOption
} from '$lib/vote-summary';
import { DefaultVoteOption, DefaultVotingResult, defaultVoteOptions } from '$models/voting';
import { describe, expect, it } from 'vitest';

const { Agreed, Disagreed, Abstain, Novote, Absent } = DefaultVoteOption;

describe('findWinnerByTotals', () => {
	it('returns the option with the most votes', () => {
		expect(
			findWinnerByTotals(
				new Map([
					[Agreed, 10],
					[Disagreed, 4]
				])
			)
		).toBe(Agreed);
	});

	it('returns null when the top two options tie', () => {
		expect(
			findWinnerByTotals(
				new Map([
					[Agreed, 7],
					[Disagreed, 7],
					[Abstain, 1]
				])
			)
		).toBeNull();
	});

	it('returns null when every option has zero votes', () => {
		expect(
			findWinnerByTotals(
				new Map([
					[Agreed, 0],
					[Disagreed, 0]
				])
			)
		).toBeNull();
	});

	it('returns null for an empty tally', () => {
		expect(findWinnerByTotals(new Map())).toBeNull();
	});
});

describe('deriveOptionOrder', () => {
	it('appends custom options after the default five', () => {
		const order = deriveOptionOrder([
			{ name: 'สส.', resultSummary: { [Agreed]: 1, ไม่ประสงค์ลงคะแนน: 2 } },
			{ name: 'สว.', resultSummary: { ไม่ประสงค์ลงคะแนน: 1, ขาดประชุม: 3 } }
		]);

		expect(order).toEqual([...defaultVoteOptions, 'ไม่ประสงค์ลงคะแนน', 'ขาดประชุม']);
	});

	it('uses the preferred order as the base when given', () => {
		expect(
			deriveOptionOrder([{ name: 'สส.', resultSummary: { custom: 1 } }], [Agreed, Disagreed])
		).toEqual([Agreed, Disagreed, 'custom']);
	});
});

describe('resolveHighlightOption', () => {
	it('maps a result to its winning option', () => {
		expect(resolveHighlightOption(DefaultVotingResult.Passed)).toBe(Agreed);
		expect(resolveHighlightOption(DefaultVotingResult.Failed)).toBe(Disagreed);
	});

	it('falls back to the tallied winner when there is no result', () => {
		expect(resolveHighlightOption(null, Abstain)).toBe(Abstain);
		expect(resolveHighlightOption(null)).toBeNull();
	});
});

describe('getWinningOption', () => {
	it('passes through non-default results', () => {
		expect(getWinningOption('รอตรวจสอบ')).toBe('รอตรวจสอบ');
	});
});

describe('optionsArrayToResultSummary', () => {
	it('maps counted options into a record', () => {
		expect(
			optionsArrayToResultSummary([
				{ name: Agreed, count: 3 },
				{ name: Novote, count: 1 }
			])
		).toEqual({ [Agreed]: 3, [Novote]: 1 });
	});
});

describe('buildVotesSummary', () => {
	const groups = [
		{ name: 'สส.ฝ่ายรัฐบาล', resultSummary: { [Agreed]: 6, [Disagreed]: 2 } },
		{ name: 'สส.ฝ่ายค้าน', resultSummary: { [Agreed]: 1, [Disagreed]: 1 } }
	];

	it('aggregates totals and percentages across groups', () => {
		const summary = buildVotesSummary({ groups });

		expect(summary.total).toBe(10);
		expect(summary.overall.find((slice) => slice.option === Agreed)).toMatchObject({
			count: 7,
			percentage: 0.7
		});
		expect(summary.groups[1]).toMatchObject({ name: 'สส.ฝ่ายค้าน', total: 2 });
		expect(summary.groups[1].options.find((slice) => slice.option === Disagreed)?.percentage).toBe(
			0.5
		);
	});

	it('takes the winner from the result even when the tally disagrees', () => {
		const summary = buildVotesSummary({ groups, result: DefaultVotingResult.Failed });

		expect(summary.winnerOption).toBe(Disagreed);
		expect(summary.highlight).toMatchObject({ option: Disagreed, count: 3, percentage: 0.3 });
	});

	it('highlights a result option with zero votes', () => {
		const summary = buildVotesSummary({
			groups: [{ name: 'สส.', resultSummary: { [Agreed]: 4 } }],
			result: DefaultVotingResult.Failed
		});

		expect(summary.highlight).toMatchObject({
			option: Disagreed,
			count: 0,
			percentage: 0
		});
	});

	it('falls back to the tallied winner and null-highlights a tie', () => {
		const tied = buildVotesSummary({
			groups: [{ name: 'สส.', resultSummary: { [Agreed]: 2, [Disagreed]: 2 } }]
		});

		expect(tied.winnerOption).toBeNull();
		expect(tied.highlight).toBeNull();
	});

	it('normalizes an all-zero group to zero percentages', () => {
		const summary = buildVotesSummary({
			groups: [{ name: 'สว.', resultSummary: { [Agreed]: 0, [Absent]: 0 } }]
		});

		expect(summary.total).toBe(0);
		expect(summary.groups[0].total).toBe(0);
		expect(summary.groups[0].options.every((slice) => slice.percentage === 0)).toBe(true);
		expect(summary.winnerOption).toBeNull();
		expect(summary.highlight).toBeNull();
	});

	it('returns an empty summary with the default option order when no group is given', () => {
		const summary = buildVotesSummary({});

		expect(summary).toMatchObject({ total: 0, optionOrder: defaultVoteOptions, groups: [] });
		expect(summary.overall.map((slice) => slice.count)).toEqual([0, 0, 0, 0, 0]);
	});
});
