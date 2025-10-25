import { groups } from 'd3';

interface VoteInput {
	option: string;
	party?: { side?: string; name?: string };
	role: string;
}

const UNKNOWN_REPRESENTATIVE_GROUP = 'สส.ไม่ทราบฝ่าย';
const SENATE_GROUP = 'สว.';

function resolveGroupName(vote: VoteInput) {
	if (vote.party?.side) {
		return `สส.${vote.party.side.replace('พรรค', '')}`;
	}

	if (vote.role.startsWith('สส.')) {
		return UNKNOWN_REPRESENTATIVE_GROUP;
	}

	if (vote.role.startsWith('สว.')) {
		return SENATE_GROUP;
	}

	return vote.role;
}

export function groupVotesByAffiliation<T extends VoteInput>(voteInputs: T[]) {
	return groups(voteInputs, (vote) => resolveGroupName(vote))
		.map(([name, votes]) => ({
			name,
			votes
		}))
		.sort((a, z) => z.votes.length - a.votes.length);
}

export function countVotesInEachOption<T extends VoteInput>(voteInputs: T[]) {
	return groups(voteInputs, (vote) => vote.option)
		.map(([name, list]) => ({
			name,
			count: list.length
		}))
		.sort((a, z) => z.count - a.count);
}
