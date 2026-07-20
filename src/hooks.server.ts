import { logger } from '$lib/logger';

export async function handle({ event, resolve }) {
	const response = await resolve(event);

	if (response.status >= 400) {
		response.headers.set('cache-control', 'no-store');
	}

	return response;
}

export async function handleError({ error, status }) {
	logger.error({ status, err: error }, 'Server error');

	return { message: error instanceof Error ? error.message : 'Internal error' };
}
