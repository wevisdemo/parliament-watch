import { graphql } from '$lib/politigraph';
import { createSeo } from '$lib/seo';
import { error } from '@sveltejs/kit';

export async function entries() {
	return (await graphql.query({ bills: { id: true } })).bills;
}

export async function load({ params }) {
	const {
		bills: [bill]
	} = await graphql.query({
		bills: {
			__args: {
				where: {
					id_EQ: params.id
				},
				limit: 1
			},
			id: true,
			title: true,
			nickname: true,
			status: true,
			proposal_date: true,
			text: true,
			categories: true,
			links: {
				url: true,
				note: true
			}
		}
	});

	if (!bill) {
		error(404);
	}

	const {
		bills: [{ creators, co_proposers, people_signature_count }]
	} = await graphql.query({
		bills: {
			__args: {
				where: {
					id_EQ: params.id
				},
				limit: 1
			},
			creators: {
				__typename: true,
				on_Organization: {
					id: true,
					name: true,
					founding_date: true
				},
				on_Person: {
					id: true,
					name: true,
					image: true,
					memberships: {
						__args: {
							where: {
								start_date_LTE: bill.proposal_date,
								OR: [{ end_date_EQ: null }, { end_date_GTE: bill.proposal_date }],
								posts_SOME: {
									organizations_SOME: {
										classification_IN: [
											'CABINET',
											'HOUSE_OF_REPRESENTATIVE',
											'HOUSE_OF_SENATE',
											'POLITICAL_PARTY'
										]
									}
								}
							}
						},
						posts: {
							label: true,
							organizations: {
								id: true,
								classification: true,
								name: true,
								image: true,
								founding_date: true
							}
						}
					}
				}
			},
			co_proposers: {
				__args: {
					sort: [{ firstname: 'ASC', lastname: 'ASC' }]
				},
				id: true,
				name: true,
				memberships: {
					__args: {
						where: {
							start_date_LTE: bill.proposal_date,
							OR: [{ end_date_EQ: null }, { end_date_GTE: bill.proposal_date }],
							posts_SOME: {
								organizations_SOME: {
									classification_EQ: 'POLITICAL_PARTY'
								}
							}
						},
						limit: 1
					},
					posts: {
						organizations: {
							id: true,
							name: true,
							image: true,
							founding_date: true
						}
					}
				}
			},
			people_signature_count: true
		}
	});

	const proposer = creators[0]
		? creators[0]?.__typename === 'Organization'
			? creators[0]
			: people_signature_count
				? {
						id: creators[0].id,
						name: creators[0].name,
						signatoryCount: people_signature_count
					}
				: {
						id: creators[0].id,
						name: creators[0].name,
						image: creators[0].image,
						assemblyMembership: creators[0].memberships.find(
							(m) => m.posts[0]?.organizations[0]?.classification !== 'POLITICAL_PARTY'
						),
						partyMembership: creators[0].memberships.find(
							(m) => m.posts[0]?.organizations[0]?.classification === 'POLITICAL_PARTY'
						)
					}
		: undefined;

	return {
		bill,
		proposer,
		coProposers: co_proposers.map(({ memberships, ...politician }) => ({
			...politician,
			party: memberships[0]?.posts[0]?.organizations[0]
		})),
		seo: createSeo({
			title: bill.nickname ?? bill.title
		})
	};
}
