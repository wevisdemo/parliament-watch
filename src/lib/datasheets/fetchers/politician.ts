import type { Link } from '$models/link';
import type { AssemblyRoleHistory, PartyRoleHistory, Politician } from '$models/politician';
import { joinMany } from '../processor';
import { asValidAssembly, asMarkdownList, asValidParty, asStaticImage } from '../transformers';
import { sheets, withCache } from './shared';
import { asDate, asNumber, asString, Column, createTransformer, Object, Tuple } from 'sheethuahua';

export const fetchPoliticians = withCache('Politicians', async (): Promise<Politician[]> => {
	const politicianSchema = Object({
		id: Column('id', asString()),
		prefix: Column('prefix', asString().optional()),
		firstname: Column('firstname', asString()),
		lastname: Column('lastname', asString()),
		avatar: Column('id', asStaticImage('/images/politicians')),
		sex: Column('sex', asString().optional()),
		birthdate: Column('birthdate', asDate().optional()),
		educations: Column('educations', asMarkdownList().optional([])),
		previousOccupations: Column('previousOccupations', asMarkdownList().optional([])),
		contacts: Tuple([
			Column('facebook', asSocialContact('Facebook').optional()),
			Column('x', asSocialContact('X').optional())
		])
	});

	const partyRoleHistory = await fetchPartyRoleHistory();
	const assemblyRoleHistory = await fetchAssemblyRoleHistory();

	return (await sheets.get('Politicians', politicianSchema)).map((politician) => {
		const partyRoles = joinMany(partyRoleHistory, 'politicianId', politician.id).sort(
			(a, b) => b.startedAt.getTime() - a.startedAt.getTime()
		);
		const assemblyRoles = joinMany(assemblyRoleHistory, 'politicianId', politician.id).sort(
			(a, b) => b.startedAt.getTime() - a.startedAt.getTime()
		);

		return {
			...politician,
			contacts: politician.contacts.filter((c) => c) as Link[],
			partyRoles,
			assemblyRoles,
			isActive:
				assemblyRoles.length > 0 && !assemblyRoles[0].endedAt && !assemblyRoles[0].assembly.endedAt
		};
	});
});

export const fetchAssemblyRoleHistory = withCache(
	'AssemblyRoleHistory',
	async (): Promise<AssemblyRoleHistory[]> => {
		const assemblyRoleSchema = Object({
			politicianId: Column('politicianId', asString()),
			assembly: Column('assemblyId', await asValidAssembly()),
			role: Column('role', asString().optional('สมาชิก')),
			appointmentMethod: Column('appointmentMethod', asString().optional()),
			province: Column('province', asString().optional()),
			districtNumber: Column('districtNumber', asNumber().optional()),
			listNumber: Column('listNumber', asNumber().optional()),
			startedAt: Column('startedAt', asDate()),
			endedAt: Column('endedAt', asDate().optional())
		});

		return sheets.get('AssemblyRoleHistory', assemblyRoleSchema);
	}
);

export const fetchPartyRoleHistory = withCache(
	'PartyRoleHistory',
	async (): Promise<PartyRoleHistory[]> => {
		const partyRoleSchema = Object({
			politicianId: Column('politicianId', asString()),
			party: Column('partyName', await asValidParty()),
			role: Column('role', asString().optional('สมาชิก')),
			startedAt: Column('startedAt', asDate()),
			endedAt: Column('endedAt', asDate().optional())
		});

		return sheets.get('PartyRoleHistory', partyRoleSchema);
	}
);

const asSocialContact = (label: string) =>
	createTransformer(
		(url): Link => ({
			label,
			url
		})
	);
