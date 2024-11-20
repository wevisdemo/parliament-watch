import type { AvailableAssembly } from '$components/Assemblies/AssemblyIdRunner.svelte';
import { getAssemblyMembers } from '$lib/datasheets/assembly-member';
import {
	fetchAssemblies,
	fetchAssemblyRoleHistory,
	fetchFromIdOr404,
	fetchPoliticians
} from '$lib/datasheets/index';
import { AssemblyName } from '$models/assembly';
import type { AssemblyRoleHistory, PartyRoleHistory, Politician } from '$models/politician';
import type { MainMember, RoleChange } from '../+page.server';
import { error } from '@sveltejs/kit';

export type AssemblyRoleSummary = Pick<
	AssemblyRoleHistory,
	'politicianId' | 'role' | 'startedAt' | 'endedAt'
>;

export type AssemblyMember = Omit<Politician, 'assemblyRoles'>;

function parseMainMember(member: ReturnType<typeof getAssemblyMembers>[number]): MainMember {
	const { id, firstname, lastname, avatar, partyRole, assemblyRole } = member;

	return {
		assemblyRole: assemblyRole?.role || '',
		politician: {
			id,
			firstname,
			lastname,
			avatar
		},
		party: partyRole?.party,
		description: assemblyRole?.appointmentMethod || null
	};
}

export async function load({ params }) {
	const assembly = await fetchFromIdOr404(fetchAssemblies, params.id);

	if (assembly.name !== AssemblyName.Cabinet) {
		error(404, { message: `Currently, changes only available for the cabinet` });
	}

	const availableAssemblies: AvailableAssembly[] = (await fetchAssemblies()).map((a) => ({
		id: a.id,
		name: a.name,
		term: a.term
	}));

	const assemblyRoles: AssemblyRoleSummary[] = (await fetchAssemblyRoleHistory())
		.filter(({ assembly: { id }, role }) => id === assembly.id && role)
		.map((ar) => ({
			politicianId: ar.politicianId,
			role: ar.role,
			startedAt: ar.startedAt,
			endedAt: ar.endedAt
		}));

	const members = (await fetchPoliticians()).filter((p) =>
		assemblyRoles.some((ar) => p.id === ar.politicianId)
	);

	const assemblyMembers = getAssemblyMembers(assembly, members);

	const changes: RoleChange[] = [];
	for (const member of members) {
		member.assemblyRoles.forEach((role) => {
			if (role.assembly.name !== AssemblyName.Cabinet || role.assembly.id !== assembly.id) {
				return;
			}
			changes.push({
				date: role.startedAt,
				type: 'in',
				role: role.role,
				politician: {
					...member,
					party: getPartyRoleAtDate(member.partyRoles, role.startedAt)
				}
			});

			if (role.endedAt) {
				changes.push({
					date: role.endedAt,
					type: 'out',
					role: role.role,
					politician: {
						...member,
						party: getPartyRoleAtDate(member.partyRoles, role.endedAt)
					}
				});
			}
		});
	}

	return {
		assembly: {
			id: assembly.id,
			abbreviation: assembly.abbreviation,
			name: assembly.name,
			term: assembly.term,
			startedAt: assembly.startedAt,
			endedAt: assembly.endedAt
		},
		availableAssemblies,
		assemblyRoles,
		cabinetMembers: assemblyMembers.map(parseMainMember),
		changes: changes
	};
}

function getPartyRoleAtDate(
	partyRoles: Omit<PartyRoleHistory, 'politicianId'>[],
	date: Date
): PartyRoleHistory['party'] {
	const maybePartyRole = partyRoles
		.filter(({ startedAt, endedAt }) => startedAt <= date && (!endedAt || date < endedAt))
		.sort((a, z) => z.startedAt.getTime() - a.startedAt.getTime())
		.at(-1);

	return maybePartyRole?.party || { name: 'ไม่สังกัดพรรค', color: 'gray', logo: '' };
}
