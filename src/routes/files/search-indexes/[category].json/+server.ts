import { graphql } from '$lib/politigraph/server';
import { SearchIndexCategory, type SearchIndexes } from '$models/search';
import { error } from '@sveltejs/kit';

export const prerender = true;

export const entries = () => Object.values(SearchIndexCategory).map((category) => ({ category }));

export async function GET({ params }) {
	switch (params.category) {
		case SearchIndexCategory.Politicians: {
			const { people } = await graphql.query({
				people: {
					id: true,
					name: true,
					memberships: {
						__args: {
							where: {
								end_date_EQ: null,
								posts_ALL: {
									organizations_ALL: {
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
						label: true,
						posts: {
							organizations: {
								classification: true,
								name: true,
								abbreviation: true,
								term: true
							}
						}
					}
				}
			});

			const indexes: SearchIndexes['politicians'] = people
				.map(({ id, name, memberships }) => ({
					id,
					name,
					description: memberships
						.sort((a, z) =>
							a.posts[0].organizations[0].classification.localeCompare(
								z.posts[0].organizations[0].classification
							)
						)
						.map(
							({
								posts: [
									{
										organizations: [org]
									}
								],
								label
							}) =>
								org.classification === 'POLITICAL_PARTY'
									? `พรรค${org.name}`
									: [org.abbreviation, label, org.term && `ชุดที่ ${org.term}`]
											.filter((value) => value)
											.join(' ')
						)
						.join(' | ')
				}))
				.sort((a, z) => a.id.localeCompare(z.id));

			return createJSONFileResponse(indexes);
		}

		case SearchIndexCategory.Bills: {
			const { bills } = await graphql.query({
				bills: {
					__args: {
						sort: [{ title: 'ASC' }]
					},
					id: true,
					title: true,
					nickname: true,
					status: true
				}
			});

			const indexes: SearchIndexes['bills'] = bills.map(({ id, title, nickname, status }) => ({
				id,
				name: nickname || title,
				status
			}));

			return createJSONFileResponse(indexes);
		}

		case SearchIndexCategory.BillProposers: {
			const { people } = await graphql.query({
				people: {
					__args: {
						where: {
							proposed_motions_SOME: { NOT: { id_EQ: null } }
						}
					},
					name: true,
					proposed_motionsConnection: {
						totalCount: true
					}
				}
			});

			const indexes: SearchIndexes['billProposers'] = people.map(
				({ name, proposed_motionsConnection }) => ({
					name,
					proposedBillsCount: proposed_motionsConnection.totalCount
				})
			);

			return createJSONFileResponse(indexes);
		}

		case SearchIndexCategory.Votings: {
			const { voteEvents } = await graphql.query({
				voteEvents: {
					__args: {
						sort: [{ start_date: 'ASC' }]
					},
					id: true,
					title: true,
					nickname: true,
					result: true
				}
			});

			const indexes: SearchIndexes['votings'] = voteEvents.map(
				({ id, title, nickname, result }) => ({
					id,
					name: nickname || title,
					result: result ? result : undefined
				})
			);

			return createJSONFileResponse(indexes);
		}

		case SearchIndexCategory.Promises: {
			return createJSONFileResponse([]);
		}

		default:
			error(404);
	}
}

const createJSONFileResponse = (indexes: SearchIndexes[SearchIndexCategory]) =>
	new Response(JSON.stringify(indexes), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
