import { createCsvFileResponse } from '$lib/csv';
import { graphql } from '$lib/politigraph/server';

export const prerender = true;

export async function GET({ params }) {
	const {
		organizations: [{ dissolution_date }]
	} = await graphql.query({
		organizations: {
			__args: {
				where: {
					id: { eq: params.id }
				}
			},
			dissolution_date: true
		}
	});

	const { posts } = await graphql.query({
		posts: {
			__args: {
				where: {
					organizations: {
						some: {
							id: { eq: params.id }
						}
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
									posts: {
										some: {
											organizations: {
												some: {
													classification: { eq: 'POLITICAL_PARTY' }
												}
											}
										}
									},
									...(dissolution_date
										? {
												start_date: { lte: dissolution_date },
												OR: [{ end_date: { gte: dissolution_date } }, { end_date: { eq: null } }]
											}
										: {
												end_date: { eq: null }
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
				members
					// filter out organization as a member (government/opposition party in assembly)
					.filter((m) => m.memberships)
					.map(({ memberships: [partyMember], ...restPeople }) => ({
						role,
						...restPeople,
						party: partyMember?.posts[0]?.organizations[0]?.name,
						...restMembership
					}))
			)
		)
	);
}
