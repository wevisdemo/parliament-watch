import type { Link } from './link';

export enum DefaultVotingResult {
	Passed = 'passed',
	Failed = 'failed'
}

export interface Voting {
	id: number;
	title: string;
	description?: string;
	category: string;
	date: Date;
	meetingType: string;
	participatedAssembleIds: string[];
	voteOptions: VoteOption[];
	winningCondition: string;
	result: DefaultVotingResult | string;
	relatedBillId?: number;
	sourceUrl: string;
	files: Link[];
}

export interface VoteOption {
	label: string;
	color: string;
}

export type VotingSummary = Pick<Voting, 'id' | 'title' | 'result' | 'date' | 'files'>;
