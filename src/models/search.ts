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
	voteResult: DefaultVotingResult;
}

export type SearchResultItem =
	| PoliticianSearchResultItem
	| BillSearchResultItem
	| VotingSearchResultItem;
