import type MainMembers from '$components/Assemblies/MainMembers.svelte';
import type CabinetMembers from '$components/CabinetMembers/CabinetMembers.svelte';
import type { Organization } from '$lib/politigraph/genql';
import { graphql } from '$lib/politigraph/server';
import { noParty } from './groupby';
import type { ComponentProps } from 'svelte';

export type AssemblyMember = Awaited<ReturnType<typeof queryAssemblyMembers>>[number];
export type MainMember = ComponentProps<CabinetMembers & MainMembers>['members'];

export async function getAvailableAssemblies({
	classification
}: Pick<Organization, 'classification'>) {
	return (
		await graphql.query({
			organizations: {
				__args: {
					where: {
						classification: { eq: classification }
					},
					sort: [{ founding_date: 'ASC' }]
				},
				id: true,
				term: true,
				founding_date: true
			}
		})
	).organizations;
}

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
					classification: { eq: classification }
				}
			},
			id: true,
			term: true
		},
		people: {
			__args: {
				where: {
					memberships: {
						some: {
							posts: {
								some: {
									organizations: {
										some: {
											id: { eq: id }
										}
									}
								}
							}
						}
					}
				}
			},
			id: true,
			name: true,
			image: true,
			gender: true,
			birth_date: true,
			educations: true,
			memberships: {
				__args: {
					where: {
						OR: [
							{
								posts: {
									some: {
										organizations: {
											some: {
												id: { eq: id }
											}
										}
									}
								}
							},
							{
								posts: {
									some: {
										organizations: {
											some: {
												classification: { eq: 'POLITICAL_PARTY' }
											}
										}
									}
								},
								OR: [{ end_date: { eq: null } }, { end_date: { gte: founding_date } }],
								...(dissolution_date ? { start_date: { lte: dissolution_date } } : {})
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
									posts: {
										some: {
											role: { startsWith: 'พรรคฝ่าย' },
											organizations: {
												some: {
													classification: { eq: 'CABINET' },
													...(dissolution_date
														? {
																founding_date: { lte: dissolution_date }
															}
														: {
																dissolution_date: { eq: null }
															})
												}
											}
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

export function parseMemberWithAssemblyRoles({ id, name, image, memberships }: AssemblyMember) {
	const party = memberships.find(
		(m) => m.posts[0].organizations[0].classification === 'POLITICAL_PARTY'
	)?.posts[0].organizations[0];

	return memberships
		.filter((m) => m.posts[0].organizations[0].classification !== 'POLITICAL_PARTY')
		.map((m) => ({
			profile: {
				id,
				name,
				avatar: image ? image : undefined,
				partyName: party?.name ?? noParty.name,
				partyLogo: party?.image ?? noParty.image
			},
			assemblyRole: m.posts[0].role ?? ''
		}));
}
