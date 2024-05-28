import { assemblyPartyGroupTable, assemblyTable, transformAssembly } from '$models/assembly';
import { billTable, transformBill } from '$models/bill';
import { billEventTable, transformBillEvent } from '$models/bill-event';
import { partyTable, transformParty } from '$models/party';
import {
	assemblyRoleTable,
	partyRoleTable,
	politicianTable,
	transformAssemblyRole,
	transformPartyRole,
	transformPolitician
} from '$models/politician';
import { transformVote, voteTable } from '$models/vote';
import { transformVoting, votingTable } from '$models/voting';
import { StaticImageResolver } from './image';
import { error } from '@sveltejs/kit';
import { Spreadsheet } from 'sheethuahua';

const sheets = Spreadsheet('1SbX2kgAGsslbhGuB-EI_YdSAnIt3reU1_OEtWmDVOVk', [
	assemblyTable,
	assemblyPartyGroupTable,
	assemblyRoleTable,
	billTable,
	billEventTable,
	partyTable,
	politicianTable,
	partyRoleTable,
	assemblyRoleTable,
	voteTable,
	votingTable
]);

type SheetName = Parameters<typeof sheets.get>[0];

const sheetCaches = new Map<SheetName, object[]>();

export const fetchParties = withCache('Parties', async () =>
	(await sheets.get('Parties')).map((party) =>
		transformParty(party, new StaticImageResolver('/images/parties'))
	)
);

export const fetchAssemblyPartyGroups = withCache('AssemblyPartyGroups', () =>
	sheets.get('AssemblyPartyGroups')
);

export const fetchAssemblies = withCache('Assemblies', async () => {
	const assemblies = await sheets.get('Assemblies');
	const parties = await fetchParties();
	const assemblyPartyGroups = await fetchAssemblyPartyGroups();
	return assemblies.map((assembly) => transformAssembly(assembly, parties, assemblyPartyGroups));
});

export const fetchAssemblyRoleHistory = withCache('AssemblyRoleHistory', async () => {
	const roles = await sheets.get('AssemblyRoleHistory');
	const assemblies = await fetchAssemblies();
	return roles.map((role) => transformAssemblyRole(role, assemblies));
});

export const fetchPartyRoleHistory = withCache('PartyRoleHistory', async () => {
	const roles = await sheets.get('PartyRoleHistory');
	const parties = await fetchParties();
	return roles.map((role) => transformPartyRole(role, parties));
});

export const fetchPoliticians = withCache('Politicians', async () => {
	const politicians = await sheets.get('Politicians');
	const partieRoles = await fetchPartyRoleHistory();
	const assemblyRoles = await fetchAssemblyRoleHistory();
	return (
		politicians
			.map((politician) =>
				transformPolitician(
					politician,
					partieRoles,
					assemblyRoles,
					new StaticImageResolver('/images/politicians')
				)
			)
			// TODO: Currently, we only show politicians that belong to any assemblies we have
			.filter((p) => p.assemblyRoles.length)
	);
});

export const fetchVotes = withCache('Votes', async () =>
	(await sheets.get('Votes')).map(transformVote)
);

export const fetchVotings = withCache('Votings', async () => {
	const votings = await sheets.get('Votings');
	const assemblies = await fetchAssemblies();
	return votings.map((voting) => transformVoting(voting, assemblies));
});

export const fetchBills = withCache('Bills', async () => {
	const bills = await sheets.get('Bills');
	const politicians = await fetchPoliticians();
	const assemblies = await fetchAssemblies();
	return bills.map((bill) => transformBill(bill, politicians, assemblies));
});

export const fetchBillEvents = withCache('BillEvents', async () =>
	(await sheets.get('BillEvents')).map(transformBillEvent)
);

function withCache<T extends object[]>(key: SheetName, getter: () => Promise<T>) {
	return async (): Promise<T> => {
		if (!sheetCaches.has(key)) {
			sheetCaches.set(key, await getter());
		}

		return sheetCaches.get(key) as T;
	};
}

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
