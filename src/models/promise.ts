import type { Bill } from './bill';
import type { BillEvent } from './bill-event';
import type { Party } from './party';

export enum PromiseStatus {
	notStarted = 'ไม่พบความเคลื่อนไหว',
	inProgress = 'กำลังดำเนินการ',
	fulfilled = 'ดำเนินการแล้ว',
	unhonored = 'เลิกดำเนินการ'
}

export interface Promise {
	id: string;
	party: Party;
	statements: string[];
	coverImageUrl: string;
	keywords: string[];
	categories: string[];
	status: PromiseStatus;
	progresses: PromiseProgress[];
	references: {
		label: string;
		url: string;
		description?: string;
	}[];
}

export interface PromiseProgress {
	id: string;
	type: 'checkpoint' | 'indirect';
	date: Date;
	title: string;
	description?: string;
	billEvent?: BillEvent;
	bill?: Bill;
	reference?: {
		label: string;
		url: string;
		description?: string;
	};
	evidence?: {
		type: 'image' | 'document';
		url: string;
	};
}
