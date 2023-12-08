import { fetchAndParseSheet } from './processor';
import { createAssemblySchema } from '$models/assembly';
import { partySchema } from '$models/party';
import {
	createAssemblyRoleSchema,
	createPartyRoleSchema,
	createPoliticianSchema
} from '$models/politician';
import { error } from '@sveltejs/kit';

export const fetchParties = () => fetchAndParseSheet('Parties', partySchema);

export const fetchAssemblies = async () =>
	fetchAndParseSheet('Assemblies', createAssemblySchema(await fetchParties()));

export const fetchAssemblyRoleHistory = async () =>
	fetchAndParseSheet('AssemblyRoleHistory', createAssemblyRoleSchema(await fetchAssemblies()));

export const fetchPartyRoleHistory = async () =>
	fetchAndParseSheet('PartyRoleHistory', createPartyRoleSchema(await fetchParties()));

export const fetchPoliticians = async () =>
	fetchAndParseSheet(
		'Politicians',
		createPoliticianSchema(await fetchPartyRoleHistory(), await fetchAssemblyRoleHistory())
	);

export async function fetchFromIdOr404<T extends { id: string }>(
	fetcher: () => Promise<T[]>,
	id: string
) {
	const data = (await fetcher()).find((item) => item.id === id);

	if (!data) {
		throw error(404, { message: `id ${id} was not found with ${fetcher.name}` });
	}

	return data;
}
