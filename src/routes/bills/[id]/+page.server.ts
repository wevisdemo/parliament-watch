import type { RelatedVotingResults } from '$components/bills/Progress.svelte';
import {
	fetchFromIdOr404,
	fetchBills,
	fetchBillEvents,
	fetchVotings,
	fetchVotes,
	fetchPoliticians
} from '$lib/datasheets';
import { groupVoteByAffiliations } from '$lib/datasheets/voting';
import { createSeo } from '$lib/seo';
import type { Bill } from '$models/bill';
import type { BillEvent } from '$models/bill-event';
import { DefaultVoteOption, DefaultVotingResult } from '$models/voting';

export async function load({ params }) {
	const bill = await fetchFromIdOr404(fetchBills, params.id);
	const events = (await fetchBillEvents()).filter(({ billId }) => billId === bill.id).reverse();

	const votings = await fetchVotings();
	const votes = await fetchVotes();
	const politicians = await fetchPoliticians();

	const relatedVotingResults = events.reduce<RelatedVotingResults>((obj, { votedInVotingId }) => {
		if (votedInVotingId) {
			const voting = votings.find(({ id }) => id === votedInVotingId);

			if (voting) {
				const corespondedVotes = votes.filter(({ votingId }) => votingId === voting.id);
				const highlightedVoteOption =
					voting.result === DefaultVotingResult.Passed
						? DefaultVoteOption.Agreed
						: DefaultVoteOption.Disagreed;

				obj[votedInVotingId] = {
					voting,
					resultSummary: {
						total: corespondedVotes.length,
						agreed: corespondedVotes.filter(
							({ voteOption }) => voteOption === highlightedVoteOption
						).length,
						subResults: groupVoteByAffiliations(voting, corespondedVotes, politicians)
							.map(({ name, resultSummary }) => ({
								affiliationName: name,
								agreed: resultSummary[highlightedVoteOption] ?? 0,
								total: Object.values(resultSummary).reduce((sum, count) => sum + count, 0)
							}))
							.filter(({ total }) => total > 0)
					}
				};
			}
		}

		return obj;
	}, {});

	return {
		bill,
		// TODO: merged bill data is not ready yet
		mergedBills: [] as Bill[], // Bills that got merged into this bill.
		events,
		mergedIntoBill: undefined as Bill | undefined, // The bill that this bill got merged into. (merged event)
		mergedIntoBillLatestEvent: undefined as BillEvent | undefined,
		relatedVotingResults,
		seo: createSeo({
			title: bill.nickname
		})
	};
}
