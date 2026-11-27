import { graphql } from '$lib/politigraph/client';
import { createSeo } from '$lib/seo/meta';
import { defaultVoteOptions } from '$models/voting';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const {
		people: [person]
	} = await graphql.query({
		__name: 'PoliticianVotesPage',
		people: {
			__args: {
				where: { id: { eq: params.id } }
			},
			id: true,
			prefix: true,
			name: true,
			votes: {
				__args: {
					where: {
						vote_event: {
							organizations: {
								some: {
									classification: { in: ['CABINET', 'HOUSE_OF_REPRESENTATIVE', 'HOUSE_OF_SENATE'] }
								}
							}
						}
					}
				},
				vote_event: {
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
		}
	});

	if (!person) {
		error(404);
	}

	const { votes, ...politician } = person;

	const votesWithEvent = votes
		.flatMap(({ option, vote_event }) => (vote_event ? [{ option, vote_event }] : []))
		.toSorted((a, z) => z.vote_event.start_date.localeCompare(a.vote_event.start_date));

	const filterOptions = {
		assemblies: votesWithEvent
			.flatMap((v) => v.vote_event.organizations)
			.reduce<(typeof votesWithEvent)[number]['vote_event']['organizations']>(
				(uniques, org) => (uniques.some((u) => u.id === org.id) ? uniques : [...uniques, org]),
				[]
			)
			.toSorted((a, z) => a.name.localeCompare(z.name)),
		voteOptions: defaultVoteOptions
	};

	return {
		politician,
		filterOptions,
		votes: votesWithEvent,
		seo: createSeo({
			title: `ประวัติการลงมติ ${politician.name}`,
			description: `ลงมติทั้งหมด ${votesWithEvent.length.toLocaleString()} ครั้ง ค้นหาและกรองตามผลการลงมติ`
		})
	};
}
