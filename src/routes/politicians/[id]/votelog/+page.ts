import { DefaultVotingResult, type Voting } from '$models/voting.js';
import { passedVoting } from '../../../../mocks/data/voting.js';

type VotingSummary = Pick<Voting, 'id' | 'title' | 'result' | 'date' | 'files'>;

export async function load({ params }) {
	const [firstname, lastname] = params.id.split('-');

	const votings: VotingSummary[] = new Array(100).fill(passedVoting).map((voting, i) => ({
		...voting,
		id: i,
		result: i % 3 ? DefaultVotingResult.Passed : DefaultVotingResult.Failed,
		files: i % 2 ? ['/'] : []
	}));

	return { prefix: 'นาย', firstname, lastname, votings };
}
