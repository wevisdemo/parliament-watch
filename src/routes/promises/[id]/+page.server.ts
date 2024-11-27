import { fetchFromIdOr404, fetchGlobalEvents, fetchPromises } from '$lib/datasheets/index.js';

export async function load({ params }) {
	const promise = await fetchFromIdOr404(fetchPromises, params.id);
	const globalEvents = await fetchGlobalEvents();

	return {
		promise,
		globalEvents
	};
}
