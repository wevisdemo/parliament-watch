import { Spreadsheet } from 'sheethuahua';

const sheetCaches = new Map<string, object[]>();

export const sheets = Spreadsheet('1SbX2kgAGsslbhGuB-EI_YdSAnIt3reU1_OEtWmDVOVk');

export function withCache<T extends object[]>(key: string, getter: () => Promise<T>) {
	return async (): Promise<T> => {
		if (!sheetCaches.has(key)) {
			sheetCaches.set(key, await getter());
		}

		return sheetCaches.get(key) as T;
	};
}
