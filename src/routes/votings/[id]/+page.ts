import type { Party } from '$models/party';
import type { DefaultVoteOption, CustomVoteOption } from '$models/voting';

export type Results = VoteOptionResult[];

export interface VoteOptionResult {
	voteOption: DefaultVoteOption | CustomVoteOption | string;
	total: number;
}

export type ResultsByAffiliation = ResultByAffiliation[];
export type ResultsByParty = {
	party: Party;
	resultSummary: Results;
};

export interface ResultByAffiliation {
	affiliationName: string;
	resultSummary: Results;
	byParties?: ResultsByParty[];
}
