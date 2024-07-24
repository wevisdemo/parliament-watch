import type { AvailableAssembly } from '$components/Assemblies/AssemblyIdRunner.svelte';
import {
	fetchAssemblies,
	fetchAssemblyRoleHistory,
	fetchFromIdOr404,
	fetchPoliticians
} from '$lib/datasheets/index';
import { AssemblyName } from '$models/assembly';
import type { AssemblyRoleHistory, Politician } from '$models/politician';
import { error } from '@sveltejs/kit';

export type AssemblyRoleSummary = Pick<
	AssemblyRoleHistory,
	'politicianId' | 'role' | 'startedAt' | 'endedAt'
>;

export type AssemblyMember = Omit<Politician, 'assemblyRoles'>;

export async function load({ params }) {
	const { id, name, term, startedAt, endedAt } = await fetchFromIdOr404(fetchAssemblies, params.id);

	if (name !== AssemblyName.Cabinet) {
		error(404, { message: `Currently, changes only available for the cabinet` });
	}

	const availableAssemblies: AvailableAssembly[] = (await fetchAssemblies()).map((a) => ({
		id: a.id,
		name: a.name,
		term: a.term
	}));

	const assemblyRoles: AssemblyRoleSummary[] = (await fetchAssemblyRoleHistory())
		.filter(({ assembly, role }) => assembly.id === id && role)
		.map((ar) => ({
			politicianId: ar.politicianId,
			role: ar.role,
			startedAt: ar.startedAt,
			endedAt: ar.endedAt
		}));

	const members: AssemblyMember[] = (await fetchPoliticians())
		.filter((p) => assemblyRoles.some((ar) => p.id === ar.politicianId))
		.map(({ assemblyRoles, ...rest }) => rest);

	return {
		assembly: {
			id,
			name,
			term,
			startedAt,
			endedAt
		},
		availableAssemblies,
		assemblyRoles,
		members
	};
}
