import { fetchAndParseSheet } from './processor';
import { assemblyPartyGroupSchema, createAssemblySchema } from '$models/assembly';
import { createPartySchema } from '$models/party';
import {
	createAssemblyRoleSchema,
	createPartyRoleSchema,
	createPoliticianSchema
} from '$models/politician';
import { error } from '@sveltejs/kit';
import { StaticImageResolver } from './image';
import { votingSchema } from '$models/voting';

export const fetchParties = () =>
	fetchAndParseSheet('Parties', createPartySchema(new StaticImageResolver('/images/parties')));

export const fetchAssemblyPartyGroups = () =>
	fetchAndParseSheet('AssemblyPartyGroups', assemblyPartyGroupSchema);

export const fetchAssemblies = async () =>
	fetchAndParseSheet(
		'Assemblies',
		createAssemblySchema(await fetchParties(), await fetchAssemblyPartyGroups())
	);

export const fetchAssemblyRoleHistory = async () =>
	fetchAndParseSheet('AssemblyRoleHistory', createAssemblyRoleSchema(await fetchAssemblies()));

export const fetchPartyRoleHistory = async () =>
	fetchAndParseSheet('PartyRoleHistory', createPartyRoleSchema(await fetchParties()));

export const fetchPoliticians = async () =>
	fetchAndParseSheet(
		'Politicians',
		createPoliticianSchema(
			await fetchPartyRoleHistory(),
			await fetchAssemblyRoleHistory(),
			new StaticImageResolver('/images/politicians')
		)
	);

export const fetchVotings = () => fetchAndParseSheet('Votings', votingSchema);

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
