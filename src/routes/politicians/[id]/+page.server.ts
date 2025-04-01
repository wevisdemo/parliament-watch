import { fetchPoliticians, fetchVotes, fetchVotings } from '$lib/datasheets';
import { safeFind } from '$lib/datasheets/processor';
import { graphql } from '$lib/politigraph.js';
import { createSeo } from '$lib/seo';
import type { Vote } from '$models/vote';
import { DefaultVoteOption, type Voting } from '$models/voting';
import { error } from '@sveltejs/kit';

const MAX_LATEST_VOTE = 5;

type VotingSummary = Pick<Voting, 'id' | 'nickname' | 'result'>;

export interface VotingHistory {
	total: number;
	latest: VotingSummary[];
}

export interface VotingAbsentStats {
	totalVoting: number;
	absentVoting: number;
	averageAbsentVoting: number;
}

export async function entries() {
	return (await graphql.query({ people: { id: true } })).people;
}

export async function load({ params }) {
	const {
		people: [politician]
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
		}
	});

	if (!politician) {
		error(404);
	}

	const votings = await fetchVotings();
	const votes = await fetchVotes();

	const latestVotings = votes
		.filter(({ politicianId }) => politicianId === politician.id)
		.map(({ votingId, voteOption }) => {
			try {
				const { id, nickname, result, date } = safeFind(
					votings,
					(voting) => voting.id === votingId
				);

				return { id, nickname, result, date, voteOption };
			} catch (e) {
				throw `Could not find voting id ${votingId}`;
			}
		})
		.sort((a, z) => z.date.getTime() - a.date.getTime());

	const agreedVoting = getLatestVotingHistory(latestVotings, DefaultVoteOption.Agreed);
	const disagreedVoting = getLatestVotingHistory(latestVotings, DefaultVoteOption.Disagreed);

	const votingAbsentStats: VotingAbsentStats = {
		totalVoting: latestVotings.length,
		absentVoting: latestVotings.filter(({ voteOption }) => voteOption === DefaultVoteOption.Absent)
			.length,
		averageAbsentVoting:
			(100 * votes.filter(({ voteOption }) => voteOption === DefaultVoteOption.Absent).length) /
			((await fetchPoliticians()).length * votings.length)
	};

	return {
		politician,
		agreedVoting,
		disagreedVoting,
		votingAbsentStats,
		// totalProposedBill: 6,
		seo: createSeo({
			title: `${politician.firstname} ${politician.lastname}`
		})
	};
}

function getLatestVotingHistory(
	votings: (VotingSummary & Pick<Vote, 'voteOption'>)[],
	selectedOption: Vote['voteOption']
): VotingHistory {
	const filteredVoting = votings.filter(({ voteOption }) => voteOption === selectedOption);

	return {
		total: filteredVoting.length,
		latest: filteredVoting.slice(0, MAX_LATEST_VOTE)
	};
}
