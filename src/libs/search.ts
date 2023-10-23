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
				highlightedName: breakText(c.item.name, c.matchedIndices)
			}))
	);
};

export function breakText(text: string, indices: number[]): HighlightedText[] {
	const result: HighlightedText[] = [];
	for (let index = 0; index < text.length; index++) {
		const char = text[index];
		if (indices.includes(index) && !indices.includes(index - 1)) {
			result.push({
				text: '',
				highlight: true
			});
		} else if (!indices.includes(index) && indices.includes(index - 1)) {
			result.push({
				text: '',
				highlight: false
			});
		} else if (result.length === 0) {
			result.push({
				text: '',
				highlight: false
			});
		}
		result[result.length - 1].text += char;
	}
	return result;
}
