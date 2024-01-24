import { fetchPoliticians, fetchVotings } from '$lib/datasheets/index.js';
import { SearchIndexCategory, type SearchIndexes } from '$models/search';
import { error } from '@sveltejs/kit';

export const prerender = true;

export const entries = () => Object.values(SearchIndexCategory).map((category) => ({ category }));

export async function GET({ params }) {
	switch (params.category) {
		case SearchIndexCategory.Politicians: {
			const indexes: SearchIndexes['politicians'] = (await fetchPoliticians())
				// TODO: Currently, we only show politicians that appears in the assemblies
				.filter(({ assemblyRoles }) => assemblyRoles.length)
				.map(({ id, firstname, lastname, assemblyRoles, partyRoles }) => {
					const currentAssembly = assemblyRoles.find(({ endedAt }) => !endedAt);
					const currentParty = partyRoles.find(({ endedAt }) => !endedAt);

					return {
						id,
						name: `${firstname} ${lastname}`,
						description: [
							currentAssembly
								? currentAssembly.assembly.abbreviation + currentAssembly.appointmentMethod
								: null,
							currentParty?.party.name
						]
							.filter((text) => text)
							.join(' | ')
					};
				})
				.sort((a, z) => a.id.localeCompare(z.id));

			return createJSONFileResponse(indexes);
		}

		case SearchIndexCategory.Bills: {
			// TODO: Not release bill yet
			return createJSONFileResponse([]);
		}

		case SearchIndexCategory.BillProposers: {
			// TODO: Not release bill yet
			return createJSONFileResponse([]);
		}

		case SearchIndexCategory.Votings: {
			const indexes: SearchIndexes['votings'] = (await fetchVotings())
				.map(({ id, title, result }) => ({
					id,
					name: title,
					result: result
				}))
				.sort((a, z) => a.id.localeCompare(z.id));

			return createJSONFileResponse(indexes);
		}

		default:
			error(404);
	}
}

const createJSONFileResponse = (indexes: SearchIndexes[SearchIndexCategory]) =>
	new Response(JSON.stringify(indexes), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
