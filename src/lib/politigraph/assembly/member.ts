import type MainMembers from '$components/Assemblies/MainMembers.svelte';
import type CabinetMembers from '$components/CabinetMembers/CabinetMembers.svelte';
import { graphql } from '$lib/politigraph';
import type { Organization } from '$lib/politigraph/genql';
import { noParty } from './groupby';
import type { ComponentProps } from 'svelte';

export type AssemblyMember = Awaited<ReturnType<typeof queryAssemblyMembers>>[number];
export type MainMember = ComponentProps<CabinetMembers & MainMembers>['members'];

export async function queryAssemblyMembers({
	id,
	classification,
	founding_date,
	dissolution_date
}: Pick<Organization, 'id' | 'classification' | 'founding_date' | 'dissolution_date'>) {
	const { people } = await graphql.query({
		organizations: {
			__args: {
				where: {
					classification_EQ: classification
				}
			},
			id: true,
			term: true
		},
		people: {
			__args: {
				where: {
					memberships_SOME: {
						posts_ALL: {
							organizations_ALL: {
								id_EQ: id
							}
						}
					}
				}
			},
			id: true,
			firstname: true,
			lastname: true,
			image: true,
			gender: true,
			birth_date: true,
			educations: true,
			memberships: {
				__args: {
					where: {
						OR: [
							{
								posts_ALL: {
									organizations_ALL: {
										id_EQ: id
									}
								}
							},
							{
								posts_ALL: {
									organizations_ALL: {
										classification_EQ: 'POLITICAL_PARTY'
									}
								},
								OR: [{ end_date_EQ: null }, { end_date_GTE: founding_date }],
								...(dissolution_date ? { start_date_LTE: dissolution_date } : {})
							}
						]
					},
					sort: [{ start_date: 'DESC' }]
				},
				label: true,
				list_number: true,
				district_number: true,
				province: true,
				start_date: true,
				end_date: true,
				posts: {
					role: true,
					organizations: {
						id: true,
						classification: true,
						name: true,
						image: true,
						color: true,
						memberships: {
							__args: {
								where: {
									posts_ALL: {
										role_STARTS_WITH: 'พรรคฝ่าย',
										organizations_ALL: {
											classification_EQ: 'CABINET',
											...(dissolution_date
												? {
														founding_date_LTE: dissolution_date
													}
												: {
														dissolution_date_EQ: null
													})
										}
									}
								},
								sort: [{ start_date: 'DESC' }]
							},
							posts: {
								role: true
							}
						}
					}
				}
			}
		}
	});

	return people;
}

export function parseMainMember({ id, firstname, lastname, image, memberships }: AssemblyMember) {
	const party = memberships.find(
		(m) => m.posts[0].organizations[0].classification === 'POLITICAL_PARTY'
	)?.posts[0].organizations[0];

	return {
		profile: {
			id,
			firstname,
			lastname,
			avatar: image ? image : undefined,
			partyName: party?.name ?? noParty.name,
			partyLogo: party?.image ?? noParty.image
		},
		assemblyRole:
			memberships.find((m) => m.posts[0].organizations[0].classification !== 'POLITICAL_PARTY')
				?.posts[0].role ?? ''
	};
}
