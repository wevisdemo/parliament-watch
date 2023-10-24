import type {
	ScoreAndHighlightResultItem,
	ScoreResultItem,
	SearchIndexes,
	SearchResults,
	HighlightedText
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

/**
 * Search function that takes a query string and search indexes, and returns search results.
 * @param query - The query string to search for.
 * @param searchIndexes - The search indexes to search in.
 * @param keepTopN - The number of search results to return for each category. Default is 5.
 * @param highlight - Whether to highlight the search query in the search results. Default is true.
 * @returns The search results object containing politicians, bills, and votings categories.
 */
export const search = (
	query: string,
	searchIndexes: SearchIndexes,
	keepTopN = 5,
	highlight = true
): SearchResults => {
	// Normalize query
	const queries = normalizeSearchQuery(query);
	const politicianCandidates = postCalcuateScore(
		calculateScore(queries, searchIndexes.politicians),
		keepTopN
	);
	const billCandidates = postCalcuateScore(calculateScore(queries, searchIndexes.bills), keepTopN);
	const votingCandidates = postCalcuateScore(
		calculateScore(queries, searchIndexes.votings),
		keepTopN
	);

	return {
		politicians: politicianCandidates.map((candidate) => ({
			heading: candidate.item.name,
			headingHighlight: highlight ? candidate.highlightedName : undefined,
			description: candidate.item.description,
			url: ''
		})),
		bills: billCandidates.map((candidate) => ({
			heading: candidate.item.name,
			headingHighlight: highlight ? candidate.highlightedName : undefined,
			billStatus: candidate.item.status,
			url: ''
		})),
		votings: votingCandidates.map((candidate) => ({
			heading: candidate.item.name,
			headingHighlight: highlight ? candidate.highlightedName : undefined,
			voteResult: candidate.item.result,
			url: ''
		}))
	};
};

/**
 * Calculates the search score for each item in the searchItems array based on the queries array.
 * @param queries - The array of search queries.
 * @param searchItems - The array of search items.
 * @param [includeAllQuery=true] - Whether all queries must be matched or not.
 * @returns - The array of search result items with their scores and matched indices.
 */
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

/**
 * Calculates the score and highlights the matched indices of the top k candidates.
 * @param candidates - The list of candidates to be scored and highlighted.
 * @param keepTopN - The number of top candidates to return.
 * @returns - The list of top candidates with highlighted matched indices.
 */
const postCalcuateScore = <T extends { name: string }>(
	candidates: ScoreResultItem<T>[],
	keepTopN = 5
): ScoreAndHighlightResultItem<T>[] => {
	return (
		candidates
			// Filter out score 0
			.filter((c) => c.score > 0)
			// Sort by score descending
			.sort((a, b) => b.score - a.score)
			// Take top k
			.slice(0, keepTopN)
			// Highlight matched indices
			.map((c: ScoreResultItem<T>) => ({
				...c,
				highlightedName: highlightText(c.item.name, c.matchedIndices)
			}))
	);
};

/**
 * Returns an array of objects representing the highlighted text.
 * @param text - The text to highlight.
 * @param indices - An array of indices representing the positions to highlight.
 * @returns An array of objects representing the highlighted text.
 */
export function highlightText(text: string, indices: number[]): HighlightedText[] {
	const result: HighlightedText[] = [];
	for (let index = 0; index < text.length; index++) {
		const char = text[index];
		if (
			// If the current character is highlighted,
			indices.includes(index) &&
			// and the previous character is not highlighted,
			!indices.includes(index - 1)
		) {
			result.push({
				text: '',
				highlight: true
			});
		} else if (
			// If the current character is not highlighted,
			// and the previous character is highlighted,
			(!indices.includes(index) && indices.includes(index - 1)) ||
			// the result array is empty
			result.length == 0
		) {
			result.push({
				text: '',
				highlight: false
			});
		}

		result[result.length - 1].text += char;
	}
	return result;
}
