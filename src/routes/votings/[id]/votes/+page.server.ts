import { graphql } from '$lib/politigraph/index';
import {
	queryPoliticiansVote,
	sortPoliticiansVoteByDominantGroup
} from '$lib/politigraph/vote/with-politician';
import { createSeo } from '$lib/seo';
import { defaultVoteOptions } from '$models/voting';
import { error } from '@sveltejs/kit';

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
					id_EQ: params.id
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

	const filterOptions: FilterOptions = {
		parties: getSortedUniqueValue(
			votes.map((v) => v.party).filter((p) => p !== undefined) as { name: string }[],
			'name'
		),
		roles: getSortedUniqueValue(votes, 'role').reverse(),
		voteOptions: defaultVoteOptions
	};

	return {
		voteEvent,
		filterOptions,
		votes,
		seo: createSeo({
			title: `ผลการลงมติรายคน ${voteEvent.nickname ?? voteEvent.title}`
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
