import type { StaticImageResolver } from '$lib/datasheets/image';
import { joinMany, parseMarkdownListToArrayOfItems, safeFind } from '$lib/datasheets/processor';
import type { Assembly } from './assembly';
import type { Link } from './link';
import type { Party } from './party';
import { z } from 'zod';

export const createPoliticianSchema = (
	partyRoleHistory: PartyRoleHistory[],
	assemblyRoleHistory: AssemblyRoleHistory[],
	imageResolver: StaticImageResolver
) =>
	z
		.object({
			id: z.string().trim(),
			prefix: z.string().trim().optional(),
			firstname: z.string().trim(),
			lastname: z.string().trim(),
			sex: z.string().trim(),
			birthdate: z.date().optional(),
			educations: z.string().trim().default(''),
			previousOccupations: z.string().trim().default(''),
			assetValue: z.number().optional(),
			debtValue: z.number().optional(),
			facebook: z.string().trim().optional(),
			x: z.string().trim().optional()
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
				avatar: imageResolver.resolve(`${id}.webp`),
				isActive:
					assemblyRoles.length > 0 &&
					!assemblyRoles[0].endedAt &&
					!assemblyRoles[0].assembly.endedAt,
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
			politicianId: z.string().trim(),
			assemblyId: z.string().trim(),
			role: z.string().trim().default('สมาชิก'),
			appointmentMethod: z.string().trim().optional(),
			province: z.string().trim().optional(),
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
			politicianId: z.string().trim(),
			partyName: z.string().trim(),
			role: z.string().trim().default('สมาชิก'),
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
