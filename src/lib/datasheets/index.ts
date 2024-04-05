import { assemblyPartyGroupSchema, createAssemblySchema } from '$models/assembly';
import { createBillSchema } from '$models/bill';
import { billEventSchema } from '$models/bill-event';
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
	(
		await fetchAndParseSheet(
			'Politicians',
			createPoliticianSchema(
				await fetchPartyRoleHistory(),
				await fetchAssemblyRoleHistory(),
				new StaticImageResolver('/images/politicians')
			)
		)
	) // TODO: Currently, we only show politicians that belong to any assemblies we have
		.filter(({ assemblyRoles }) => assemblyRoles.length);

export const fetchVotes = () => fetchAndParseSheet('Votes', voteSchema);

export const fetchVotings = async () =>
	fetchAndParseSheet('Votings', createVotingSchema(await fetchAssemblies()));

export const fetchBills = async () =>
	fetchAndParseSheet('Bills', createBillSchema(await fetchPoliticians(), await fetchAssemblies()));

export const fetchBillEvents = () => fetchAndParseSheet('BillEvents', billEventSchema);

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
