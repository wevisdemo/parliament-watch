import { error, redirect } from '@sveltejs/kit';
import { GroupByOption } from './[groupby]/groupby-options.js';
import { fetchAssemblies } from '../../../../libs/datasheets/index.js';
import { AssemblyName } from '$models/assembly.js';

export async function load({ params }) {
	const assembly = (await fetchAssemblies()).find(({ id }) => id === params.id);

	if (!assembly) {
		throw error(404, `Assembly ${params.id} not found`);
	}

	throw redirect(
		307,
		`/assemblies/${params.id}/members/${
			assembly.name === AssemblyName.Senates ? GroupByOption.Origin : GroupByOption.Party
		}`
	);
}
