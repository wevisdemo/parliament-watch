import {
	AssemblyName,
	AssemblyPartyGroup,
	assemblyStaticInfoMap,
	type Assembly
} from '$models/assembly';
import type { Party } from '$models/party';
import { safeFind } from '../processor';
import { fetchParties } from './party';
import { sheets, withCache } from './shared';
import {
	asDate,
	asNumber,
	asOneOf,
	asString,
	Column,
	createTransformer,
	Object,
	type StaticDecode
} from 'sheethuahua';

export const fetchAssemblies = withCache('Assemblies', async (): Promise<Assembly[]> => {
	const parties = await fetchAssemblyPartyGroups();
	const groups = await fetchParties();

	const assemblySchema = Object({
		id: Column('id', asString()),
		name: Column('name', asOneOf(global.Object.values(AssemblyName))),
		term: Column('term', asNumber()),
		startedAt: Column('startedAt', asDate()),
		endedAt: Column('endedAt', asDate().optional()),
		origin: Column('origin', asString().optional()),
		governmentParties: Column('id', asPartyGroup(AssemblyPartyGroup.Government, parties, groups)),
		oppositionParties: Column('id', asPartyGroup(AssemblyPartyGroup.Opposition, parties, groups)),
		mainRoles: Column('name', asMainRoles()),
		abbreviation: Column('name', asAbbreviation())
	});

	return sheets.get('Assemblies', assemblySchema);
});

export const fetchAssemblyPartyGroups = withCache('AssemblyPartyGroups', () =>
	sheets.get('AssemblyPartyGroups', assemblyPartyGroupSchema)
);

const assemblyPartyGroupSchema = Object({
	assemblyId: Column('assemblyId', asString()),
	partyName: Column('partyName', asString()),
	group: Column('group', asOneOf(global.Object.values(AssemblyPartyGroup)))
});

const asPartyGroup = (
	groupName: AssemblyPartyGroup,
	groups: StaticDecode<typeof assemblyPartyGroupSchema>[],
	parties: Party[]
) =>
	createTransformer((id: string) =>
		groups
			.filter(({ assemblyId, group }) => assemblyId === id && group === groupName)
			.map(({ partyName }) => safeFind(parties, ({ name }) => name === partyName))
	);

const asMainRoles = () =>
	createTransformer((name: string) => assemblyStaticInfoMap[name as AssemblyName]?.mainRoles ?? []);

const asAbbreviation = () =>
	createTransformer(
		(name: string) => assemblyStaticInfoMap[name as AssemblyName]?.abbreviation ?? ''
	);
