import { AssemblyPartyGroup } from '$models/assembly';
import { graphql } from '../server';

const NO_INFO_LABEL = 'ไม่พบข้อมูล';

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
				name: true,
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

	return votes.map(({ id, option, voter_name, voter_party, voters: [politician] }) => {
		const partyMembership = politician?.memberships.find(
			(m) => m.posts[0].organizations[0].classification === 'POLITICAL_PARTY'
		);

		const assemblyRole = politician?.memberships.find(
			(m) => m.posts[0].organizations[0].classification !== 'POLITICAL_PARTY'
		);
		const party = partyMembership?.posts[0].organizations[0];
		const partySide = party
			? (partySideMap.get(party.id) ?? inferPartySideFromOrganization(party))
			: undefined;

		return {
			id: id,
			option: option,
			politician: {
				name: politician ? politician.name : (voter_name ?? ''),
				id: politician?.id
			},
			party: party
				? {
						name:
							party.name ??
							(voter_party?.startsWith('พรรค') ? voter_party.replace('พรรค', '') : undefined),
						image: party.image ?? undefined,
						side: partySide
					}
				: undefined,
			role: assemblyRole
				? `${assemblyRole.posts[0].organizations[0].abbreviation} ${assemblyRole.label ?? ''}`.trim()
				: NO_INFO_LABEL
		};
	});
}

function inferPartySideFromOrganization(organization?: {
	id?: string;
	memberships?: { posts?: { role?: string }[] }[];
}) {
	if (!organization?.memberships) return undefined;

	for (const membership of organization.memberships) {
		for (const post of membership.posts ?? []) {
			const role = post.role ?? '';
			if (role.endsWith(AssemblyPartyGroup.Opposition)) {
				return AssemblyPartyGroup.Opposition;
			}
			if (role.endsWith(AssemblyPartyGroup.Government)) {
				return AssemblyPartyGroup.Government;
			}
		}
	}

	return undefined;
}

type VoteWithPolitician = Awaited<ReturnType<typeof queryPoliticiansVote>>[number];

export function sortPoliticiansVoteByDominantGroup(votes: VoteWithPolitician[]) {
	const groupSortScore = votes.reduce<{ [group: string]: number }>(
		(count, vote) => {
			const key = getGroupKey(vote);

			if (key === NO_INFO_LABEL) {
				return count;
			}

			if (count[key]) {
				// Name localeCompare will be either -1, 0 or 1, use 10 to sort by group first
				count[key] += 10;
			} else {
				count[key] = 10;
			}
			return count;
		},
		{ [NO_INFO_LABEL]: 0 }
	);

	return votes.sort(
		(a, z) =>
			groupSortScore[getGroupKey(z)] -
			groupSortScore[getGroupKey(a)] +
			a.politician.name.localeCompare(z.politician.name)
	);
}

function getGroupKey(vote: VoteWithPolitician) {
	return vote.party?.name ?? NO_INFO_LABEL;
}
