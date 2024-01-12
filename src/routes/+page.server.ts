import { building } from '$app/environment';
import type { HighlightedPolitician } from '$components/Index/StatCard.svelte';
import { HighlightedReason } from '$components/Index/StatCard.svelte';
import { safeFind } from '$lib/datasheets/processor.js';
import { fetchPoliticians, fetchVotes, fetchVotings } from '$lib/datasheets';
import { getMostGun } from '$lib/ranking/gun.js';
import { getPoliticianWithMostViewLastMonth } from '$lib/ranking/wikipedia.js';
import { movingForwardPolitician } from '../mocks/data/politician.js';
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

interface MostVisitedInWikipediaLastMonthPolitician extends HighlightedPolitician {
	updatedAt: Date;
}

export async function load() {
	const politicians = await fetchPoliticians();
	const votes = await fetchVotes();

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
			...politicians
				.map((politician) => ({
					politician,
					value: new Set(politician.partyRoles.map(({ party }) => party.name)).size
				}))
				.sort((a, z) => z.value - a.value)[0]
		},
		{
			reason: HighlightedReason.HighestAbsentRate,
			...politicians
				.map((politician) => {
					const theirVotes = votes.filter(({ politicianId }) => politicianId === politician.id);

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
			...politicians
				.map((politician) => ({
					politician,
					value: politician.birthdate ? dayjs().diff(politician.birthdate, 'years') : 999
				}))
				.sort((a, z) => a.value - z.value)[0]
		}
	];

	let wikipediaPolitician: Omit<HighlightedPolitician, 'reason'> = {
		politician: movingForwardPolitician,
		value: 476263
	};
	let gunPolitician: Omit<HighlightedPolitician, 'reason'> = {
		politician: movingForwardPolitician,
		value: 25
	};

	if (building) {
		wikipediaPolitician = await getPoliticianWithMostViewLastMonth();
		gunPolitician = (await getMostGun()) ?? gunPolitician;
	}

	const chuanLeekpai = safeFind(politicians, (p) => p.id === 'ชวน-หลีกภัย');
	const banyatBantadtan = safeFind(politicians, (p) => p.id === 'บัญญัติ-บรรทัดฐาน');

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
		},
		{
			reason: HighlightedReason.MostVisitedInWikipediaLastMonth,
			...wikipediaPolitician,
			updatedAt: new Date()
		} as MostVisitedInWikipediaLastMonthPolitician,
		{
			reason: HighlightedReason.MostGunOwned,
			politician: gunPolitician.politician,
			value: gunPolitician.value
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
