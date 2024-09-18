import {
	inProgressPromise,
	notStartedPromise,
	fulfilledPromise,
	unhonoredPromise,
	clarifyingPromise
} from '../../../mocks/data/promise.js';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const id = params.id;

	const mockPromises = [
		inProgressPromise,
		notStartedPromise,
		fulfilledPromise,
		unhonoredPromise,
		clarifyingPromise
	];

	const loadedPromise = mockPromises.find((p) => p.id === id);

	if (!loadedPromise) {
		error(404, `Promise with id = ${id} not found`);
	}

	return {
		promise: loadedPromise
	};
}
