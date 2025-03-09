import {
	type HighlightedVoteByGroup,
	type VoteCardVoting
} from '$components/VoteCard/VoteCard.svelte';
import { type Voting } from '$models/voting';

export function toVoteCardVoting(
	voting: Voting,
	highlightedVoteByGroups: HighlightedVoteByGroup[]
): VoteCardVoting {
	return {
		id: voting.id,
		date: voting.date,
		nickname: voting.nickname,
		result: voting.result,
		votesByGroup: highlightedVoteByGroups
	};
}
