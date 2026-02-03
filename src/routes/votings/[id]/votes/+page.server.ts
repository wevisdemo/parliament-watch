import { graphql } from '$lib/politigraph/server';
import {
	queryPoliticiansVote,
	sortPoliticiansVoteByDominantGroup
} from '$lib/politigraph/vote/with-politician';
import { createSeo } from '$lib/seo';
import type { CustomVoteOption } from '$models/voting';
import { defaultVoteOptions } from '$models/voting';
import { error } from '@sveltejs/kit';
import { groups } from 'd3';

interface FilterOptions {
	parties: string[];
	roles: string[];
	voteOptions: string[];
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
			organizations: {
				id: true
			},
			start_date: true,
			end_date: true
		}
	});

	if (!voteEvent) {
		error(404);
	}

	const votes = sortPoliticiansVoteByDominantGroup(await queryPoliticiansVote(voteEvent));

	const nonDefaultVotes = groups(
		votes.filter((vote) => vote.option && !defaultVoteOptions.includes(vote.option)),
		(vote) => vote.option
	).sort((a, z) => z[1].length - a[1].length);

	const customVoteOptions = nonDefaultVotes.map<CustomVoteOption>(([label], i) => ({
		label,
		colorIntensity: 1 - i / nonDefaultVotes.length
	}));

	const filterOptions: FilterOptions = {
		parties: getSortedUniqueValue(
			votes.map((v) => v.party).filter((p) => p !== undefined) as { name: string }[],
			'name'
		),
		roles: getSortedUniqueValue(votes, 'role').reverse(),
		voteOptions: [
			...customVoteOptions.map(({ label }) => label),
			...defaultVoteOptions.filter((option) => votes.some((vote) => vote.option === option))
		]
	};

	return {
		voteEvent,
		filterOptions,
		customVoteOptions,
		votes,
		seo: createSeo({
			title: `ผลการลงมติรายคน ${voteEvent.nickname || voteEvent.title}`
		})
	};
}

const getSortedUniqueValue = <T extends { [key: string]: unknown }>(
	list: T[],
	key: keyof T
): string[] =>
	[...new Set(list.map((item) => item[key]).filter((item) => item) as string[])].sort((a, z) =>
		a.localeCompare?.(z)
	);
