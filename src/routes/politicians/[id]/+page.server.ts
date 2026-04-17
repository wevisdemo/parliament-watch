import type {
	VotingAbsentStats,
	VotingHistory
} from '$components/politicians/PoliticianVoteSummary.svelte';
import { graphql } from '$lib/politigraph/client';
import type { Vote, VoteEvent } from '$lib/politigraph/genql/schema';
import { queryAllPeople } from '$lib/politigraph/people';
import { createSeo } from '$lib/seo';
import { DefaultVoteOption } from '$models/voting';
import { error } from '@sveltejs/kit';

const MAX_LATEST_VOTE = 5;

export async function entries() {
	return queryAllPeople({ id: true });
}

export async function load({ params }) {
	const {
		people: [politician],
		votes
	} = await graphql.query({
		people: {
			__args: {
				where: { id: { eq: params.id } }
			},
			id: true,
			prefix: true,
			name: true,
			firstname: true,
			image: true,
			email: true,
			gender: true,
			birth_date: true,
			educations: true,
			previous_occupations: true,
			links: {
				note: true,
				url: true
			},
			memberships: {
				__args: {
					where: {
						posts: {
							some: {
								organizations: {
									some: {
										classification: {
											in: [
												'CABINET',
												'HOUSE_OF_REPRESENTATIVE',
												'HOUSE_OF_SENATE',
												'POLITICAL_PARTY'
											]
										}
									}
								}
							}
						}
					},
					sort: [{ end_date: 'DESC' }]
				},
				start_date: true,
				end_date: true,
				posts: {
					role: true,
					organizations: {
						id: true,
						classification: true,
						name: true,
						founding_date: true,
						image: true,
						color: true,
						dissolution_date: true
					}
				}
			}
		},
		votes: {
			__args: {
				where: {
					voters: {
						some: {
							id: {
								eq: params.id
							}
						}
					}
				}
			},
			option: true,
			vote_events: {
				id: true,
				title: true,
				result: true,
				start_date: true
			}
		}
	});

	if (!politician) {
		error(404);
	}

	const latestVotings = votes.sort((a, z) =>
		z.vote_events[0].start_date.localeCompare(a.vote_events[0].start_date)
	);

	const agreedVoting = getLatestVotingHistory(latestVotings, DefaultVoteOption.Agreed);
	const disagreedVoting = getLatestVotingHistory(latestVotings, DefaultVoteOption.Disagreed);
	const votingAbsentStats = await getVotingAbsentStatsByHouseTerm(
		politician.id,
		politician.memberships
	);

	return {
		politician,
		agreedVoting,
		disagreedVoting,
		votingAbsentStats,
		seo: createSeo({
			title: politician.name
		})
	};
}

async function getVotingAbsentStatsByHouseTerm(
	politicianId: string,
	memberships: {
		posts: {
			organizations: {
				id: string;
				classification: string;
				name: string;
				founding_date: string | null;
				dissolution_date: string | null;
			}[];
		}[];
	}[]
): Promise<VotingAbsentStats[]> {
	const houseTerms = memberships
		.map((membership) => membership.posts[0]?.organizations[0])
		.filter(
			(
				organization
			): organization is NonNullable<
				(typeof memberships)[number]['posts'][number]['organizations'][number]
			> =>
				(organization.classification === 'HOUSE_OF_REPRESENTATIVE' ||
					organization.classification === 'HOUSE_OF_SENATE') &&
				Boolean(organization.founding_date)
		)
		.filter((organization, index, organizations) => {
			return organizations.findIndex(({ id }) => id === organization.id) === index;
		})
		.sort((a, z) => (z.founding_date ?? '').localeCompare(a.founding_date ?? ''));

	return Promise.all(
		houseTerms.map(async (houseTerm) => {
			const voteEventDateFilter = {
				start_date: {
					gte: houseTerm.founding_date,
					...(houseTerm.dissolution_date ? { lte: houseTerm.dissolution_date } : {})
				}
			};
			const memberWhere = {
				memberships: {
					some: {
						posts: {
							some: {
								organizations: {
									some: {
										id: { eq: houseTerm.id }
									}
								}
							}
						}
					}
				}
			};
			const absentVotesWhere = {
				node: {
					option: { eq: DefaultVoteOption.Absent },
					vote_events: {
						some: {
							organizations: {
								some: {
									id: { eq: houseTerm.id }
								}
							},
							...voteEventDateFilter
						}
					}
				}
			};

			const [
				{
					voteEventsConnection,
					people: [politicianAbsentCount]
				},
				{ peopleConnection, votesConnection }
			] = await Promise.all([
				graphql.query({
					voteEventsConnection: {
						__args: {
							where: {
								organizations: {
									some: {
										id: { eq: houseTerm.id }
									}
								},
								...voteEventDateFilter
							}
						},
						aggregate: {
							count: {
								nodes: true
							}
						}
					},
					people: {
						__args: {
							where: {
								id: { eq: politicianId },
								...memberWhere
							}
						},
						votesConnection: {
							__args: {
								where: absentVotesWhere
							},
							aggregate: {
								count: {
									nodes: true
								}
							}
						}
					}
				}),
				graphql.query({
					peopleConnection: {
						__args: {
							where: memberWhere
						},
						aggregate: {
							count: {
								nodes: true
							}
						}
					},
					votesConnection: {
						__args: {
							where: {
								option: { eq: DefaultVoteOption.Absent },
								vote_events: {
									some: {
										organizations: {
											some: {
												id: { eq: houseTerm.id }
											}
										},
										...voteEventDateFilter
									}
								},
								voters: {
									some: memberWhere
								}
							}
						},
						aggregate: {
							count: {
								nodes: true
							}
						}
					}
				})
			]);

			const totalVoting = voteEventsConnection.aggregate.count.nodes;
			const totalMembers = peopleConnection.aggregate.count.nodes;
			const totalAbsentVoting = votesConnection.aggregate.count.nodes;

			return {
				assemblyId: houseTerm.id,
				assemblyName: houseTerm.name,
				foundingDate: houseTerm.founding_date,
				dissolutionDate: houseTerm.dissolution_date,
				totalVoting,
				absentVoting: politicianAbsentCount?.votesConnection.aggregate.count.nodes ?? 0,
				averageAbsentVotingPercent:
					Math.round((totalAbsentVoting / (totalMembers || 1) / (totalVoting || 1)) * 10000) / 100
			};
		})
	);
}

function getLatestVotingHistory(
	votes: (Pick<Vote, 'option'> & { vote_events: Pick<VoteEvent, 'id' | 'title' | 'result'>[] })[],
	selectedOption: DefaultVoteOption
): VotingHistory {
	const filteredVotes = votes.filter(({ option }) => option === selectedOption);

	return {
		total: filteredVotes.length,
		latest: filteredVotes
			.slice(0, MAX_LATEST_VOTE)
			.map(({ option, vote_events: [{ id, title, result }] }) => ({
				id,
				title,
				option,
				result
			}))
	};
}
