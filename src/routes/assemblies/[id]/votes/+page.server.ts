import { graphql } from '$lib/politigraph';
import { createSeo } from '$lib/seo';
import { DefaultVotingResult, RESULT_CONFIRMATION_PENDING } from '$models/voting';
import { error } from '@sveltejs/kit';

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

	const { organizations: availableAssemblies, voteEvents } = await graphql.query({
		organizations: {
			__args: {
				where: {
					classification_EQ: assembly.classification
				}
			},
			id: true,
			term: true
		},
		voteEvents: {
			__args: {
				where: {
					organizations_SOME: {
						id_EQ: assembly.id
					}
				},
				sort: [
					{
						start_date: 'DESC'
					}
				]
			},
			id: true,
			title: true,
			nickname: true,
			result: true,
			start_date: true,
			links: {
				__args: {
					sort: [{ note: 'ASC' }]
				},
				__scalar: true
			}
		}
	});

	const eventsWithNotNullResult = voteEvents.map((event) => ({
		...event,
		result: event.result ?? RESULT_CONFIRMATION_PENDING
	}));

	const filterOptions = {
		result: eventsWithNotNullResult.reduce<string[]>(
			(uniques, { result }) => (uniques.includes(result) ? uniques : [...uniques, result]),
			[DefaultVotingResult.Passed, DefaultVotingResult.Failed]
		)
	};

	return {
		availableAssemblies,
		assembly,
		voteEvents: eventsWithNotNullResult,
		filterOptions,
		seo: createSeo({
			title: `การลงมติ ${assembly.name}`
		})
	};
}
