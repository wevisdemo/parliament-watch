import { redirect } from '@sveltejs/kit';
import { GroupByOption } from './[groupby]/groupby.js';
import { fetchAssemblies, fetchFromIdOr404 } from '../../../../libs/datasheets/index.js';
import { AssemblyName } from '$models/assembly.js';

export async function load({ params }) {
	const assembly = await fetchFromIdOr404(fetchAssemblies, params.id);

	throw redirect(
		307,
		`members/${assembly.name === AssemblyName.Senates ? GroupByOption.Origin : GroupByOption.Party}`
	);
}
