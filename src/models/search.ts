import type { BillStatus } from './bill';
import type { DefaultVotingResult } from './voting';

export interface SearchIndexes {
	politicians?: {
		name: string;
		description: string;
	}[];
	bills?: {
		name: string;
		status: BillStatus;
	}[];
	votings?: {
		name: string;
		result?: DefaultVotingResult;
	}[];
	billProposers?: {
		name: string;
		description: string;
		proposedBillsCount: number;
	}[];
}

interface BaseSearchResultItem {
	heading: string;
	headingHighlight?: HighlightedText[];
	description?: string;
	url: string;
}

interface PoliticianSearchResultItem extends BaseSearchResultItem {
	billStatus?: never;
	voteResult?: never;
	proposedBillsCount?: never;
}

interface BillSearchResultItem extends BaseSearchResultItem {
	billStatus: BillStatus;
	voteResult?: never;
	proposedBillsCount?: never;
}

interface VotingSearchResultItem extends BaseSearchResultItem {
	billStatus?: never;
	voteResult?: DefaultVotingResult;
	proposedBillsCount?: never;
}

interface BillProposerSearchResultItem extends BaseSearchResultItem {
	billStatus?: never;
	voteResult?: never;
	proposedBillsCount: number;
}

export type SearchResultItem =
	| PoliticianSearchResultItem
	| BillSearchResultItem
	| VotingSearchResultItem
	| BillProposerSearchResultItem;

export interface SearchResults {
	politicians?: PoliticianSearchResultItem[];
	bills?: BillSearchResultItem[];
	votings?: VotingSearchResultItem[];
	billProposers?: BillProposerSearchResultItem[];
}

export interface ScoreResultItem<T> {
	item: T;
	score: number;
	matchedIndices: number[];
}

export interface ScoreAndHighlightResultItem<T> extends ScoreResultItem<T> {
	highlightedName: HighlightedText[];
}

export interface HighlightedText {
	text: string;
	highlight: boolean;
}
