import { type HighlightedVoteByGroup, type VoteCard } from '$components/VoteCard/VoteCard.svelte';
import { type Voting } from '$models/voting';
import type { ComponentProps } from 'svelte';

export function toVoteCardVoting(
	voting: Voting,
	highlightedVoteByGroups: HighlightedVoteByGroup[]
): ComponentProps<VoteCard> {
	return {
		id: voting.id,
		date: voting.date,
		nickname: voting.nickname,
		result: voting.result,
		votesByGroup: highlightedVoteByGroups
	};
}
