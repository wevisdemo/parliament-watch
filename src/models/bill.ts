import { safeFind } from '$lib/datasheets/processor';
import type { Assembly } from './assembly';
import type { Link } from './link';
import type { Politician } from './politician';
import md5 from 'md5';
import { z } from 'zod';

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

export const createBillSchema = (politicians: Politician[], assemblies: Assembly[]) =>
	z
		.object({
			id: z.string().trim(),
			acceptanceNumber: z.string().trim(),
			title: z.string().trim(),
			nickname: z.string().trim().trim().optional(),
			description: z.string().trim().optional(),
			status: z.nativeEnum(BillStatus),
			categories: z.string().trim().optional(),
			proposedOn: z.date(),
			attachmentName: z.string().trim().optional(),
			attachmentUrl: z.string().trim().optional(),
			proposedLedByPoliticianId: z.string().trim().optional(),
			coProposedByPoliticians: z.string().trim().optional(),
			proposedByAssemblyId: z.string().trim().optional(),
			proposedLedByPeople: z.string().trim().optional(),
			peopleSignatureCount: z.number().optional(),
			lisUrl: z.string().trim()
		})
		.transform(
			({
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
			}) => ({
				id: md5(id),
				nickname: nickname || rest.title.replace('ร่างพระราชบัญญัติ', 'ร่าง พ.ร.บ.'),
				categories: categories?.split(',').map((c) => c.trim()) || [],
				attachment:
					attachmentName && attachmentUrl
						? ({ label: attachmentName, url: attachmentUrl } as Link)
						: undefined,
				proposerType: proposedLedByPoliticianId
					? BillProposerType.Politician
					: proposedByAssemblyId
						? BillProposerType.Assembly
						: proposedLedByPeople
							? BillProposerType.People
							: BillProposerType.Unknown,
				proposedLedByPolitician: proposedLedByPoliticianId
					? politicians.find((politician) => politician.id === proposedLedByPoliticianId)
					: undefined,
				coProposedByPoliticians: coProposedByPoliticians?.split(',').map((text) => {
					const corpus = text.split(' ').filter((word) => word);
					const expectedId = corpus.join('-');
					return (
						politicians.find((politician) => expectedId.includes(politician.id)) || corpus.join(' ')
					);
				}),
				proposedByAssembly: proposedByAssemblyId
					? safeFind(assemblies, (assembly) => assembly.id === proposedByAssemblyId)
					: undefined,
				proposedByPeople: proposedLedByPeople
					? ({
							ledBy: proposedLedByPeople,
							signatoryCount: peopleSignatureCount
						} as PeopleProposer)
					: undefined,
				...rest
			})
		);

export type Bill = z.infer<ReturnType<typeof createBillSchema>>;
