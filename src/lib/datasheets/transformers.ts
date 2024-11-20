import type { Link } from '$models/link';
import { fetchAssemblies } from './fetchers/assembly';
import { fetchParties } from './fetchers/party';
import { fetchPoliticians } from './fetchers/politician';
import { parseMarkdownListToArrayOfItems, safeFind } from './processor';
import { readdirSync } from 'fs';
import { join } from 'path';
import { createTransformer } from 'sheethuahua';

export const asStaticImage = (path: string, placeholder = '_placeholder.webp') => {
	const images = readdirSync(join('static', path));

	if (!images.includes(placeholder)) {
		throw `Placeholder image: ${placeholder} not found`;
	}

	return createTransformer((str: string) =>
		join(path, images.find((file) => file.includes(str)) ?? placeholder)
	);
};

export const asSlug = (separator = '-', maxLength = 32) =>
	createTransformer((text): string =>
		text
			.trim()
			.toLocaleLowerCase()
			.replaceAll('(', '')
			.replaceAll(')', '')
			.replaceAll('.', '')
			.replaceAll('/', '')
			.replaceAll('"', '')
			.replaceAll(`'`, '')
			.replaceAll(' ', separator)
			.replaceAll('_', separator)
			.slice(0, maxLength)
	);

export const asMarkdownList = () => createTransformer(parseMarkdownListToArrayOfItems);

export const asValidAssembly = async () => {
	const assemblies = await fetchAssemblies();
	return createTransformer((assemblyId) => safeFind(assemblies, ({ id }) => id === assemblyId));
};

export const asValidParty = async () => {
	const parties = await fetchParties();
	return createTransformer((partyName) => safeFind(parties, ({ name }) => name === partyName));
};

export const asPolitician = async () => {
	const politicians = await fetchPoliticians();
	return createTransformer((politicianId) => politicians.find(({ id }) => id === politicianId));
};

export const asCsvLinks = () =>
	createTransformer((text) =>
		text.split('\n').map<Link>((ref) => {
			const [label, url] = ref
				.trim()
				.split(',')
				.map((str) => str.trim());

			return { label, url };
		})
	);
