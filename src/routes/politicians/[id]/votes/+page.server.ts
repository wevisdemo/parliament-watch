import { graphql } from '$lib/politigraph/client';
import { createSeo } from '$lib/seo/meta';
import { defaultVoteOptions } from '$models/voting';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const {
		people: [politician]
	} = await graphql.query({
		people: {
			__args: {
				where: { id: { eq: params.id } }
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
					voter: {
						id: { eq: politician.id }
					},
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
	});

	const votesWithEvent = votes.flatMap(({ option, vote_event }) =>
		vote_event ? [{ option, vote_event }] : []
	);

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
