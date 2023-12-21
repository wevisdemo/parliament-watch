import { redirect } from '@sveltejs/kit';
import { fetchAssemblies, fetchFromIdOr404 } from '$lib/datasheets/index.js';
import { AssemblyName, GroupByOption } from '$models/assembly.js';

export async function load({ params }) {
	const assembly = await fetchFromIdOr404(fetchAssemblies, params.id);

	throw redirect(
		307,
		`members/${
			assembly.name === AssemblyName.Senates ? GroupByOption.AppointmentMethod : GroupByOption.Party
		}`
	);
}
