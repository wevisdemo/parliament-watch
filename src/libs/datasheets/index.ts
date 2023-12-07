import { fetchAndParseSheet } from './processor';
import { assemblySchema } from '$models/assembly';
import { partySchema } from '$models/party';
import {
	createAssemblyRoleSchema,
	createPartyRoleSchema,
	createPoliticianSchema
} from '$models/politician';

export const fetchAssemblies = () => fetchAndParseSheet('Assemblies', assemblySchema);
export const fetchParties = () => fetchAndParseSheet('Parties', partySchema);

export const fetchAssemblyRoleHistory = async () =>
	fetchAndParseSheet('AssemblyRoleHistory', createAssemblyRoleSchema(await fetchAssemblies()));

export const fetchPartyRoleHistory = async () =>
	fetchAndParseSheet('PartyRoleHistory', createPartyRoleSchema(await fetchParties()));

export const fetchPoliticians = async () =>
	fetchAndParseSheet(
		'Politicians',
		createPoliticianSchema(await fetchPartyRoleHistory(), await fetchAssemblyRoleHistory())
	);
