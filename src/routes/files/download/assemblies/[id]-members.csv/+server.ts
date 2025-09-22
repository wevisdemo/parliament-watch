import { createCsvFileResponse } from '$lib/csv';
import { graphql } from '$lib/politigraph';

export const prerender = true;

export async function GET({ params }) {
	const {
		organizations: [{ dissolution_date }]
	} = await graphql.query({
		organizations: {
			__args: {
				where: {
					id_EQ: params.id
				}
			},
			dissolution_date: true
		}
	});

	const { posts } = await graphql.query({
		posts: {
			__args: {
				where: {
					organizations_ALL: {
						id_EQ: params.id
					}
				}
			},
			role: true,
			memberships: {
				label: true,
				province: true,
				district_number: true,
				list_number: true,
				start_date: true,
				end_date: true,
				members: {
					on_Person: {
						prefix: true,
						name: true,
						memberships: {
							__args: {
								where: {
									posts_ALL: {
										organizations_ALL: {
											classification_EQ: 'POLITICAL_PARTY'
										}
									},
									...(dissolution_date
										? {
												start_date_LTE: dissolution_date,
												OR: [{ end_date_GTE: dissolution_date }, { end_date_EQ: null }]
											}
										: {
												end_date_EQ: null
											})
								},
								sort: [{ start_date: 'DESC' }],
								limit: 1
							},
							posts: {
								organizations: {
									name: true
								}
							}
						}
					}
				}
			}
		}
	});

	return createCsvFileResponse(
		posts.flatMap(({ role, memberships }) =>
			memberships.flatMap(({ members, ...restMembership }) =>
				members.map(({ memberships: [partyMember], ...restPeople }) => ({
					role,
					...restPeople,
					party: partyMember?.posts[0]?.organizations[0]?.name,
					...restMembership
				}))
			)
		)
	);
}
