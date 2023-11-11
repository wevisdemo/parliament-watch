import type { Politician } from './politician';

export enum BillStatus {
	InProgress = 'กำลังดำเนินการ',
	Success = 'ออกเป็นกฎหมาย',
	Rejected = 'ตกไป',
	Merged = 'ถูกรวมร่าง'
}

export enum BillProposerType {
	Politician = 'สมาชิกรัฐสภา',
	Cabinet = 'คณะรัฐมนตรี',
	People = 'ประชาชน'
}

export interface PeopleProposer {
	leadBy: string;
	signatoryCount: number;
}

export type CabinetId = number;

export interface Bill {
	id: number;
	title: string;
	nickname: string;
	description: string;
	status: BillStatus;
	categories: string[];
	proposedOn: Date;
	proposerType: BillProposerType;
	proposedLedByPolitician?: Politician;
	coProposedByPoliticians?: Politician[];
	proposedByCabinetId?: number;
	proposedByPeople?: PeopleProposer;
}
