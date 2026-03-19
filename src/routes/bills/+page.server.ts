import { getLatestTerm } from '$lib/politigraph/assembly/term';
import { redirect } from '@sveltejs/kit';

export async function load() {
	const latestMpTerm = await getLatestTerm('HOUSE_OF_REPRESENTATIVE');

	if (!latestMpTerm) {
		throw redirect(301, '/');
	}

	throw redirect(301, `/bills/term/${encodeURIComponent(latestMpTerm.id)}`);
}
