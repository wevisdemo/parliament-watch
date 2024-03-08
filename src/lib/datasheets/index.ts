import { assemblyPartyGroupSchema, createAssemblySchema } from '$models/assembly';
import { createPartySchema } from '$models/party';
import {
	createAssemblyRoleSchema,
	createPartyRoleSchema,
	createPoliticianSchema
} from '$models/politician';
import { voteSchema } from '$models/vote';
import { createVotingSchema } from '$models/voting';
import { StaticImageResolver } from './image';
import { fetchAndParseSheet } from './processor';
import { error } from '@sveltejs/kit';

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

export const fetchVotes = () => fetchAndParseSheet('Votes', voteSchema);

export const fetchVotings = async () =>
	fetchAndParseSheet('Votings', createVotingSchema(await fetchAssemblies()));

export async function fetchFromIdOr404<T extends { id: string }>(
	fetcher: () => Promise<T[]>,
	id: string
) {
	const data = (await fetcher()).find((item) => item.id === id);

	if (!data) {
		error(404, { message: `id ${id} was not found with ${fetcher.name}` });
	}

	return data;
}
