import { graphql } from '$lib/politigraph/server';
import { redirect } from '@sveltejs/kit';

export async function load() {
	const latestMpTerm = (
		await graphql.query({
			organizations: {
				__args: {
					sort: [{ founding_date: 'DESC' }],
					where: {
						classification: { eq: 'HOUSE_OF_REPRESENTATIVE' }
					},
					limit: 1
				},
				id: true
			}
		})
	).organizations[0];

	if (!latestMpTerm) {
		throw redirect(301, '/');
	}

	throw redirect(301, `/bills/term/${encodeURIComponent(latestMpTerm.id)}`);
}
