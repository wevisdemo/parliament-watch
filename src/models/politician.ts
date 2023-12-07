import { z } from 'zod';
import type { Assembly } from './assembly';
import type { Link } from './link';
import type { Party } from './party';
import { joinMany, parseMarkdownListToArrayOfItems, safeFind } from '../libs/datasheets/processor';

export const createPoliticianSchema = (
	partyRoleHistory: PartyRoleHistory[],
	assemblyRoleHistory: AssemblyRoleHistory[]
) =>
	z
		.object({
			id: z.string(),
			prefix: z.string().optional(),
			firstname: z.string(),
			lastname: z.string(),
			sex: z.string(),
			// TODO: add mock default birthdate while the data table is not filled up completely
			birthdate: z.date().default(new Date('1800-01-01')),
			educations: z.string().default(''),
			previousOccupations: z.string().default(''),
			assetValue: z.number().optional(),
			debtValue: z.number().optional(),
			facebook: z.string().optional(),
			x: z.string().optional()
		})
		.transform(({ id, educations, previousOccupations, facebook, x, ...rest }) => {
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
				// TODO: add avatar url
				avatar: `https://placehold.co/600x400?text=pol`,
				isActive: !assemblyRoles[0]?.endedAt,
				educations: parseMarkdownListToArrayOfItems(educations),
				previousOccupations: parseMarkdownListToArrayOfItems(previousOccupations),
				partyRoles,
				assemblyRoles,
				contacts
			};
		});

export const createAssemblyRoleSchema = (assemblies: Assembly[]) =>
	z
		.object({
			politicianId: z.string(),
			assemblyId: z.string(),
			role: z.string().optional(),
			appointmentMethod: z.string().optional(),
			province: z.string().optional(),
			districtNumber: z.number().optional(),
			listNumber: z.number().optional(),
			startedAt: z.date(),
			endedAt: z.date().optional()
		})
		.transform(({ assemblyId, ...rest }) => ({
			...rest,
			assembly: safeFind(assemblies, ({ id }) => id === assemblyId)
		}));

export const createPartyRoleSchema = (parties: Party[]) =>
	z
		.object({
			politicianId: z.string(),
			partyName: z.string(),
			role: z.string().optional(),
			// TODO: add mock default startedAt while the data table is not filled up completely
			startedAt: z.date().default(new Date('2019-01-01')),
			endedAt: z.date().optional()
		})
		.transform(({ partyName, ...rest }) => ({
			...rest,
			party: safeFind(parties, ({ name }) => name === partyName)
		}));

export type Politician = z.infer<ReturnType<typeof createPoliticianSchema>>;
export type AssemblyRoleHistory = z.infer<ReturnType<typeof createAssemblyRoleSchema>>;
export type PartyRoleHistory = z.infer<ReturnType<typeof createPartyRoleSchema>>;
