import { fetchPoliticians } from '$lib/datasheets/index.js';
import { SearchIndexCategory, type SearchIndexes } from '$models/search';
import { error } from '@sveltejs/kit';
import { searchIndexes } from '../../../../mocks/data/searchIndexes.js';

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
				});

			return createJSONFileResponse(indexes);
		}

		case SearchIndexCategory.Bills: {
			return createJSONFileResponse(searchIndexes.bills);
		}

		case SearchIndexCategory.BillProposers: {
			return createJSONFileResponse(searchIndexes.billProposers);
		}

		case SearchIndexCategory.Votings: {
			return createJSONFileResponse(searchIndexes.votings);
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
