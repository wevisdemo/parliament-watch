import type { Politician } from '$models/politician.js';
import { DefaultVotingResult, type VoteOption, type Voting } from '$models/voting.js';
import { defaultVoteOptions, mockCategory, passedVoting } from '../../../../mocks/data/voting.js';

interface VotingSummary
	extends Pick<
		Voting,
		'id' | 'title' | 'result' | 'date' | 'files' | 'participatedAssembleIds' | 'category'
	> {
	voteOption: VoteOption;
	isVoteAlignWithPartyMajority: boolean;
}

type PoliticianSummary = Pick<Politician, 'id' | 'prefix' | 'firstname' | 'lastname'>;

export async function load({ params }) {
	const [firstname, lastname] = params.id.split('-');

	const politician: PoliticianSummary = {
		id: `${firstname}-${lastname}`,
		prefix: 'นาย',
		firstname,
		lastname
	};

	const votings: VotingSummary[] = new Array(100)
		.fill(passedVoting)
		.map(({ title, date, participatedAssembleIds }, i) => ({
			id: i,
			title,
			date,
			participatedAssembleIds,
			category: mockCategory[i % mockCategory.length],
			result: i % 3 ? DefaultVotingResult.Passed : DefaultVotingResult.Failed,
			files: i % 2 ? [{ label: 'some file', url: '/' }] : [],
			voteOption: defaultVoteOptions[i & defaultVoteOptions.length],
			isVoteAlignWithPartyMajority: i % 5 !== 0
		}));

	return { politician, votings };
}
