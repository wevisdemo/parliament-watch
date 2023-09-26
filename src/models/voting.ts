import type { Link } from './link';

export interface Voting {
	id: number;
	title: string;
	description?: string;
	category: string;
	date: Date;
	meetingType: string;
	participatedAssembleIds: string[];
	voteOptions: DefaultVoteOption[] | VoteOption[];
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

export enum DefaultVotingResult {
	Passed = 'ผ่าน',
	Failed = 'ไม่ผ่าน'
}

export enum DefaultVoteOption {
	Agreed = 'เห็นด้วย',
	Disagreed = 'ไม่เห็นด้วย',
	Novote = 'งดออกเสียง',
	Abstain = 'ไม่ลงคะแนน',
	Absent = 'ลา/ขาดประชุม'
}
