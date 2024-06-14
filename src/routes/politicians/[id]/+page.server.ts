import { fetchFromIdOr404, fetchPoliticians, fetchVotes, fetchVotings } from '$lib/datasheets';
import { safeFind } from '$lib/datasheets/processor';
import { createSeo } from '$lib/seo';
import type { Vote } from '$models/vote';
import { DefaultVoteOption, type Voting } from '$models/voting';

const MAX_LASTEST_VOTE = 5;

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
	return (await fetchPoliticians()).map(({ id }) => ({ id }));
}

export async function load({ params }) {
	const politician = await fetchFromIdOr404(fetchPoliticians, params.id);

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
		latest: filteredVoting.slice(0, MAX_LASTEST_VOTE)
	};
}
