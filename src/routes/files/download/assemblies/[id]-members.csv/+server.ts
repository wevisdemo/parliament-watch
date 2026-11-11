import { createCsvFileResponse } from '$lib/csv';
import { graphql } from '$lib/politigraph/client';
import { error } from '@sveltejs/kit';

export async function GET({ params }) {
	const {
		organizations: [assembly]
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

	if (!assembly) {
		error(404);
	}

	const { dissolution_date } = assembly;

	const { posts } = await graphql.query({
		posts: {
			__args: {
				where: {
					organization: {
						id: { eq: params.id }
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
				member: {
					on_Person: {
						prefix: true,
						name: true,
						memberships: {
							__args: {
								where: {
									post: {
										organization: {
											classification: { eq: 'POLITICAL_PARTY' }
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
							post: {
								organization: {
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
			memberships.flatMap(({ member, ...restMembership }) => {
				// filter out organization as a member (government/opposition party in assembly)
				if (!member || !('memberships' in member)) return [];

				const {
					memberships: [partyMember],
					...restPeople
				} = member;

				return [
					{
						role,
						...restPeople,
						party: partyMember?.post?.organization?.name,
						...restMembership
					}
				];
			})
		)
	);
}
