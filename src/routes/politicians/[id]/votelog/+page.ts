import type { Politician } from '$models/politician.js';
import {
	DefaultVoteOption,
	DefaultVotingResult,
	type CustomVoteOption,
	type Voting
} from '$models/voting.js';
import type { Assembly } from '$models/assembly';
import { gov35, rep26 } from '../../../../mocks/data/assembly.js';
import {
	customVoteOption,
	defaultVoteOptions,
	mockCategory,
	passedVoting
} from '../../../../mocks/data/voting.js';

interface VotingSummary
	extends Pick<
		Voting,
		'id' | 'title' | 'result' | 'date' | 'files' | 'participatedAssembleIds' | 'category'
	> {
	voteOption: DefaultVoteOption | CustomVoteOption;
	isVoteAlignWithPartyMajority: boolean;
}

interface FilterOptions {
	assemblies: Assembly[];
	categories: string[];
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

	const filterOptions: FilterOptions = {
		assemblies: [rep26, gov35],
		categories: mockCategory
	};

	const votings: VotingSummary[] = new Array(100).fill(passedVoting).map(({ title, date }, i) => ({
		id: i,
		title,
		date,
		participatedAssembleIds: [i % 2 ? rep26.id : gov35.id],
		category: mockCategory[i % mockCategory.length],
		result: i % 3 ? DefaultVotingResult.Passed : DefaultVotingResult.Failed,
		files: i % 2 ? [{ label: 'some file', url: '/' }] : [],
		voteOption: [...defaultVoteOptions, ...customVoteOption][
			i % (defaultVoteOptions.length + customVoteOption.length)
		],
		isVoteAlignWithPartyMajority: i % 5 !== 0
	}));

	return { politician, filterOptions, votings };
}
