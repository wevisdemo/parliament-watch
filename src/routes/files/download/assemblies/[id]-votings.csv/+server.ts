import { createCsvFileResponse } from '$lib/csv';
import type { VoteEvent } from '$lib/politigraph/genql/schema';
import { graphql } from '$lib/politigraph/server';
import { error } from '@sveltejs/kit';

export const prerender = true;

export async function GET({ params }) {
	const {
		organizations: [assembly]
	} = await graphql.query({
		organizations: {
			__args: {
				where: {
					id_EQ: params.id
				}
			},
			events: {
				on_VoteEvent: {
					start_date: true,
					end_date: true,
					nickname: true,
					title: true,
					result: true
				}
			}
		}
	});

	if (!assembly) {
		error(404);
	}

	return createCsvFileResponse(
		(assembly.events.filter((event) => 'title' in event) as Partial<VoteEvent>[]).map(
			({ start_date, end_date, nickname, title, result }) => ({
				start_date,
				end_date,
				nickname,
				title,
				result
			})
		)
	);
}
