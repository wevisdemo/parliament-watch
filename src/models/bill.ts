import { safeFind } from '$lib/datasheets/processor';
import { slugify } from '$lib/slug';
import type { Assembly } from './assembly';
import type { Link } from './link';
import type { Politician } from './politician';
import { Table, Column, type RowType } from 'sheethuahua';

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

export const billTable = Table('Bills', {
	id: Column.String(),
	acceptanceNumber: Column.String(),
	title: Column.String(),
	nickname: Column.OptionalString(),
	description: Column.OptionalString(),
	status: Column.OneOf(Object.values(BillStatus)),
	categories: Column.OptionalString(),
	proposedOn: Column.Date(),
	attachmentName: Column.OptionalString(),
	attachmentUrl: Column.OptionalString(),
	proposedLedByPoliticianId: Column.OptionalString(),
	coProposedByPoliticians: Column.OptionalString(),
	proposedByAssemblyId: Column.OptionalString(),
	proposedLedByPeople: Column.OptionalString(),
	peopleSignatureCount: Column.OptionalNumber(),
	lisUrl: Column.String()
});

export const transformBill = (
	{
		id,
		nickname,
		categories,
		attachmentName,
		attachmentUrl,
		proposedLedByPoliticianId,
		coProposedByPoliticians,
		proposedByAssemblyId,
		proposedLedByPeople,
		peopleSignatureCount,
		...rest
	}: RowType<typeof billTable>,
	politicians: Politician[],
	assemblies: Assembly[]
) => ({
	id: slugify(id),
	nickname: nickname || rest.title.replace('ร่างพระราชบัญญัติ', 'ร่าง พ.ร.บ.'),
	categories: categories?.split(',').map((c) => c.trim()) || [],
	attachment:
		attachmentName && attachmentUrl
			? ({ label: attachmentName, url: attachmentUrl } as Link)
			: null,
	proposerType: proposedLedByPoliticianId
		? BillProposerType.Politician
		: proposedByAssemblyId
			? BillProposerType.Assembly
			: proposedLedByPeople
				? BillProposerType.People
				: BillProposerType.Unknown,
	proposedLedByPolitician: proposedLedByPoliticianId
		? politicians.find((politician) => politician.id === proposedLedByPoliticianId)
		: null,
	coProposedByPoliticians: coProposedByPoliticians?.split(',').map((text) => {
		const corpus = text.split(' ').filter((word) => word);
		const expectedId = corpus.join('-');
		return politicians.find((politician) => expectedId.includes(politician.id)) || corpus.join(' ');
	}),
	proposedByAssembly: proposedByAssemblyId
		? safeFind(assemblies, (assembly) => assembly.id === proposedByAssemblyId)
		: null,
	proposedByPeople: proposedLedByPeople
		? ({
				ledBy: proposedLedByPeople,
				signatoryCount: peopleSignatureCount
			} as PeopleProposer)
		: null,
	...rest
});

export type Bill = ReturnType<typeof transformBill>;
