import { slugify } from '$lib/slug';
import { Table, Column, type RowType } from 'sheethuahua';

export const voteTable = Table('Votes', {
	politicianId: Column.String(),
	votingId: Column.String(),
	voteOption: Column.String()
});

export const transformVote = ({ votingId, ...votes }: RowType<typeof voteTable>) => ({
	votingId: slugify(votingId),
	...votes
});

export type Vote = ReturnType<typeof transformVote>;
