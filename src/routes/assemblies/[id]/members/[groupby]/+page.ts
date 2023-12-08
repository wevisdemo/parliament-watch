import { redirect } from '@sveltejs/kit';
import { getMemberGroup } from './groupby.js';
import { fetchAssemblies, fetchFromIdOr404 } from '../../../../../libs/datasheets/index.js';
import { AssemblyName } from '$models/assembly.js';
import { fetchAssemblyMembers } from '../../data.js';

export async function load({ params }) {
	const assembly = await fetchFromIdOr404(fetchAssemblies, params.id);
	const members = await fetchAssemblyMembers(assembly);
	const isSenates = assembly.name === AssemblyName.Senates;
	const groups = getMemberGroup(assembly, members, params.groupby, isSenates);

	if (!groups) {
		throw redirect(307, `/assemblies/${params.id}/members/party`);
	}

	return { groups };
}
