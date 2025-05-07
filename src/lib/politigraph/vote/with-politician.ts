import { graphql } from '..';

export async function queryPoliticiansVote(voteEvent: {
	id: string;
	start_date: string;
	end_date: string;
	organizations: { id: string }[];
}) {
	const { votes, posts } = await graphql.query({
		votes: {
			__args: {
				where: {
					vote_events_ALL: {
						id_EQ: voteEvent.id
					}
				}
			},
			id: true,
			voters: {
				id: true,
				firstname: true,
				lastname: true,
				memberships: {
					__args: {
						where: {
							start_date_LTE: voteEvent.start_date,
							OR: [{ end_date_EQ: null }, { end_date_GTE: voteEvent.start_date }],
							posts_ALL: {
								organizations_ALL: {
									OR: [
										{ id_IN: voteEvent.organizations.map((o) => o.id) },
										{ classification_EQ: 'POLITICAL_PARTY' }
									]
								}
							}
						}
					},
					label: true,
					posts: {
						role: true,
						organizations: {
							id: true,
							name: true,
							classification: true,
							abbreviation: true,
							image: true,
							memberships: {
								posts: {
									role: true
								}
							}
						}
					}
				}
			},
			voter_name: true,
			voter_party: true,
			option: true
		},
		posts: {
			__args: {
				where: {
					organizations_ALL: {
						classification_EQ: 'CABINET',
						founding_date_LTE: voteEvent.start_date,
						OR: [{ dissolution_date_EQ: null }, { dissolution_date_GTE: voteEvent.end_date }]
					},
					memberships_ALL: {
						members_ALL: {
							Organization: {
								classification_EQ: 'POLITICAL_PARTY'
							}
						}
					}
				}
			},
			role: true,
			memberships: {
				members: {
					on_Organization: {
						id: true
					}
				}
			}
		}
	});

	const partySideMap = new Map(
		posts.flatMap((p) => p.memberships.map((m) => [m.members[0].id, p.role]))
	);

	return votes
		.map(({ id, option, voter_name, voter_party, voters: [politician] }) => {
			const partyMembership = politician?.memberships.find(
				(m) => m.posts[0].organizations[0].classification === 'POLITICAL_PARTY'
			);

			const assemblyRole = politician?.memberships.find(
				(m) => m.posts[0].organizations[0].classification !== 'POLITICAL_PARTY'
			);
			const party = partyMembership?.posts[0].organizations[0];

			return {
				id: id,
				option: option,
				politician: {
					name: politician ? `${politician.firstname} ${politician.lastname}` : voter_name ?? '',
					id: politician?.id
				},
				party: party
					? {
							name:
								party.name ??
								(voter_party?.startsWith('พรรค') ? voter_party.replace('พรรค', '') : undefined),
							image: party.image ?? undefined,
							side: partySideMap.get(party.id)
						}
					: undefined,
				role: assemblyRole
					? `${assemblyRole.posts[0].organizations[0].abbreviation} ${assemblyRole.label ?? ''}`.trim()
					: 'ไม่พบข้อมูล'
			};
		})
		.sort((a, z) => a.politician.name.localeCompare(z.politician.name));
}
