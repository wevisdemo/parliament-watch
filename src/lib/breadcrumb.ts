const MAX_CHARACTERS = 64;

export function trimBreadcrumbTitle(text = ''): string {
	return text.length > MAX_CHARACTERS ? text.slice(0, MAX_CHARACTERS) + '...' : text;
}
