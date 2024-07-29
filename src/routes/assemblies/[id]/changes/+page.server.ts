import type { AvailableAssembly } from '$components/Assemblies/AssemblyIdRunner.svelte';
import { getAssemblyMembers } from '$lib/datasheets/assembly-member';
import {
	fetchAssemblies,
	fetchAssemblyRoleHistory,
	fetchFromIdOr404,
	fetchPoliticians
} from '$lib/datasheets/index';
import { AssemblyName } from '$models/assembly';
import type { AssemblyRoleHistory, Politician } from '$models/politician';
import type { MainMember } from '../+page.server';
import { error } from '@sveltejs/kit';
import dayjs from 'dayjs';

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
	const fullAssembly = await fetchFromIdOr404(fetchAssemblies, params.id);

	if (fullAssembly.name !== AssemblyName.Cabinet) {
		error(404, { message: `Currently, changes only available for the cabinet` });
	}

	const { mainRoles, ...assembly } = fullAssembly;

	const availableAssemblies: AvailableAssembly[] = (await fetchAssemblies()).map((a) => ({
		id: a.id,
		name: a.name,
		term: a.term
	}));

	const assemblyRoles: AssemblyRoleSummary[] = (await fetchAssemblyRoleHistory())
		.filter(({ assembly, role }) => assembly.id === fullAssembly.id && role)
		.map((ar) => ({
			politicianId: ar.politicianId,
			role: ar.role,
			startedAt: ar.startedAt,
			endedAt: ar.endedAt
		}));

	const members = (await fetchPoliticians()).filter((p) =>
		assemblyRoles.some((ar) => p.id === ar.politicianId)
	);

	const activeMembers = getAssemblyMembers(fullAssembly, members).filter(
		({ assemblyRole }) =>
			!assemblyRole?.endedAt ||
			(assembly.endedAt && dayjs(assembly.endedAt).isSame(assemblyRole.endedAt))
	);

	return {
		assembly: {
			id: fullAssembly.id,
			name: fullAssembly.name,
			term: fullAssembly.term,
			startedAt: fullAssembly.startedAt,
			endedAt: fullAssembly.endedAt
		},
		availableAssemblies,
		assemblyRoles,
		cabinetMembers: activeMembers.map(parseMainMember)
	};
}
