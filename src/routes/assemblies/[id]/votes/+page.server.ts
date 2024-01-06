import { DefaultVotingResult, type Voting } from '$models/voting.js';
import type { Assembly } from '$models/assembly';
import { mockCategory, passedVoting } from '../../../../mocks/data/voting.js';
import { fetchAssemblies } from '$lib/datasheets/index.js';
import { error } from '@sveltejs/kit';
import { createSeo } from '../../../../utils/seo.js';

export type VoteSummary = Pick<Voting, 'id' | 'title' | 'result' | 'date' | 'files' | 'categories'>;

export interface FilterOptions {
	categories: string[];
	result: string[];
}

export type AssemblySummary = Pick<Assembly, 'id' | 'name' | 'term' | 'startedAt'>;

export async function load({ params }) {
	const fullAssembly = (await fetchAssemblies()).find(({ id }) => id === params.id);

	if (!fullAssembly) {
		throw error(404, `Assembly ${params.id} not found`);
	}

	const { id, name, term, startedAt } = fullAssembly;
	const assembly: AssemblySummary = { id, name, term, startedAt };

	const votes: VoteSummary[] = new Array(100).fill(passedVoting).map(({ title, date }, i) => ({
		id: i,
		title: i % 2 ? title : title + ' ทดสอบ',
		date,
		categories: [mockCategory[i % mockCategory.length]],
		result: i % 3 ? DefaultVotingResult.Passed : DefaultVotingResult.Failed,
		files: i % 2 ? [{ label: 'some file', url: '/' }] : []
	}));

	const assemblyIds: string[] = (await fetchAssemblies()).map((item) => item.id);

	return {
		assemblyIds,
		assembly,
		votes,
		seo: createSeo({
			title: `การลงมติ ${assembly.name} ${assembly.term} - Parliament Watch`
		})
	};
}
