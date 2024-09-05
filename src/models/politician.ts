import type { StaticImageResolver } from '$lib/datasheets/image';
import { joinMany, parseMarkdownListToArrayOfItems, safeFind } from '$lib/datasheets/processor';
import type { Assembly } from './assembly';
import type { Link } from './link';
import type { Party } from './party';
import { Table, Column, type RowType } from 'sheethuahua';

export const politicianTable = Table('Politicians', {
	id: Column.String(),
	prefix: Column.OptionalString(),
	firstname: Column.String(),
	lastname: Column.String(),
	sex: Column.OptionalString(),
	birthdate: Column.OptionalDate(),
	educations: Column.OptionalString(),
	previousOccupations: Column.OptionalString(),
	facebook: Column.OptionalString(),
	x: Column.OptionalString()
});

export function transformPolitician(
	{ id, educations, previousOccupations, facebook, x, ...rest }: RowType<typeof politicianTable>,
	partyRoleHistory: PartyRoleHistory[],
	assemblyRoleHistory: AssemblyRoleHistory[],
	imageResolver: StaticImageResolver
) {
	const contacts: Link[] = [];
	const partyRoles = joinMany(partyRoleHistory, 'politicianId', id).sort(
		(a, b) => b.startedAt.getTime() - a.startedAt.getTime()
	);
	const assemblyRoles = joinMany(assemblyRoleHistory, 'politicianId', id).sort(
		(a, b) => b.startedAt.getTime() - a.startedAt.getTime()
	);

	if (facebook) contacts.push({ label: 'Facebook', url: facebook });
	if (x) contacts.push({ label: 'X', url: x });
	return {
		id,
		...rest,
		avatar: imageResolver.resolve(`${id}.webp`),
		isActive:
			assemblyRoles.length > 0 && !assemblyRoles[0].endedAt && !assemblyRoles[0].assembly.endedAt,
		educations: parseMarkdownListToArrayOfItems(educations || ''),
		previousOccupations: parseMarkdownListToArrayOfItems(previousOccupations || ''),
		partyRoles,
		assemblyRoles,
		contacts
	};
}

export const assemblyRoleTable = Table('AssemblyRoleHistory', {
	politicianId: Column.String(),
	assemblyId: Column.String(),
	role: Column.OptionalString(),
	appointmentMethod: Column.OptionalString(),
	province: Column.OptionalString(),
	districtNumber: Column.OptionalNumber(),
	listNumber: Column.OptionalNumber(),
	startedAt: Column.Date(),
	endedAt: Column.OptionalDate()
});

export const transformAssemblyRole = (
	{ role, assemblyId, ...rest }: RowType<typeof assemblyRoleTable>,
	assemblies: Assembly[]
) => ({
	...rest,
	role: role || 'สมาชิก',
	assembly: safeFind(assemblies, ({ id }) => id === assemblyId)
});

export const partyRoleTable = Table('PartyRoleHistory', {
	politicianId: Column.String(),
	partyName: Column.String(),
	role: Column.OptionalString(),
	startedAt: Column.Date(),
	endedAt: Column.OptionalDate()
});

export const transformPartyRole = (
	{ role, partyName, ...rest }: RowType<typeof partyRoleTable>,
	parties: Party[]
) => ({
	...rest,
	role: role || 'สมาชิก',
	party: safeFind(parties, ({ name }) => name === partyName)
});

export type Politician = ReturnType<typeof transformPolitician>;
export type AssemblyRoleHistory = ReturnType<typeof transformAssemblyRole>;
export type PartyRoleHistory = ReturnType<typeof transformPartyRole>;
