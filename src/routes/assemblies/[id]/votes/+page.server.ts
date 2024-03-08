import { fetchAssemblies, fetchFromIdOr404, fetchVotings } from '$lib/datasheets/index.js';
import { getSortedUniqueCategories } from '$lib/datasheets/voting.js';
import { createSeo } from '$lib/seo.js';
import type { Assembly } from '$models/assembly';
import { CATEGORY_NOT_SPECIFIED, DefaultVotingResult, type Voting } from '$models/voting.js';

export type VoteSummary = Pick<Voting, 'id' | 'title' | 'result' | 'date' | 'files' | 'categories'>;

export interface FilterOptions {
	categories: string[];
	result: string[];
}

export type AssemblySummary = Pick<Assembly, 'id' | 'name' | 'term' | 'startedAt'>;

export async function load({ params }) {
	const fullAssembly = await fetchFromIdOr404(fetchAssemblies, params.id);

	const { id, name, term, startedAt } = fullAssembly;
	const assembly: AssemblySummary = { id, name, term, startedAt };

	const votes: VoteSummary[] = (await fetchVotings())
		.filter(({ participatedAssemblies }) =>
			participatedAssemblies.some((pa) => assembly.id === pa.id)
		)
		.sort((a, z) => z.date.getTime() - a.date.getTime())
		.map(({ categories, ...vote }) => ({
			...vote,
			categories: categories.length > 0 ? categories : [CATEGORY_NOT_SPECIFIED]
		}));

	const assemblyIds: string[] = (await fetchAssemblies()).map((item) => item.id);

	const filterOptions: FilterOptions = {
		categories: getSortedUniqueCategories(votes),
		result: [DefaultVotingResult.Passed, DefaultVotingResult.Failed]
	};

	return {
		assemblyIds,
		assembly,
		votes,
		filterOptions,
		seo: createSeo({
			title: `การลงมติ ${assembly.name} ${assembly.term}`
		})
	};
}
