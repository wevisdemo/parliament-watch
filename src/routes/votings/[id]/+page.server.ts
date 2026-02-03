import { graphql } from '$lib/politigraph/server';
import { countVotesInEachOption, groupVotesByAffiliation } from '$lib/politigraph/vote/group.js';
import {
	queryPoliticiansVote,
	sortPoliticiansVoteByDominantGroup
} from '$lib/politigraph/vote/with-politician.js';
import { createSeo } from '$lib/seo';
import type { Bill } from '$models/bill';
import { DefaultVoteOption, defaultVoteOptions, type CustomVoteOption } from '$models/voting.js';
import { error } from '@sveltejs/kit';
import { groups } from 'd3';

export async function entries() {
	return (await graphql.query({ voteEvents: { id: true } })).voteEvents;
}

export async function load({ params }) {
	const {
		voteEvents: [voteEvent]
	} = await graphql.query({
		voteEvents: {
			__args: {
				where: {
					id: { eq: params.id }
				}
			},
			id: true,
			title: true,
			nickname: true,
			result: true,
			description: true,
			start_date: true,
			end_date: true,
			pass_condition: true,
			organizations: {
				id: true,
				name: true,
				classification: true,
				posts: {
					role: true,
					memberships: {
						members: {
							on_Organization: {
								id: true,
								image: true
							}
						}
					}
				}
			},
			links: {
				__args: {
					sort: [{ note: 'ASC' }]
				},
				__scalar: true
			}
		}
	});

	if (!voteEvent) {
		error(404);
	}

	// TODO: Not release bill yet
	const relatedBill: Bill | null = null;

	const votes = sortPoliticiansVoteByDominantGroup(await queryPoliticiansVote(voteEvent));

	const nonDefaultVotes = groups(
		votes.filter((vote) => vote.option && !defaultVoteOptions.includes(vote.option)),
		(vote) => vote.option
	).sort((a, z) => z[1].length - a[1].length);

	const customOptionResults = nonDefaultVotes.map<{ option: CustomVoteOption; total: number }>(
		([label, optionVotes], i) => ({
			option: {
				label,
				colorIntensity: 1 - i / nonDefaultVotes.length
			},
			total: optionVotes.length
		})
	);

	const defaultOptionResults = defaultVoteOptions
		.map((option) => ({
			option: option as DefaultVoteOption,
			total: votes.filter((vote) => vote.option === option).length
		}))
		.filter((result) => !customOptionResults.length || result.total);

	const resultsByAffiliation = groupVotesByAffiliation(votes).map((aff) => ({
		name: aff.name,
		count: aff.votes.length,
		parties: groups(aff.votes, (vote) => vote.party?.name)
			.map(([, votesInParty]) => ({
				name: votesInParty[0].party?.name,
				image: votesInParty[0].party?.image,
				count: votesInParty.length,
				options: countVotesInEachOption(votesInParty)
			}))
			.sort((a, z) => z.count - a.count)
	}));

	return {
		voteEvent,
		relatedBill,
		results: [...customOptionResults, ...defaultOptionResults],
		resultsByAffiliation,
		votes,
		customOptionResults,
		seo: createSeo({
			title: `การลงมติ ${voteEvent.nickname || voteEvent.title}`
		})
	};
}
