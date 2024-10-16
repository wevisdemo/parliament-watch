import { fetchPromises } from '$lib/datasheets';
import type { PromiseSummary } from '$models/promise';

export async function load() {
	const promiseSummaries: PromiseSummary[] = (await fetchPromises()).map(
		({ id, statements, party, keywords, categories, status, progresses }) => ({
			id,
			statements,
			party,
			keywords,
			categories,
			status,
			latestProgressDate: progresses.at(0)?.date
		})
	);

	return {
		promiseSummaries
	};
}
