import type { Voting } from '$models/voting';
import { failedVoting, passedVoting } from '../../../mocks/data/voting';
import { fetchFromIdOr404, fetchPoliticians } from '$lib/datasheets';
import { createSeo } from '../../../utils/seo';

interface VotingHistory {
	total: number;
	latest: Pick<Voting, 'id' | 'title' | 'result'>[];
}

interface VotingAbsentStats {
	totalVoting: number;
	absentVoting: number;
	averageAbsentVoting: number;
}

export async function load({ params }) {
	const politician = await fetchFromIdOr404(fetchPoliticians, params.id);

	const mockLatestVoting: VotingHistory['latest'] = [
		failedVoting,
		passedVoting,
		passedVoting,
		failedVoting,
		passedVoting
	].map(({ id, title, result }) => ({ id, title, result }));

	const agreedVoting: VotingHistory = {
		total: 23,
		latest: mockLatestVoting
	};

	const disagreedVoting: VotingHistory = {
		total: 14,
		latest: mockLatestVoting
	};

	const votingAbsentStats: VotingAbsentStats = {
		totalVoting: 100,
		absentVoting: 15,
		averageAbsentVoting: 22
	};

	return {
		politician,
		agreedVoting,
		disagreedVoting,
		votingAbsentStats,
		totalProposedBill: 6,
		seo: createSeo({
			title: `${politician.firstname} ${politician.lastname}`
		})
	};
}
