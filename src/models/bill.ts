import type { Assembly } from './assembly';
import type { Link } from './link';
import type { Politician } from './politician';

export enum BillStatus {
	InProgress = 'กำลังดำเนินการ',
	Enacted = 'ออกเป็นกฎหมาย',
	Rejected = 'ตกไป',
	Merged = 'ถูกรวมร่าง'
}

export enum BillProposerType {
	Politician = 'สมาชิกรัฐสภา',
	Cabinet = 'คณะรัฐมนตรี',
	People = 'ประชาชน'
}

export interface PeopleProposer {
	ledBy: string;
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
	proposedByAssembly?: Assembly;
	proposedByPeople?: PeopleProposer;
	enactedOn?: Date;
	attachment?: Link;
}
