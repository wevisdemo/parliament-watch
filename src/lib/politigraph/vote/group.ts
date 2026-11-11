import { AssemblyPartyGroup } from '$models/assembly';
import { groups } from 'd3-array';

interface VoteInput {
	option: string;
	party?: { side?: string; name?: string };
	role: string;
}

export const UNKNOWN_REPRESENTATIVE_GROUP = `สส.${AssemblyPartyGroup.Unknown}`;
const SENATE_GROUP = 'สว.';
const REPRESENTATIVE_GROUP_ORDER = [
	`สส.${AssemblyPartyGroup.Government}`,
	`สส.${AssemblyPartyGroup.Opposition}`,
	UNKNOWN_REPRESENTATIVE_GROUP
];

const getGroupOrder = (name: string) => {
	const index = REPRESENTATIVE_GROUP_ORDER.indexOf(name);
	return index === -1 ? REPRESENTATIVE_GROUP_ORDER.length : index;
};

function resolveGroupName(vote: VoteInput) {
	if (vote.party?.side) {
		return `สส.${vote.party.side.replace('พรรค', '')}`;
	}

	if (vote.party || vote.role.startsWith('สส.')) {
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
		.sort(
			(a, z) => getGroupOrder(a.name) - getGroupOrder(z.name) || z.votes.length - a.votes.length
		);
}

export function countVotesInEachOption<T extends VoteInput>(voteInputs: T[]) {
	return groups(voteInputs, (vote) => vote.option)
		.map(([name, list]) => ({
			name,
			count: list.length
		}))
		.sort((a, z) => z.count - a.count);
}
