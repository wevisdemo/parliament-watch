import type { groupVoteByAffiliations } from '$lib/datasheets/voting';
import type { Party } from './party';
import type { Voting } from './voting';
import { Column, Table } from 'sheethuahua';

export enum PromiseStatus {
	notStarted = 'ไม่พบความเคลื่อนไหว',
	inProgress = 'กำลังดำเนินการ',
	clarifying = 'รอคำชี้แจงเพิ่มเติม',
	fulfilled = 'ดำเนินการแล้ว',
	unhonored = 'เลิกดำเนินการ'
}

export interface Promise {
	id: string;
	party: Party;
	statements: string[];
	coverImageUrl?: string;
	keywords: string[];
	categories: string[];
	status: PromiseStatus;
	clarificationLogs?: PromiseClarificationLog[];
	progresses: PromiseProgress[];
	references: {
		label: string;
		url: string;
		description?: string;
	}[];
}

export interface PromiseClarificationLog {
	date: Date;
	title: string;
	answer?: {
		date: Date;
		content: string;
	};
}

export interface PromiseProgress {
	id: string;
	type: 'checkpoint' | 'indirect';
	date: Date;
	title: string;
	description?: string;
	votingSummary?: VotingSummary;
	url?: string;
	evidence?: {
		type: 'image' | 'document';
		url: string;
	};
}

export interface VotingSummary
	extends Pick<Voting, 'date' | 'title' | 'id' | 'result' | 'voteOptions'> {
	resultsByAffiliation: Pick<
		ReturnType<typeof groupVoteByAffiliations>[number],
		'name' | 'resultSummary'
	>[];
}

export interface PromiseSummary
	extends Pick<Promise, 'id' | 'statements' | 'party' | 'keywords' | 'categories' | 'status'> {
	latestProgressDate?: Date;
}

export const promiseTable = Table('Promises', {
	id: Column.String(),
	statement: Column.String(),
	party: Column.String(),
	categories: Column.OptionalString(),
	keywords: Column.OptionalString(),
	parentPromiseId: Column.OptionalString(),
	references: Column.OptionalString()
});

export const promiseProgressTable = Table('Promise Progress', {
	title: Column.String(),
	description: Column.OptionalString(),
	promiseId: Column.String(),
	status: Column.OneOf(Object.values(PromiseStatus)),
	date: Column.Date(),
	url: Column.OptionalString()
});
