const SEPERATOR = '-';
const MAX_LENGTH = 32;

export const slugify = (text: string): string =>
	text
		.trim()
		.toLocaleLowerCase()
		.replaceAll('(', '')
		.replaceAll(')', '')
		.replaceAll('.', '')
		.replaceAll('/', '')
		.replaceAll(' ', SEPERATOR)
		.replaceAll('_', SEPERATOR)
		.slice(0, MAX_LENGTH);
