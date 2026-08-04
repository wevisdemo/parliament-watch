import {
	findHighestVote,
	sumVotesByOption,
	type AffiliationParty
} from '$lib/politigraph/vote/affiliation';
import { describe, expect, it } from 'vitest';

const parties: AffiliationParty[] = [
	{
		name: 'พรรค ก',
		count: 3,
		options: [
			{ name: 'เห็นด้วย', count: 2 },
			{ name: 'ไม่เห็นด้วย', count: 1 }
		]
	},
	{
		name: 'พรรค ข',
		count: 4,
		options: [
			{ name: 'เห็นด้วย', count: 1 },
			{ name: 'ไม่เห็นด้วย', count: 3 }
		]
	}
];

describe('sumVotesByOption', () => {
	it('should sum the count of each option across parties', () => {
		expect(sumVotesByOption(parties)).toEqual([
			{ name: 'เห็นด้วย', count: 3 },
			{ name: 'ไม่เห็นด้วย', count: 4 }
		]);
	});

	it('should return an empty list when there is no party', () => {
		expect(sumVotesByOption([])).toEqual([]);
	});
});

describe('findHighestVote', () => {
	it('should return the option with the most votes', () => {
		expect(findHighestVote(sumVotesByOption(parties))).toEqual({ name: 'ไม่เห็นด้วย', count: 4 });
	});

	it('should keep the first option when counts tie', () => {
		expect(
			findHighestVote([
				{ name: 'เห็นด้วย', count: 2 },
				{ name: 'ไม่เห็นด้วย', count: 2 }
			])
		).toEqual({ name: 'เห็นด้วย', count: 2 });
	});

	it('should return undefined when there is no vote', () => {
		expect(findHighestVote(sumVotesByOption([]))).toBeUndefined();
	});
});
