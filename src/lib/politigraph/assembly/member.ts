import type { MainMembersProps } from '$components/Assemblies/MainMembers.svelte';
import type { CabinetMembersProps } from '$components/CabinetMembers/CabinetMembers.svelte';
import { graphql } from '$lib/politigraph/client';
import type { Organization } from '$lib/politigraph/genql';
import { noParty } from './groupby';

export type AssemblyMember = Awaited<ReturnType<typeof queryAssemblyMembers>>[number];
export type MainMember = (MainMembersProps & CabinetMembersProps)['members'];

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
	founding_date,
	dissolution_date
}: Pick<Organization, 'id' | 'founding_date' | 'dissolution_date'>) {
	const { people } = await graphql.query({
		people: {
			__args: {
				where: {
					memberships: {
						some: {
							post: {
								organization: {
									id: { eq: id }
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
								post: {
									organization: {
										id: { eq: id }
									}
								}
							},
							{
								post: {
									organization: {
										classification: { eq: 'POLITICAL_PARTY' }
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
				post: {
					role: true,
					organization: {
						id: true,
						classification: true,
						name: true,
						image: true,
						color: true,
						memberships: {
							__args: {
								where: {
									post: {
										role: { startsWith: 'พรรคฝ่าย' },
										organization: {
											classification: { eq: 'CABINET' },
											OR: [
												{ dissolution_date: { eq: null } },
												{ dissolution_date: { gte: founding_date } }
											],
											...(dissolution_date
												? {
														founding_date: { lte: dissolution_date }
													}
												: {})
										}
									}
								},
								sort: [{ start_date: 'DESC' }]
							},
							post: {
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
	const party = memberships.find((m) => m.post?.organization?.classification === 'POLITICAL_PARTY')
		?.post?.organization;

	return memberships
		.filter((m) => m.post?.organization?.classification !== 'POLITICAL_PARTY')
		.map((m) => ({
			profile: {
				id,
				name,
				avatar: image ? image : undefined,
				partyName: party?.name ?? noParty.name,
				partyLogo: party?.image ?? noParty.image
			},
			assemblyRole: m.post?.role ?? ''
		}));
}
