import type { Assembly } from './assembly';
import type { Link } from './link';

export interface Voting {
	date: Date;
	title?: string;
	description?: string;
	nickname: string;
	winningCondition?: string;
	sourceUrl: string;
	id: string;
	result: string;
	meetingType: string;
	participatedAssemblies: Assembly[];
	voteOptions: (DefaultVoteOption | CustomVoteOption | string)[];
	files: Link[];
}

export interface CustomVoteOption {
	label: string;
	colorIntensity: number; // 0-1
}

export enum DefaultVotingResult {
	Passed = 'ผ่าน',
	Failed = 'ไม่ผ่าน'
}

export enum DefaultVoteOption {
	Agreed = 'เห็นด้วย',
	Disagreed = 'ไม่เห็นด้วย',
	Novote = 'งดออกเสียง',
	Abstain = 'ไม่ลงคะแนนเสียง',
	Absent = 'ลา / ขาดลงมติ'
}

export const defaultVoteOptions: string[] = [
	DefaultVoteOption.Agreed,
	DefaultVoteOption.Disagreed,
	DefaultVoteOption.Novote,
	DefaultVoteOption.Abstain,
	DefaultVoteOption.Absent
];

export const RESULT_CONFIRMATION_PENDING = 'รอตรวจสอบ';
