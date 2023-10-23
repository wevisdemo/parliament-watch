import type { BillStatus } from './bill';
import type { DefaultVotingResult } from './voting';

export interface SearchIndexes {
	politicians: {
		name: string;
		description: string;
	}[];
	bills: {
		name: string;
		status: BillStatus;
	}[];
	votings: {
		name: string;
		result?: DefaultVotingResult;
	}[];
}

interface BaseSearchResultItem {
	heading: string;
	description?: string;
	url: string;
}

interface PoliticianSearchResultItem extends BaseSearchResultItem {
	billStatus?: never;
	voteResult?: never;
}

interface BillSearchResultItem extends BaseSearchResultItem {
	billStatus: BillStatus;
	voteResult?: never;
}

interface VotingSearchResultItem extends BaseSearchResultItem {
	billStatus?: never;
	voteResult?: DefaultVotingResult;
}

export type SearchResultItem =
	| PoliticianSearchResultItem
	| BillSearchResultItem
	| VotingSearchResultItem;

export interface SearchResults {
	politicians: PoliticianSearchResultItem[];
	bills: BillSearchResultItem[];
	votings: VotingSearchResultItem[];
}

export interface ScoreResultItem<T> {
	item: T;
	score: number;
	matchedIndices: number[];
}

export interface ScoreAndHighlightResultItem<T> extends ScoreResultItem<T> {
	highlightedName: string;
}
