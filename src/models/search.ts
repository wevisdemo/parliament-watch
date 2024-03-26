import type { BillStatus } from './bill';

export enum SearchIndexCategory {
	Politicians = 'politicians',
	Bills = 'bills',
	Votings = 'votings',
	BillProposers = 'billProposers'
}

// TODO - เช็คว่าตัวอื่นต้องใช้อะไรในการ Link ไปหน้านั้นๆ
export interface SearchIndexes {
	[SearchIndexCategory.Politicians]?: {
		id: string;
		name: string;
		description: string;
	}[];
	[SearchIndexCategory.Bills]?: {
		id: string;
		name: string;
		status: BillStatus;
	}[];
	[SearchIndexCategory.Votings]?: {
		id: string;
		name: string;
		result?: string;
	}[];
	[SearchIndexCategory.BillProposers]?: {
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
	voteResult?: string;
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
