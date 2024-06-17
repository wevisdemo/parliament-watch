import { fetchAssemblies, fetchFromIdOr404 } from '$lib/datasheets/index.js';
import { AssemblyName, GroupByOption } from '$models/assembly.js';
import { redirect } from '@sveltejs/kit';

export async function load({ params }) {
	const assembly = await fetchFromIdOr404(fetchAssemblies, params.id);

	redirect(
		307,
		`members/${
			assembly.name === AssemblyName.Senates ? GroupByOption.AppointmentMethod : GroupByOption.Party
		}`
	);
}
