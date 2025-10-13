import { graphql } from '$lib/politigraph';
import { getRoleChanges } from '$lib/politigraph/assembly/change';
import {
	queryAssemblyMembers,
	parseMemberWithAssemblyRoles
} from '$lib/politigraph/assembly/member';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const {
		organizations: [assembly]
	} = await graphql.query({
		organizations: {
			__args: {
				where: {
					id_EQ: params.id
				},
				limit: 1
			},
			id: true,
			name: true,
			classification: true,
			term: true,
			description: true,
			founding_date: true,
			dissolution_date: true
		}
	});

	if (!assembly) {
		error(404);
	}

	const { organizations: availableAssemblies } = await graphql.query({
		organizations: {
			__args: {
				where: {
					classification_EQ: assembly.classification
				}
			},
			id: true,
			term: true
		}
	});

	const members = await queryAssemblyMembers(assembly);
	const changes = getRoleChanges(assembly.id, members);

	return {
		assembly: {
			id: assembly.id,
			name: assembly.name,
			term: assembly.term as number,
			description: assembly.description,
			startedAt: new Date(assembly.founding_date as string),
			endedAt: assembly.dissolution_date ? new Date(assembly.dissolution_date) : undefined
		},
		availableAssemblies,
		cabinetPositions: members.flatMap(parseMemberWithAssemblyRoles),
		changes
	};
}
