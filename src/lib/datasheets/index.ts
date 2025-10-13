import { error } from '@sveltejs/kit';

export * from './fetchers/assembly';
export * from './fetchers/bill';
export * from './fetchers/bill-events';
export * from './fetchers/global-events';
export * from './fetchers/party';
export * from './fetchers/politician';
export * from './fetchers/promise';
export * from './fetchers/vote';
export * from './fetchers/voting';

export async function fetchFromIdOr404<T extends { id: string }>(
	fetcher: () => Promise<T[]>,
	id: string
) {
	const data = (await fetcher()).find((item) => item.id === id);

	if (!data) {
		error(404, { message: `id ${id} was not found with ${fetcher.name}` });
	}

	return data;
}
