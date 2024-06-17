export const parseMarkdownListToArrayOfItems = (text: string) =>
	text
		.split('\n')
		.map((line) => line.replace('-', '').trim())
		.filter((line) => line.length > 0);

export function safeFind<T>(list: T[], identifier: (item: T) => boolean): T {
	const item = list.find(identifier);

	if (!item) throw `Could not find any item with ${identifier.toString()}`;

	return item;
}

export const joinMany = <T extends { [key: string]: unknown }, K extends keyof T>(
	list: T[],
	key: K,
	value: T[K]
): Omit<T, K>[] =>
	list
		.filter((item) => item[key] === value)
		.map(({ ...newItem }) => {
			delete newItem[key];
			return newItem;
		});
