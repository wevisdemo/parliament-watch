import type {
	ScoreAndHighlightResultItem,
	ScoreResultItem,
	SearchIndexes,
	SearchResults,
	HighlightedText
} from '$models/search';
import { distance } from 'fastest-levenshtein';

/**
 * Tokenizes the given text into an array of words.
 * If the Intl.Segmenter API is available, it will be used to segment the text into words.
 * Otherwise, the text will be split by spaces.
 * @param text - The text to tokenize.
 * @returns An array of words.
 */
function tokenize(text: string) {
	// Use Intl.Segmenter API if available
	if (Intl && Intl.Segmenter) {
		const segmenter = new Intl.Segmenter('th', { granularity: 'word' });
		return Array.from(segmenter.segment(text))
			.map((segment) => segment.segment)
			.filter((q) => q.trim().length > 0);
	}
	// Otherwise, split by spaces
	return text.split(' ');
}

/**
 * Normalizes a search query by adding spaces around dots and digits, and removing duplicate and empty tokens.
 * @param query - The search query to normalize.
 * @returns An array of normalized search tokens.
 */
export function normalizeSearchQuery(query: string) {
	const normalized = query.replace(/\.([^\s])/g, '. $1').replace(/(\d+)/g, ' $1 ');
	return tokenize(normalized)
		.filter((q) => q.trim().length > 0)
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
export function search(
	query: string,
	searchIndexes: SearchIndexes,
	keepTopN = 5,
	highlight = true
): SearchResults {
	// Normalize query
	const queries = normalizeSearchQuery(query);

	// TODO - ใส่ URL ให้ครบทุกประเภท
	return {
		politicians: searchIndexes.politicians
			? getScoredAndHighlightedResultItems(queries, searchIndexes.politicians, keepTopN).map(
					(candidate) => ({
						heading: candidate.item.name,
						headingHighlight: highlight ? candidate.highlightedName : undefined,
						description: candidate.item.description,
						url: '/politicians/' + candidate.item.id
					})
				)
			: undefined,
		bills: searchIndexes.bills
			? getScoredAndHighlightedResultItems(queries, searchIndexes.bills, keepTopN).map((bill) => ({
					heading: bill.item.name,
					headingHighlight: highlight ? bill.highlightedName : undefined,
					billStatus: bill.item.status,
					url: '/bills/' + bill.item.id
				}))
			: undefined,
		votings: searchIndexes.votings
			? getScoredAndHighlightedResultItems(queries, searchIndexes.votings, keepTopN).map(
					(voting) => ({
						heading: voting.item.name,
						headingHighlight: highlight ? voting.highlightedName : undefined,
						voteResult: voting.item.result,
						url: '/votings/' + voting.item.id
					})
				)
			: undefined,
		billProposers: searchIndexes.billProposers
			? getScoredAndHighlightedResultItems(queries, searchIndexes.billProposers, keepTopN).map(
					(proposer) => ({
						heading: proposer.item.name,
						headingHighlight: highlight ? proposer.highlightedName : undefined,
						description: proposer.item.description,
						proposedBillsCount: proposer.item.proposedBillsCount,
						url: '/bills/explore?proposername=' + proposer.item.name
					})
				)
			: undefined,
		promises: searchIndexes.promises
			? getScoredAndHighlightedResultItems(queries, searchIndexes.promises, keepTopN).map(
					(promise) => ({
						heading: promise.item.name.slice(0, 16),
						headingHighlight: highlight ? promise.highlightedName : undefined,
						promiseStatus: promise.item.status,
						url: '/promises/' + promise.item.id
					})
				)
			: undefined
	};
}

function getScoredAndHighlightedResultItems<T extends { name: string }>(
	queries: string[],
	searchIndexes: T[],
	keepTopN: number
) {
	return postCalculateScore(calculateScore(queries, searchIndexes), keepTopN);
}

/**
 * Calculates the search score for each item in the searchItems array based on the queries array.
 * @param queries - The array of search queries.
 * @param searchItems - The array of search items.
 * @param [includeAllQuery=true] - Whether all queries must be matched or not.
 * @returns - The array of search result items with their scores and matched indices.
 */
export function calculateScore<T extends { name: string }>(
	queries: string[],
	searchItems: T[],
	includeAllQuery = true
): ScoreResultItem<T>[] {
	return searchItems.map((item: T) => {
		let score = 0;
		const matchedIndices: number[] = [];
		const stringMenu = item.name.toLowerCase();
		const normalizedQueries = queries.map((q) => q.toLowerCase());
		for (const query of normalizedQueries) {
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

			if (addedScore == 0) {
				// Try fuzzy match using sliding window
				let bestDistance = Infinity;
				let bestIndex = -1;

				for (let i = 0; i <= stringMenu.length - query.length; i++) {
					const sub = stringMenu.slice(i, i + query.length);
					const d = distance(sub, query);
					if (d < bestDistance) {
						bestDistance = d;
						bestIndex = i;
					}
				}

				// Accept fuzzy match if close enough
				const threshold = Math.max(1, Math.floor(query.length / 3));
				if (bestDistance <= threshold) {
					const similarity = 1 - bestDistance / query.length;
					addedScore += (similarity * query.length * 0.2) / stringMenu.length;
					for (let i = bestIndex; i < bestIndex + query.length; i++) {
						if (!matchedIndices.includes(i)) matchedIndices.push(i);
					}
				}
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
}

/**
 * Calculates the score and highlights the matched indices of the top k candidates.
 * @param candidates - The list of candidates to be scored and highlighted.
 * @param keepTopN - The number of top candidates to return.
 * @returns - The list of top candidates with highlighted matched indices.
 */
function postCalculateScore<T extends { name: string }>(
	candidates: ScoreResultItem<T>[],
	keepTopN = 5
): ScoreAndHighlightResultItem<T>[] {
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
}

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
