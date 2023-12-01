import type { Politician } from '$models/politician.js';
import {
	DefaultVoteOption,
	DefaultVotingResult,
	type CustomVoteOption,
	type Voting
} from '$models/voting.js';
import type { Assembly } from '$models/assembly';
import {
	customVoteOption,
	defaultVoteOptions,
	mockCategory,
	passedVoting
} from '../../../../mocks/data/voting.js';
import { assemblies } from '../../../../libs/datasheets/index.js';

interface VoteSummary
	extends Pick<
		Voting,
		'id' | 'title' | 'result' | 'date' | 'files' | 'participatedAssembleIds' | 'categories'
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

	const votes: VoteSummary[] = new Array(100).fill(passedVoting).map(({ title, date }, i) => ({
		id: i,
		title: i % 2 ? title : title + ' ทดสอบ',
		date,
		participatedAssembleIds: [i % 2 ? 'สมาชิกสภาผู้แทนราษฎร-25' : 'สมาชิกสภาผู้แทนราษฎร-26'],
		categories: [mockCategory[i % mockCategory.length]],
		result: i % 3 ? DefaultVotingResult.Passed : DefaultVotingResult.Failed,
		files: i % 2 ? [{ label: 'some file', url: '/' }] : [],
		voteOption: [...defaultVoteOptions, ...customVoteOption][
			i % (defaultVoteOptions.length + customVoteOption.length)
		],
		isVoteAlignWithPartyMajority: i % 5 !== 0
	}));

	const uniqueParticipatedAssemblyIds = [
		...new Set(votes.flatMap(({ participatedAssembleIds }) => participatedAssembleIds))
	];

	const filterOptions: FilterOptions = {
		assemblies: assemblies.filter(({ id }) => uniqueParticipatedAssemblyIds.includes(id)),
		categories: [...new Set(votes.flatMap(({ categories }) => categories))]
	};

	return { politician, filterOptions, votes };
}
