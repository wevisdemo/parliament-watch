import { logger } from '$lib/logger';

export async function handleError({ error, status }) {
	logger.error({ status, err: error }, 'Server error');

	return { message: error instanceof Error ? error.message : 'Internal error' };
}
