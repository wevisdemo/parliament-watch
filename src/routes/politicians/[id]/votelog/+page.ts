import { DefaultVotingResult, type VotingSummary } from '$models/voting.js';
import { passedVotingSummary } from '../../../../mocks/data/voting.js';

export async function load({ params }) {
	const [firstname, lastname] = params.id.split('-');

	const votings: VotingSummary[] = new Array(100).fill(passedVotingSummary).map((voting, i) => ({
		...voting,
		id: i,
		result: i % 3 ? DefaultVotingResult.Passed : DefaultVotingResult.Failed,
		files: i % 2 ? ['/'] : []
	}));

	return { prefix: 'นาย', firstname, lastname, votings };
}
