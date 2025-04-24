import { fetchVotings } from '$lib/datasheets/index.js';
import { graphql } from '$lib/politigraph';
import { createSeo } from '$lib/seo.js';
import { DefaultVotingResult, type Voting } from '$models/voting.js';
import { error } from '@sveltejs/kit';

export type VoteSummary = Pick<Voting, 'id' | 'nickname' | 'result' | 'date' | 'files'>;

export interface FilterOptions {
	result: string[];
}

export async function load({ params }) {
	const {
		organizations: [assembly]
	} = await graphql.query({
		organizations: {
			__args: {
				where: {
					id_EQ: params.id
				}
			},
			classification: true,
			id: true,
			name: true,
			term: true,
			founding_date: true
		}
	});

	if (!assembly) {
		error(404);
	}

	const { organizations: availableAssemblies } = await graphql.query({
		organizations: {
			__args: {
				where: {
					classification_EQ: assembly.classification
				}
			},
			id: true,
			term: true
		}
	});

	const votes: VoteSummary[] = (await fetchVotings())
		.filter(({ participatedAssemblies }) =>
			participatedAssemblies.some((pa) => assembly.id === pa.id)
		)
		.sort((a, z) => z.date.getTime() - a.date.getTime());

	const filterOptions: FilterOptions = {
		result: [DefaultVotingResult.Passed, DefaultVotingResult.Failed]
	};

	return {
		availableAssemblies,
		assembly,
		votes,
		filterOptions,
		seo: createSeo({
			title: `การลงมติ ${assembly.name}`
		})
	};
}
