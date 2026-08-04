import { groups } from 'd3-array';

export interface AffiliationVote {
	name: string;
	count: number;
}

export interface AffiliationParty {
	name?: string;
	image?: string;
	count: number;
	options: AffiliationVote[];
}

/**
 * Sums the vote count of each option across every party of an affiliation.
 * @param parties - The parties of the affiliation.
 * @returns One entry per option, in first-seen order.
 */
export function sumVotesByOption(parties: AffiliationParty[]): AffiliationVote[] {
	return groups(
		parties.flatMap((party) => party.options),
		(vote) => vote.name
	).map(([name, votes]) => ({
		name,
		count: votes.reduce((sum, { count }) => sum + count, 0)
	}));
}

/**
 * Finds the option with the most votes.
 * @param votes - The summed votes of an affiliation.
 * @returns The winning option, or undefined when there is no vote at all.
 */
export function findHighestVote(votes: AffiliationVote[]): AffiliationVote | undefined {
	return votes.reduce<AffiliationVote | undefined>(
		(highest, current) => (!highest || current.count > highest.count ? current : highest),
		undefined
	);
}
