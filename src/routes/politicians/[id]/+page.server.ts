import type {
	VotingAbsentStats,
	VotingHistory
} from '$components/politicians/PoliticianVoteSummary.svelte';
import { graphql } from '$lib/politigraph';
import type { Vote, VoteEvent } from '$lib/politigraph/genql/schema';
import { createSeo } from '$lib/seo';
import { DefaultVoteOption } from '$models/voting';
import { error } from '@sveltejs/kit';

const MAX_LATEST_VOTE = 5;

export async function entries() {
	return (await graphql.query({ people: { id: true } })).people;
}

export async function load({ params }) {
	const {
		people: [politician],
		votes,
		votesConnection
	} = await graphql.query({
		people: {
			__args: {
				where: { id_EQ: params.id }
			},
			id: true,
			prefix: true,
			firstname: true,
			lastname: true,
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
						posts_ALL: {
							organizations_ALL: {
								classification_IN: ['HOUSE_OF_REPRESENTATIVE', 'HOUSE_OF_SENATE', 'POLITICAL_PARTY']
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
					voters_ALL: {
						id_EQ: params.id
					},
					vote_events_ALL: {
						publish_status_EQ: 'PUBLISHED'
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
		},
		votesConnection: {
			aggregate: {
				count: {
					nodes: true
				}
			}
		}
	});

	const { votesConnection: absentVotesConnection } = await graphql.query({
		votesConnection: {
			__args: {
				where: {
					option_EQ: DefaultVoteOption.Absent
				}
			},
			aggregate: {
				count: {
					nodes: true
				}
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

	const votingAbsentStats: VotingAbsentStats = {
		totalVoting: votes.length,
		absentVoting: votes.filter(({ option }) => option === DefaultVoteOption.Absent).length,
		averageAbsentVoting:
			(100 * absentVotesConnection.aggregate.count.nodes) / votesConnection.aggregate.count.nodes
	};

	return {
		politician,
		agreedVoting,
		disagreedVoting,
		votingAbsentStats,
		seo: createSeo({
			title: `${politician.firstname} ${politician.lastname}`
		})
	};
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
