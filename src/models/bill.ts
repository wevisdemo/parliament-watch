import type { Politician } from './politician';

export enum BillStatus {
	InProgress = 'กำลังดำเนินการ',
	Success = 'ออกเป็นกฎหมาย',
	Rejected = 'ตกไป',
	Merged = 'ถูกรวมร่าง'
}

export interface Bill {
	id: number;
	title: string;
	nickname: string;
	description: string;
	status: BillStatus;
	proposedOn: Date;
	proposedBy: Politician[];
}
