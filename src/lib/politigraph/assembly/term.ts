import { graphql } from '$lib/politigraph/client';
import type { OrganizationType } from '$lib/politigraph/genql';

export type LatestAssemblyClassification = Extract<
	OrganizationType,
	'HOUSE_OF_REPRESENTATIVE' | 'HOUSE_OF_SENATE' | 'CABINET'
>;

export async function getLatestTerm(classification: LatestAssemblyClassification) {
	return (
		await graphql.query({
			organizations: {
				__args: {
					sort: [{ founding_date: 'DESC' }],
					where: {
						classification: { eq: classification }
					},
					limit: 1
				},
				id: true,
				term: true
			}
		})
	).organizations[0];
}
