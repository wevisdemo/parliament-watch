import { fetchBills, fetchPromises } from '$lib/datasheets';
import { graphql } from '$lib/politigraph';
import { BillProposerType } from '$models/bill';
import type { AssemblyRoleHistory, PartyRoleHistory } from '$models/politician';
import { SearchIndexCategory, type SearchIndexes } from '$models/search';
import { error } from '@sveltejs/kit';
import { rollup } from 'd3-array';

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
			// const indexes: SearchIndexes['bills'] = (await fetchBills())
			// 	.map(({ id, nickname, status }) => ({ id, name: nickname, status }))
			// 	.sort((a, z) => a.name.localeCompare(z.name));

			return createJSONFileResponse([]);
		}

		case SearchIndexCategory.BillProposers: {
			// const proposers = (await fetchBills())
			// 	.map((bill) => {
			// 		if (bill.proposedLedByPolitician) {
			// 			const { firstname, lastname, assemblyRoles, partyRoles } = bill.proposedLedByPolitician;
			// 			const billProposedOn = bill.proposedOn.getTime();

			// 			const matchedAssemblyRole = assemblyRoles?.find(
			// 				({ startedAt, endedAt }) =>
			// 					billProposedOn >= startedAt.getTime() &&
			// 					(!endedAt || billProposedOn <= endedAt.getTime())
			// 			);

			// 			const matchedPartyRole = partyRoles?.find(
			// 				({ startedAt, endedAt }) =>
			// 					billProposedOn >= startedAt.getTime() &&
			// 					(!endedAt || billProposedOn <= endedAt.getTime())
			// 			);

			// 			return {
			// 				name: `${firstname} ${lastname}`,
			// 				description:
			// 					getPoliticianDescription(matchedAssemblyRole, matchedPartyRole) ||
			// 					BillProposerType.Politician
			// 			};
			// 		} else if (bill.proposedByPeople) {
			// 			return {
			// 				name: bill.proposedByPeople.ledBy,
			// 				description: BillProposerType.People
			// 			};
			// 		}

			// 		return { name: '', description: '' };
			// 	})
			// 	.filter(({ name }) => name);

			// const indexes: SearchIndexes['billProposers'] = [
			// 	...rollup(
			// 		proposers,
			// 		(group) => ({
			// 			...group[0],
			// 			proposedBillsCount: group.length
			// 		}),
			// 		({ name }) => name
			// 	).values()
			// ].sort((a, z) => a.name.localeCompare(z.name));

			return createJSONFileResponse([]);
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
			// const indexes: SearchIndexes['promises'] = (await fetchPromises()).map(
			// 	({ id, statements, status }) => ({
			// 		id,
			// 		name: statements[0],
			// 		status
			// 	})
			// );

			return createJSONFileResponse([]);
		}

		default:
			error(404);
	}
}

const getPoliticianDescription = (
	assemblyRole?: Omit<AssemblyRoleHistory, 'politicianId'>,
	partyRole?: Omit<PartyRoleHistory, 'politicianId'>
) =>
	[
		assemblyRole ? assemblyRole.assembly.abbreviation + assemblyRole.appointmentMethod : null,
		partyRole?.party.name
	]
		.filter((text) => text)
		.join(' | ');

const createJSONFileResponse = (indexes: SearchIndexes[SearchIndexCategory]) =>
	new Response(JSON.stringify(indexes), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
