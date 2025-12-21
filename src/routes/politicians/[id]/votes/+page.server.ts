import { graphql } from '$lib/politigraph/server';
import { createSeo } from '$lib/seo';
import { defaultVoteOptions } from '$models/voting';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const {
		people: [politician]
	} = await graphql.query({
		people: {
			__args: {
				where: { id_EQ: params.id }
			},
			id: true,
			prefix: true,
			name: true
		}
	});

	if (!politician) {
		error(404);
	}

	const { votes } = await graphql.query({
		votes: {
			__args: {
				where: {
					voters_ALL: {
						id_EQ: politician.id
					},
					vote_events_ALL: {
						organizations_ALL: {
							classification_IN: ['CABINET', 'HOUSE_OF_REPRESENTATIVE', 'HOUSE_OF_SENATE']
						}
					}
				}
			},
			vote_events: {
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
				},
				organizations: {
					id: true,
					name: true,
					founding_date: true,
					dissolution_date: true
				}
			},
			option: true
		}
	});

	const filterOptions = {
		assemblies: votes
			.flatMap((v) => v.vote_events[0].organizations)
			.reduce<(typeof votes)[number]['vote_events'][number]['organizations']>(
				(uniques, org) => (uniques.some((u) => u.id === org.id) ? uniques : [...uniques, org]),
				[]
			)
			.sort((a, z) => a.name.localeCompare(z.name)),
		voteOptions: defaultVoteOptions
	};

	return {
		politician,
		filterOptions,
		votes,
		seo: createSeo({
			title: `ประวัติการลงมติ ${politician.name}`
		})
	};
}
