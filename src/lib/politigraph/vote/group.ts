import { groups } from 'd3';

interface VoteInput {
	option: string;
	party?: { side?: string };
	role: string;
}

export function groupVotesByAffiliation<T extends VoteInput>(voteInputs: T[]) {
	return groups(voteInputs, (vote) =>
		vote.party?.side
			? `สส.${vote.party.side.replace('พรรค', '')}`
			: vote.role.startsWith('สส.')
				? 'สส.ไม่ทราบฝ่าย'
				: vote.role.startsWith('สว.')
					? 'สว.'
					: vote.role
	)
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
