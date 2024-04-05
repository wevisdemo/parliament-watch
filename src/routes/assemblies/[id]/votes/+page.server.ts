import type { AvailableAssembly } from '$components/Assemblies/AssemblyIdRunner.svelte';
import { fetchAssemblies, fetchFromIdOr404, fetchVotings } from '$lib/datasheets/index.js';
import { createSeo } from '$lib/seo.js';
import type { Assembly } from '$models/assembly';
import { DefaultVotingResult, type Voting } from '$models/voting.js';

export type VoteSummary = Pick<Voting, 'id' | 'nickname' | 'result' | 'date' | 'files'>;

export interface FilterOptions {
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
		.sort((a, z) => z.date.getTime() - a.date.getTime());

	const availableAssemblies: AvailableAssembly[] = (await fetchAssemblies()).map((a) => ({
		id: a.id,
		name: a.name,
		term: a.term
	}));

	const filterOptions: FilterOptions = {
		result: [DefaultVotingResult.Passed, DefaultVotingResult.Failed]
	};

	return {
		availableAssemblies,
		assembly,
		votes,
		filterOptions,
		seo: createSeo({
			title: `การลงมติ ${assembly.name} ${assembly.term}`
		})
	};
}
