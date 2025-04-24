import { graphql } from '$lib/politigraph.js';
import { GroupByOption } from '$models/assembly.js';
import { error, redirect } from '@sveltejs/kit';

export async function load({ params }) {
	const {
		organizations: [assembly]
	} = await graphql.query({
		organizations: {
			__args: {
				where: {
					id_EQ: params.id
				}
			},
			classification: true
		}
	});

	if (!assembly) {
		error(404);
	}

	redirect(
		307,
		`members/${
			assembly.classification === 'HOUSE_OF_SENATE'
				? GroupByOption.AppointmentMethod
				: GroupByOption.Party
		}`
	);
}
