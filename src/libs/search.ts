import type { SearchIndexes } from '$models/search';

/**
 * Normalizes a search query by adding spaces around dots and numbers, splitting by whitespace, and removing duplicates.
 * @param query - The search query to normalize.
 * @returns The normalized search query.
 */
export function normalizeSearchQuery(query: string) {
	return query
		.replace(/\.([^\s])/g, '. $1')
		.replace(/(\d+)/g, ' $1 ')
		.split(/\s/g)
		.filter((q) => q.length > 0)
		.filter((q, index, self) => self.indexOf(q) === index);
}

export const search = (query: string, searchIndexes: SearchIndexes, k = 5) => {
	// Normalize query
	const queries = normalizeSearchQuery(query);
	const politicianCandidates = postCalcuateScore(
		calculateScore(queries, searchIndexes.politicians),
		k
	);
	const billCandidates = postCalcuateScore(calculateScore(queries, searchIndexes.bills), k);
	const votingCandidates = postCalcuateScore(calculateScore(queries, searchIndexes.votings), k);

	return {
		politicians: politicianCandidates,
		bills: billCandidates,
		votings: votingCandidates
	};
};

interface SearchResultItem {
	name: string;
	score: number;
	matchedIndices: number[];
}

interface SearchResultItemWithHighlight extends SearchResultItem {
	highlightedName: string;
}

export const calculateScore = (
	queries: string[],
	searchItems: { name: string }[],
	includeAllQuery = true
): SearchResultItem[] => {
	return searchItems.map((item) => {
		let score = 0;
		const matchedIndices: number[] = [];
		for (let index = 0; index < queries.length; index++) {
			const query = queries[index];

			const stringMenu = item.name;
			let matchedIndex = 0;
			let startIndex = 0;
			let addedScore = 0;

			while ((matchedIndex = stringMenu.indexOf(query, startIndex)) >= 0) {
				const endMatchedIndex = matchedIndex + query.length;

				addedScore += query.length / stringMenu.length;
				for (let i = matchedIndex; i < endMatchedIndex; i++) {
					if (matchedIndices.includes(i)) continue;
					matchedIndices.push(i);
				}

				startIndex = endMatchedIndex;
			}

			if (addedScore == 0) {
				// If all query must be matched, return score 0
				if (includeAllQuery) {
					return {
						...item,
						score: 0,
						matchedIndices: []
					};
				} else {
					// Penalty score if not all query is matched
					addedScore -= 1 / queries.length;
				}
			}

			score += addedScore;
		}

		return {
			...item,
			score,
			matchedIndices
		};
	});
};

const postCalcuateScore = (
	candidates: SearchResultItem[],
	k = 5
): SearchResultItemWithHighlight[] => {
	return candidates
		.sort((a, b) => b.score - a.score)
		.slice(0, k)
		.map((c: SearchResultItem) => ({
			...c,
			highlightedName: highlight(c.matchedIndices, c.name)
		}));
};

const HIGHTLIGHT_STYLE = {
	tagOpen: '<b>',
	tagClose: '</b>'
};

function highlight(indices: number[], target: string) {
	// Initialize the result string to an empty string.
	let result = '';

	// Initialize the tagClosed flag to true.
	let tagClosed = true;

	// Iterate over the characters in the target string.
	for (let index = 0; index < target.length; index++) {
		// Get the current character.
		const char = target[index];

		// If the current index is in the array of indices,
		// and the previous index is not in the array of indices,
		// then the current character is the beginning of a highlighted word.
		if (indices.includes(index) && !indices.includes(index - 1)) {
			// Add the opening tag to the result string.
			result += HIGHTLIGHT_STYLE.tagOpen;

			// Set the tagClosed flag to false.
			tagClosed = false;
		}

		// If the current index is not in the array of indices,
		// and the previous index is in the array of indices,
		// then the current character is the end of a highlighted word.
		else if (!indices.includes(index) && indices.includes(index - 1)) {
			// Add the closing tag to the result string.
			result += HIGHTLIGHT_STYLE.tagClose;

			// Set the tagClosed flag to true.
			tagClosed = true;
		}

		// Add the current character to the result string.
		result += char;
	}

	// If the tagClosed flag is false, then the last character is the end of a highlighted word.
	if (tagClosed === false) {
		// Add the closing tag to the result string.
		result += HIGHTLIGHT_STYLE.tagClose;
	}

	// Return the result string.
	return result;
}
