import { MAX_LATEST_VOTE, VOTE_STATUSES } from '$components/Index/VotingContent.svelte';
import { type VoteCardProps } from '$components/VoteCard/VoteCard.svelte';
import { PAGE_CACHE_CONTROL } from '$lib/cache-control';
import { graphql } from '$lib/politigraph/client';
import { groupVotesByAffiliation, countVotesInEachOption } from '$lib/politigraph/vote/group';
import { queryPoliticiansVote } from '$lib/politigraph/vote/with-politician';
import { buildVotesSummary, optionsArrayToResultSummary } from '$lib/vote-summary';
import type { RequestHandler } from './$types';

const VALID_STATUS_VALUES = VOTE_STATUSES.map((s) => s.value);

export const GET: RequestHandler = async ({ params }) => {
	const { status } = params;

	if (!VALID_STATUS_VALUES.includes(status as (typeof VALID_STATUS_VALUES)[number])) {
		return new Response(JSON.stringify({ error: 'Invalid status' }), {
			status: 404,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const { voteEvents } = await graphql.query({
		voteEvents: {
			__args: {
				...(status === 'passed'
					? { where: { result: { eq: 'ผ่าน' } } }
					: status === 'failed'
						? { where: { result: { eq: 'ไม่ผ่าน' } } }
						: {}),
				sort: [{ start_date: 'DESC' }],
				limit: MAX_LATEST_VOTE
			},
			id: true,
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

	const latestVoteEvents: VoteCardProps[] = await Promise.all(
		voteEvents.map(async (voteEvent) => {
			const groupedVotes = groupVotesByAffiliation(await queryPoliticiansVote(voteEvent));
			const mappedGroups = groupedVotes.map((aff) => ({
				name: aff.name,
				resultSummary: optionsArrayToResultSummary(countVotesInEachOption(aff.votes))
			}));

			return {
				...voteEvent,
				date: voteEvent.start_date,
				votesSummary: buildVotesSummary({ groups: mappedGroups, result: voteEvent.result })
			};
		})
	);

	return new Response(JSON.stringify(latestVoteEvents), {
		headers: {
			'Content-Type': 'application/json',
			'Cache-Control': PAGE_CACHE_CONTROL
		}
	});
};

export type VoteEventOverviewData = VoteCardProps[];
