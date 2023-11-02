import { DefaultVotingResult, type Voting } from '$models/voting.js';
import type { Assembly } from '$models/assembly';
import { rep26, sen12 } from '../../../../mocks/data/assembly.js';
import { mockCategory, passedVoting } from '../../../../mocks/data/voting.js';

export type VoteSummary = Pick<Voting, 'id' | 'title' | 'result' | 'date' | 'files' | 'categories'>;

export interface FilterOptions {
	categories: string[];
}

export type AssemblySummary = Pick<Assembly, 'id' | 'name' | 'term' | 'startedAt'>;

export async function load({ params }) {
	const { id, name, term, startedAt } = params.id === sen12.id ? sen12 : rep26;

	const assembly: AssemblySummary = { id, name, term, startedAt };

	const filterOptions: FilterOptions = {
		categories: mockCategory
	};

	const votes: VoteSummary[] = new Array(100).fill(passedVoting).map(({ title, date }, i) => ({
		id: i,
		title: i % 2 ? title : title + ' ทดสอบ',
		date,
		categories: [mockCategory[i % mockCategory.length]],
		result: i % 3 ? DefaultVotingResult.Passed : DefaultVotingResult.Failed,
		files: i % 2 ? [{ label: 'some file', url: '/' }] : []
	}));

	return { assembly, filterOptions, votes };
}
