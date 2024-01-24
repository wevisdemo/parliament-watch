import type { HighlightedPolitician } from '$components/Index/StatCard.svelte';
import { HighlightedReason } from '$components/Index/StatCard.svelte';
import { safeFind } from '$lib/datasheets/processor.js';
import { fetchPoliticians, fetchVotes, fetchVotings } from '$lib/datasheets';
import type { ComponentProps } from 'svelte';
import type VoteCard from '$components/VoteCard/VoteCard.svelte';
import { getHighlightedVoteByGroups } from '$lib/datasheets/voting.js';
import dayjs from 'dayjs';
import { DefaultVoteOption } from '$models/voting.js';

const MAX_LASTEST_VOTE = 5;

enum PoliticialPosition {
	MP = 'สส.',
	Senate = 'สว.',
	Cabinet = 'รัฐมนตรี'
}

interface LongestServedInPoliticalPositionsPolitician extends HighlightedPolitician {
	position: PoliticialPosition;
	year: number;
}

interface MostFrequentlyServedAsMinisterPolitician extends HighlightedPolitician {
	cabinetTerms: number[];
}

export async function load() {
	const politicians = await fetchPoliticians();
	const votes = await fetchVotes();
	const votings = await fetchVotings();

	const activePoliticians = politicians.filter(({ isActive }) => isActive);

	const votesInActiveAssemblies = votes.filter(({ votingId }) =>
		votings
			.find(({ id }) => id === votingId)
			?.participatedAssemblies.some(({ endedAt }) => endedAt === undefined)
	);

	const highlightedPoliticians: HighlightedPolitician[] = [
		// TODO: Not release assets and debts yet
		// {
		// 	reason: HighlightedReason.HighestAssetOwned,
		// 	value: 95787230000,
		// 	politician: movingForwardPolitician
		// },
		// {
		// 	reason: HighlightedReason.HighestDebtOwned,
		// 	value: 1862770000,
		// 	politician: movingForwardPolitician
		// },
		{
			reason: HighlightedReason.HighestPartySwitching,
			...activePoliticians
				.map((politician) => ({
					politician,
					value: new Set(politician.partyRoles.map(({ party }) => party.name)).size
				}))
				.sort((a, z) => z.value - a.value)[0]
		},
		{
			reason: HighlightedReason.HighestAbsentRate,
			...activePoliticians
				.map((politician) => {
					const theirVotes = votesInActiveAssemblies.filter(
						({ politicianId }) => politicianId === politician.id
					);

					return {
						politician,
						value:
							theirVotes.filter(({ voteOption }) => voteOption === DefaultVoteOption.Absent)
								.length / theirVotes.length
					};
				})
				.sort((a, z) => z.value - a.value)[0]
		},
		// TODO: Not release bills yet
		// {
		// 	reason: HighlightedReason.HighestBillProposed,
		// 	value: 87,
		// 	politician: movingForwardPolitician
		// },
		{
			reason: HighlightedReason.Youngest,
			...activePoliticians
				.map((politician) => ({
					politician,
					value: politician.birthdate ? dayjs().diff(politician.birthdate, 'years') : 999
				}))
				.sort((a, z) => a.value - z.value)[0]
		}
	];

	const chuanLeekpai = safeFind(activePoliticians, (p) => p.id === 'ชวน-หลีกภัย');
	const banyatBantadtan = safeFind(activePoliticians, (p) => p.id === 'บัญญัติ-บรรทัดฐาน');

	const otherSourcesHighlightedPoliticians: HighlightedPolitician[] = [
		{
			reason: HighlightedReason.LongestServedInPoliticalPositions,
			value: 54,
			politician: chuanLeekpai,
			position: PoliticialPosition.MP,
			year: 2512
		} as LongestServedInPoliticalPositionsPolitician,
		{
			reason: HighlightedReason.MostFrequentlyElectedInConstituency,
			value: 12,
			politician: banyatBantadtan
		},
		{
			reason: HighlightedReason.MostFrequentlyServedAsMinister,
			value: 5,
			politician: chuanLeekpai,
			cabinetTerms: [38, 42, 43, 45, 53]
		} as MostFrequentlyServedAsMinisterPolitician,
		{
			reason: HighlightedReason.MostDiverseServedAsMinister,
			value: 6,
			politician: chuanLeekpai
		}
	];

	const latestVotings: ComponentProps<VoteCard>[] = [...(await fetchVotings())]
		.sort((a, z) => z.date.getTime() - a.date.getTime())
		.slice(0, MAX_LASTEST_VOTE)
		.map((voting) => ({
			voting,
			highlightedVoteByGroups: getHighlightedVoteByGroups(voting, votes, politicians)
		}));

	return {
		highlightedPoliticians,
		otherSourcesHighlightedPoliticians,
		latestVotings
	};
}
