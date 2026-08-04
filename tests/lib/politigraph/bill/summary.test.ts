import {
	summarizeBillsByProposerType,
	summarizeBillsByStatus,
	type BillForSummary
} from '$lib/politigraph/bill/summary';
import { describe, expect, it } from 'vitest';

const bill = (
	id: string,
	status: BillForSummary['status'],
	creator_type: BillForSummary['creator_type'],
	proposal_date: string
): BillForSummary => ({
	id,
	title: `ร่าง ${id}`,
	nickname: null,
	status,
	proposal_date,
	creator_type
});

const bills: BillForSummary[] = [
	bill('a', 'IN_PROGRESS', 'POLITICIAN', '2024-05-01'),
	bill('b', 'IN_PROGRESS', 'POLITICIAN', '2024-04-01'),
	bill('c', 'IN_PROGRESS', 'ASSEMBLY', '2024-03-01'),
	bill('d', 'IN_PROGRESS', 'POLITICIAN', '2024-02-01'),
	bill('e', 'ENACTED', 'PEOPLE', '2024-01-01')
];

describe('summarizeBillsByStatus', () => {
	it('counts every status and keeps at most three samples in input order', () => {
		const summary = summarizeBillsByStatus(bills);

		expect(summary.map(({ status, count }) => [status, count])).toEqual([
			['IN_PROGRESS', 4],
			['ENACTED', 1],
			['REJECTED', 0],
			['MERGED', 0]
		]);
		expect(summary[0].samples.map(({ id }) => id)).toEqual(['a', 'b', 'c']);
	});
});

describe('summarizeBillsByProposerType', () => {
	it('summarizes each proposer type with its per-status counts', () => {
		const summary = summarizeBillsByProposerType(bills);
		const politician = summary.find(({ proposerType }) => proposerType === 'POLITICIAN');

		expect(politician?.count).toBe(3);
		expect(politician?.countByStatus).toEqual({
			IN_PROGRESS: 3,
			ENACTED: 0,
			REJECTED: 0,
			MERGED: 0
		});
		expect(politician?.samples.map(({ id }) => id)).toEqual(['a', 'b', 'd']);
		expect(summary.find(({ proposerType }) => proposerType === 'UNKNOWN')?.count).toBe(0);
	});
});
