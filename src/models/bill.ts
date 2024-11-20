import type { Assembly } from './assembly';
import type { Link } from './link';
import type { Politician } from './politician';

export interface Bill {
	title: string;
	description?: string;
	acceptanceNumber: string;
	status: BillStatus;
	proposedOn: Date;
	lisUrl: string;
	id: string;
	nickname: string;
	categories: string[];
	attachment?: Link;
	proposerType: BillProposerType;
	proposedLedByPolitician?: Politician;
	coProposedByPoliticians?: (string | Politician)[];
	proposedByAssembly?: Assembly;
	proposedByPeople?: PeopleProposer;
}

export enum BillStatus {
	InProgress = 'กำลังดำเนินการ',
	Enacted = 'ออกเป็นกฎหมาย',
	Rejected = 'ตกไป',
	Merged = 'ถูกรวมร่าง'
}

export enum BillProposerType {
	Politician = 'สมาชิกรัฐสภา',
	Assembly = 'คณะรัฐมนตรี',
	People = 'ประชาชน',
	Unknown = 'ไม่พบข้อมูล'
}

export interface PeopleProposer {
	ledBy: string;
	signatoryCount: number;
}
