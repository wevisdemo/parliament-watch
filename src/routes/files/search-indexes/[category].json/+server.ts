import { fetchVotings, fetchBills, fetchPromises } from '$lib/datasheets/index.js';
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
					firstname: true,
					lastname: true,
					memberships: {
						__args: {
							where: {
								end_date_EQ: null,
								posts_ALL: {
									organizations_ALL: {
										classification_IN: [
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
								abbreviation: true
							}
						}
					}
				}
			});

			const indexes: SearchIndexes['politicians'] = people
				.map(({ id, firstname, lastname, memberships }) => ({
					id,
					name: `${firstname} ${lastname}`,
					description: memberships
						.map(({ posts: [{ organizations }], label }) =>
							organizations[0].classification === 'POLITICAL_PARTY'
								? `พรรค${organizations[0].name}`
								: `${organizations[0].abbreviation} ${label || ''}`.trim()
						)
						.join(' | ')
				}))
				.sort((a, z) => a.id.localeCompare(z.id));

			return createJSONFileResponse(indexes);
		}

		case SearchIndexCategory.Bills: {
			const indexes: SearchIndexes['bills'] = (await fetchBills())
				.map(({ id, nickname, status }) => ({ id, name: nickname, status }))
				.sort((a, z) => a.name.localeCompare(z.name));

			return createJSONFileResponse(indexes);
		}

		case SearchIndexCategory.BillProposers: {
			const proposers = (await fetchBills())
				.map((bill) => {
					if (bill.proposedLedByPolitician) {
						const { firstname, lastname, assemblyRoles, partyRoles } = bill.proposedLedByPolitician;
						const billProposedOn = bill.proposedOn.getTime();

						const matchedAssemblyRole = assemblyRoles?.find(
							({ startedAt, endedAt }) =>
								billProposedOn >= startedAt.getTime() &&
								(!endedAt || billProposedOn <= endedAt.getTime())
						);

						const matchedPartyRole = partyRoles?.find(
							({ startedAt, endedAt }) =>
								billProposedOn >= startedAt.getTime() &&
								(!endedAt || billProposedOn <= endedAt.getTime())
						);

						return {
							name: `${firstname} ${lastname}`,
							description:
								getPoliticianDescription(matchedAssemblyRole, matchedPartyRole) ||
								BillProposerType.Politician
						};
					} else if (bill.proposedByPeople) {
						return {
							name: bill.proposedByPeople.ledBy,
							description: BillProposerType.People
						};
					}

					return { name: '', description: '' };
				})
				.filter(({ name }) => name);

			const indexes: SearchIndexes['billProposers'] = [
				...rollup(
					proposers,
					(group) => ({
						...group[0],
						proposedBillsCount: group.length
					}),
					({ name }) => name
				).values()
			].sort((a, z) => a.name.localeCompare(z.name));

			return createJSONFileResponse(indexes);
		}

		case SearchIndexCategory.Votings: {
			const indexes: SearchIndexes['votings'] = (await fetchVotings())
				.map(({ id, nickname, result }) => ({
					id,
					name: nickname,
					result: result
				}))
				.sort((a, z) => a.id.localeCompare(z.id));

			return createJSONFileResponse(indexes);
		}

		case SearchIndexCategory.Promises: {
			const indexes: SearchIndexes['promises'] = (await fetchPromises()).map(
				({ id, statements, status }) => ({
					id,
					name: statements[0],
					status
				})
			);

			return createJSONFileResponse(indexes);
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
