import { DefaultVotingResult, type VotingSummary } from '$models/voting.js';
import { passedVotingSummary } from '../../../../mocks/data/voting.js';

export async function load({ params }) {
	const [firstname, lastname] = params.id.split('-');

	const votings: VotingSummary[] = new Array(100).fill(passedVotingSummary).map((voting, i) => ({
		...voting,
		result: i % 2 ? DefaultVotingResult.Passed : DefaultVotingResult.Failed
	}));

	return { prefix: 'นาย', firstname, lastname, votings };
}
