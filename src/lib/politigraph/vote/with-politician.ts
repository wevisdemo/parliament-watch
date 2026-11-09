import { graphql } from '../client';

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
					vote_events: {
						some: {
							id: { eq: voteEvent.id }
						}
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
							start_date: { lte: voteEvent.start_date },
							OR: [{ end_date: { eq: null } }, { end_date: { gte: voteEvent.start_date } }],
							posts: {
								some: {
									organizations: {
										some: { id: { in: voteEvent.organizations.map((o) => o.id) } }
									}
								}
							}
						}
					},
					label: true,
					posts: {
						organizations: {
							abbreviation: true
						}
					}
				}
			},
			voter_name_raw: true,
			voter_affiliations: {
				__args: { where: { classification: { eq: 'POLITICAL_PARTY' } } },
				id: true,
				name: true,
				image: true
			},
			option: true
		},
		posts: {
			__args: {
				where: {
					organizations: {
						some: {
							classification: { eq: 'CABINET' },
							founding_date: { lte: voteEvent.start_date },
							OR: [
								{ dissolution_date: { eq: null } },
								{ dissolution_date: { gte: voteEvent.start_date } }
							]
						}
					},
					memberships: {
						some: {
							members: {
								some: {
									Organization: {
										classification: { eq: 'POLITICAL_PARTY' }
									}
								}
							}
						}
					}
				}
			},
			role: true,
			organizations: {
				name: true,
				founding_date: true,
				dissolution_date: true
			},
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

	return votes.map(({ id, option, voter_name_raw, voter_affiliations, voters: [politician] }) => {
		const assemblyRole = politician?.memberships[0];
		const party = voter_affiliations[0];

		return {
			id: id,
			option: option,
			politician: {
				name: politician ? politician.name : (voter_name_raw ?? ''),
				id: politician?.id
			},
			party: party
				? {
						name: party.name,
						image: party.image ?? undefined,
						side: partySideMap.get(party.id)
					}
				: undefined,
			role: assemblyRole
				? `${assemblyRole.posts[0].organizations[0].abbreviation} ${assemblyRole.label ?? ''}`.trim()
				: NO_INFO_LABEL
		};
	});
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
