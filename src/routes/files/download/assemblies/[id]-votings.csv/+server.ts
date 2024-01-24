import { createCsvFileResponse } from '$lib/csv';
import { fetchAssemblies, fetchFromIdOr404, fetchVotings } from '$lib/datasheets';

export const prerender = true;

export async function GET({ params }) {
	const assembly = await fetchFromIdOr404(fetchAssemblies, params.id);

	const votes = (await fetchVotings())
		.filter(({ participatedAssemblies }) =>
			participatedAssemblies.some((pa) => assembly.id === pa.id)
		)
		.sort((a, z) => z.date.getTime() - a.date.getTime());

	return createCsvFileResponse(
		votes.map(({ date, title, officialTitle, result, categories }) => ({
			date,
			title,
			officialTitle,
			result,
			categories
		}))
	);
}
