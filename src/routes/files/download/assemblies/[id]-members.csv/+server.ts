import { createCsvFileResponse } from '$lib/csv';
import { fetchAssemblies, fetchFromIdOr404 } from '$lib/datasheets';
import { fetchAssemblyMembers } from '../../../../assemblies/[id]/data';

export const prerender = true;

export async function GET({ params }) {
	const assembly = await fetchFromIdOr404(fetchAssemblies, params.id);
	const members = await fetchAssemblyMembers(assembly);

	return createCsvFileResponse(
		members.map(
			({ prefix, firstname, lastname, sex, birthdate, educations, assemblyRole, partyRole }) => ({
				prefix,
				firstname,
				lastname,
				sex,
				birthdate,
				educations: educations.join(','),
				role: assemblyRole?.role,
				appointmentMethod: assemblyRole?.appointmentMethod,
				party: partyRole?.party.name,
				province: assemblyRole?.province,
				districtNumber: assemblyRole?.districtNumber,
				listNumber: assemblyRole?.listNumber,
				startedAt: assemblyRole?.startedAt,
				endedAt: assemblyRole?.endedAt
			})
		)
	);
}
