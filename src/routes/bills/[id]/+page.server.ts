import type VoteCard from '$components/VoteCard/VoteCard.svelte';
import { fetchFromIdOr404, fetchBills, fetchBillEvents, fetchVotings } from '$lib/datasheets';
import { graphql } from '$lib/politigraph';
import { countVotesInEachOption } from '$lib/politigraph/vote/group';
import { groupVotesByAffiliation } from '$lib/politigraph/vote/group';
import { queryPoliticiansVote } from '$lib/politigraph/vote/with-politician';
import { createSeo } from '$lib/seo';
import type { Bill } from '$models/bill';
import { BillEventType, type BillEvent } from '$models/bill-event';
import type { ComponentProps } from 'svelte';

export async function entries() {
	return (await fetchBills()).map(({ id }) => ({ id }));
}

const expectedEventOrder = Object.values(BillEventType).reverse();

export async function load({ params }) {
	const bill = await fetchFromIdOr404(fetchBills, params.id);
	const events = (await fetchBillEvents())
		.filter(({ billId }) => billId === bill.id)
		.sort((a, z) =>
			a.date && z.date
				? z.date.getTime() - a.date.getTime()
				: expectedEventOrder.indexOf(a.type) - expectedEventOrder.indexOf(z.type)
		);

	const votings = await fetchVotings();

	// TODO: Remove this when we migrate bill to Politigraph
	const legacyVotingIdAndMbisIdMap = events.reduce<Map<string, number>>((map, event) => {
		if (event.votedInVotingId) {
			const legacyVoting = votings.find((voting) => voting.id === event.votedInVotingId);

			if (legacyVoting) {
				map.set(legacyVoting.id, +legacyVoting.sourceUrl.split('m_id=')[1]);
			}
		}

		return map;
	}, new Map());

	const { voteEvents } = await graphql.query({
		voteEvents: {
			__args: {
				where: {
					msbis_id_IN: [...legacyVotingIdAndMbisIdMap.values()]
				}
			},
			id: true,
			msbis_id: true,
			title: true,
			nickname: true,
			start_date: true,
			result: true,
			end_date: true,
			organizations: {
				id: true
			}
		}
	});

	const relatedVoteEvents: ComponentProps<VoteCard>[] = await Promise.all(
		voteEvents.map(async (voteEvent) => ({
			...voteEvent,
			date: voteEvent.start_date,
			votesByGroup: groupVotesByAffiliation(await queryPoliticiansVote(voteEvent)).map((aff) => ({
				name: aff.name,
				options: countVotesInEachOption(aff.votes)
			}))
		}))
	);

	return {
		bill,
		// TODO: merged bill data is not ready yet
		mergedBills: [] as Bill[], // Bills that got merged into this bill.
		// TODO: Remove this when we migrate bill to Politigraph
		events: events.map((event) => ({
			...event,
			votedInVotingId: event.votedInVotingId
				? voteEvents.find(
						(voteEvent) =>
							voteEvent.msbis_id === legacyVotingIdAndMbisIdMap.get(event.votedInVotingId as string)
					)?.id
				: undefined
		})),
		mergedIntoBill: undefined as Bill | undefined, // The bill that this bill got merged into. (merged event)
		mergedIntoBillLatestEvent: undefined as BillEvent | undefined,
		relatedVoteEvents,
		seo: createSeo({
			title: bill.nickname
		})
	};
}
