import type { HighlightedVoteByGroup } from '$components/VoteCard/VoteCard.svelte';
import { AssemblyName } from '$models/assembly';
import type { Politician } from '$models/politician';
import type { Vote } from '$models/vote';
import { DefaultVoteOption, DefaultVotingResult, type Voting } from '$models/voting';
import { safeFind } from './processor';

export function getHighlightedVoteByGroups(
	voting: Voting,
	votes: Vote[],
	politicians: Politician[]
): HighlightedVoteByGroup[] {
	const winningOption = getWinningOption(voting.result);
	const participatedVotes = votes.filter(({ votingId }) => votingId === voting.id);
	const winningVoters = participatedVotes
		.filter(({ voteOption }) => voteOption === winningOption)
		.map(({ politicianId }) => politicianId);

	const highlightedVoteGroups = participatedVotes.reduce(
		(counter, { politicianId }) => {
			let group: keyof typeof counter;
			const politician = safeFind(politicians, ({ id }) => id === politicianId);
			const assemblyRole = politician.assemblyRoles.find((ar) =>
				voting.participatedAssembleIds.includes(ar.assembly.id)
			);

			if (!assemblyRole) {
				console.warn(
					`${politician.id} is not a member of any participated assembles ${voting.participatedAssembleIds} of voting ${voting.id}, but their votes exist`
				);
				return counter;
			}

			if (assemblyRole.assembly.name === AssemblyName.Senates) {
				group = 'สว.';
			} else {
				const partyRole = politician.partyRoles.find(
					({ startedAt, endedAt }) =>
						voting.date.getTime() >= startedAt.getTime() &&
						(!endedAt || voting.date.getTime() <= endedAt.getTime())
				);

				if (!partyRole) {
					console.warn(
						`Could not find ${politician.id} party on the voting day of ${
							voting.id
						} (${voting.date.toLocaleDateString()})`
					);
					return counter;
				}

				group = assemblyRole.assembly.oppositionParties.some(
					({ name }) => name === partyRole.party.name
				)
					? 'สส. ฝ่ายค้าน'
					: 'สส. ฝ่ายรัฐบาล';
			}

			counter[group].total++;

			if (winningVoters.includes(politician.id)) {
				counter[group].count++;
			}

			return counter;
		},
		{
			'สส. ฝ่ายรัฐบาล': { count: 0, total: 0 },
			'สส. ฝ่ายค้าน': { count: 0, total: 0 },
			'สว.': { count: 0, total: 0 }
		}
	);

	return Object.entries(highlightedVoteGroups)
		.map(([name, values]) => ({ name, ...values }))
		.filter(({ count }) => count > 0);
}

function getWinningOption(result: string) {
	switch (result) {
		case DefaultVotingResult.Passed:
			return DefaultVoteOption.Agreed;
		case DefaultVotingResult.Failed:
			return DefaultVoteOption.Disagreed;
		default:
			return result;
	}
}
