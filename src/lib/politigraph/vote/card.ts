import { buildVotesSummary, optionsArrayToResultSummary } from '$lib/vote-summary';
import { countVotesInEachOption, groupVotesByAffiliation } from './group';
import { queryPoliticiansVote } from './with-politician';

interface VoteEventInput {
	id: string;
	start_date: string;
	end_date: string;
	result: string | null;
	organizations: { id: string }[];
}

export async function toVoteCardProps<T extends VoteEventInput>(voteEvent: T) {
	const groupedVotes = groupVotesByAffiliation(await queryPoliticiansVote(voteEvent));
	const groups = groupedVotes.map((affiliation) => ({
		name: affiliation.name,
		resultSummary: optionsArrayToResultSummary(countVotesInEachOption(affiliation.votes))
	}));

	return {
		...voteEvent,
		date: voteEvent.start_date,
		votesSummary: buildVotesSummary({ groups, result: voteEvent.result })
	};
}
