import { promiseSummaries } from '../../../mocks/data/promise';

export async function load({ url }) {
	const keyword = decodeURIComponent(url.searchParams.get('keyword') ?? '');
	const category = decodeURIComponent(url.searchParams.get('category') ?? '');
	const party = decodeURIComponent(url.searchParams.get('party') ?? '');

	let filteredPromiseSummaries = promiseSummaries;

	if (!keyword && !category && !party) {
		return { promiseSummaries: [] };
	}

	if (keyword) {
		filteredPromiseSummaries = filteredPromiseSummaries.filter((promise) =>
			promise.keywords.some((k) => k.includes(keyword.trim()))
		);
	}

	if (category) {
		filteredPromiseSummaries = filteredPromiseSummaries.filter((promise) =>
			promise.categories.includes(category)
		);
	}

	if (party) {
		filteredPromiseSummaries = filteredPromiseSummaries.filter(
			(promise) => promise.party.name === party
		);
	}

	return {
		promiseSummaries: filteredPromiseSummaries
	};
}
