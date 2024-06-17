import { logger } from '$lib/logger';

export async function handleError(error) {
	logger.error(error);

	return error;
}
