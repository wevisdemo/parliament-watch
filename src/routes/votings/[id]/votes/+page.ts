import type { Voting } from '$models/voting.js';
import { createMockVotes } from '../../../../mocks/data/votes.js';
import { passedVoting } from '../../../../mocks/data/voting';

interface FilterOptions {
	parties: string[];
	positions: string[];
}

type VotingSummary = Pick<Voting, 'id' | 'title'>;

export function load({ params }) {
	const votingId = Number(params.id);

	const voting: VotingSummary = {
		id: votingId,
		title: passedVoting.title
	};

	const isCandidateVoting = votingId >= 3 && votingId <= 5;
	const votes = createMockVotes(isCandidateVoting);

	const filterOptions: FilterOptions = {
		parties: getSortedUniqueValue(votes, 'party'),
		positions: getSortedUniqueValue(votes, 'position').reverse()
	};

	return { voting, filterOptions, votes };
}

const getSortedUniqueValue = (list: { [key: string]: unknown }[], key: string): string[] =>
	[...new Set(list.map((item) => item[key]).filter((item) => item) as string[])].sort((a, z) =>
		a.localeCompare(z)
	);
