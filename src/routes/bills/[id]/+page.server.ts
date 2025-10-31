import type VoteCard from '$components/VoteCard/VoteCard.svelte';
import { fetchFromIdOr404, fetchBills, fetchBillEvents, fetchVotings } from '$lib/datasheets';
import { graphql } from '$lib/politigraph';
import { countVotesInEachOption } from '$lib/politigraph/vote/group';
import { groupVotesByAffiliation } from '$lib/politigraph/vote/group';
import { queryPoliticiansVote } from '$lib/politigraph/vote/with-politician';
import { createSeo } from '$lib/seo';
import { buildVotesSummary, optionsArrayToResultSummary } from '$lib/vote-summary';
import type { Bill } from '$models/bill';
import { BillEventType, type BillEvent } from '$models/bill-event';
import type { Politician } from '$models/politician';
import type { ComponentProps } from 'svelte';

// export async function entries() {
// 	return (await fetchBills()).map(({ id }) => ({ id }));
// }

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
		voteEvents.map(async (voteEvent) => {
			const groupedVotes = groupVotesByAffiliation(await queryPoliticiansVote(voteEvent));
			const groups = groupedVotes.map((aff) => ({
				name: aff.name,
				resultSummary: optionsArrayToResultSummary(countVotesInEachOption(aff.votes))
			}));

			return {
				...voteEvent,
				date: voteEvent.start_date,
				votesSummary: buildVotesSummary({ groups, result: voteEvent.result })
			};
		})
	);

	// TODO: workaround to temporary match old sheet politician id with new politician politigraph id
	const proposedLedByPolitician = bill.proposedLedByPolitician
		? await mapOldPoliticianToNewPolitician(bill.proposedOn, bill.proposedLedByPolitician)
		: undefined;
	const coProposedByPoliticians = bill.coProposedByPoliticians
		? await Promise.all(
				bill.coProposedByPoliticians.map((politician) =>
					typeof politician === 'string'
						? { name: politician }
						: mapOldPoliticianToNewPolitician(bill.proposedOn, politician)
				)
			)
		: undefined;

	return {
		bill: {
			...bill,
			proposedLedByPolitician,
			coProposedByPoliticians
		},
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

async function mapOldPoliticianToNewPolitician(billProposedDate: Date, politician: Politician) {
	const [{ memberships, ...rest }] = (
		await graphql.query({
			people: {
				__args: {
					where: {
						firstname_EQ: politician.firstname,
						OR: [
							{ lastname_EQ: politician.lastname },
							{ lastname_EQ: politician.lastname.split(' ').at(-1) }
						]
					}
				},
				id: true,
				name: true,
				image: true,
				memberships: {
					__args: {
						where: {
							start_date_LTE: billProposedDate.toUTCString(),
							OR: [{ end_date_EQ: null }, { end_date_GTE: billProposedDate.toUTCString() }]
						}
					},
					posts: {
						label: true,
						organizations: {
							id: true,
							name: true,
							image: true,
							term: true,
							abbreviation: true,
							classification: true,
							founding_date: true
						}
					}
				}
			}
		})
	).people;

	const assembly = memberships.find(
		(m) => m.posts[0].organizations[0].classification !== 'POLITICAL_PARTY'
	);

	return {
		...rest,
		party: memberships.find((m) => m.posts[0].organizations[0].classification === 'POLITICAL_PARTY')
			?.posts[0].organizations[0],
		assembly: assembly
			? {
					id: assembly.posts[0].organizations[0].id,
					abbreviation: assembly.posts[0].organizations[0].abbreviation,
					term: assembly.posts[0].organizations[0].term,
					startedAt: assembly.posts[0].organizations[0].founding_date,
					postLabel: assembly.posts[0].label
				}
			: undefined
	};
}
