import { getLatestTerm } from '$lib/politigraph/assembly/term';
import { getLatestAssemblyClassification } from '../classification';
import { redirect, error } from '@sveltejs/kit';

export async function load({ params }) {
	const classification = getLatestAssemblyClassification(params.classification);

	if (!classification) {
		throw error(404);
	}

	const latestTerm = await getLatestTerm(classification);

	if (!latestTerm) {
		throw redirect(307, '/');
	}

	throw redirect(307, `/assemblies/${encodeURIComponent(latestTerm.id)}/votes`);
}
