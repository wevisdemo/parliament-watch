import type {
	ScoreAndHighlightResultItem,
	ScoreResultItem,
	SearchIndexes,
	SearchResults
} from '$models/search';

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

export const search = (
	query: string,
	searchIndexes: SearchIndexes,
	k = 5,
	highlight = true
): SearchResults => {
	// Normalize query
	const queries = normalizeSearchQuery(query);
	const politicianCandidates = postCalcuateScore(
		calculateScore(queries, searchIndexes.politicians),
		k
	);
	const billCandidates = postCalcuateScore(calculateScore(queries, searchIndexes.bills), k);
	const votingCandidates = postCalcuateScore(calculateScore(queries, searchIndexes.votings), k);

	return {
		politicians: politicianCandidates.map((candidate) => ({
			heading: highlight ? candidate.highlightedName : candidate.item.name,
			description: candidate.item.description,
			url: ''
		})),
		bills: billCandidates.map((candidate) => ({
			heading: highlight ? candidate.highlightedName : candidate.item.name,
			billStatus: candidate.item.status,
			url: ''
		})),
		votings: votingCandidates.map((candidate) => ({
			heading: highlight ? candidate.highlightedName : candidate.item.name,
			voteResult: candidate.item.result,
			url: ''
		}))
	};
};

export const calculateScore = <T extends { name: string }>(
	queries: string[],
	searchItems: T[],
	includeAllQuery = true
): ScoreResultItem<T>[] => {
	return searchItems.map((item: T) => {
		let score = 0;
		const matchedIndices: number[] = [];
		for (const query of queries) {
			const stringMenu = item.name;
			let matchedIndex = 0;
			let startIndex = 0;
			let addedScore = 0;

			// If found query
			while ((matchedIndex = stringMenu.indexOf(query, startIndex)) >= 0) {
				// Get the end index of matched query
				const endMatchedIndex = matchedIndex + query.length;

				// Add score by the length of matched query divided by the length of stringMenu
				addedScore += query.length / stringMenu.length;

				// Add matched indices
				for (let i = matchedIndex; i < endMatchedIndex; i++) {
					// Skip if already added
					if (matchedIndices.includes(i)) continue;
					matchedIndices.push(i);
				}

				// Set the start index of next search
				startIndex = endMatchedIndex;
			}

			// If not found query
			if (addedScore == 0) {
				// If all query must be matched, return score 0
				if (includeAllQuery) {
					return {
						item,
						score: 0,
						matchedIndices: []
					};
				} else {
					// Penalty score if not all query is matched
					addedScore -= 1 / queries.length;
				}
			}

			// Add score
			score += addedScore;
		}

		return {
			item,
			score,
			matchedIndices
		};
	});
};

const postCalcuateScore = <T extends { name: string }>(
	candidates: ScoreResultItem<T>[],
	k = 5
): ScoreAndHighlightResultItem<T>[] => {
	return (
		candidates
			// Filter out score 0
			.filter((c) => c.score > 0)
			// Sort by score descending
			.sort((a, b) => b.score - a.score)
			// Take top k
			.slice(0, k)
			// Highlight matched indices
			.map((c: ScoreResultItem<T>) => ({
				...c,
				highlightedName: highlight(c.matchedIndices, c.item.name)
			}))
	);
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
