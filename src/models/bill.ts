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
			id: z.string(),
			acceptanceNumber: z.string(),
			title: z.string(),
			nickname: z.string().trim().optional(),
			description: z.string().optional(),
			status: z.nativeEnum(BillStatus),
			categories: z.string().optional(),
			proposedOn: z.date(),
			attachmentName: z.string().optional(),
			attachmentUrl: z.string().optional(),
			proposedLedByPoliticianId: z.string().optional(),
			coProposedByPoliticians: z.string().optional(),
			proposedByAssemblyId: z.string().optional(),
			proposedLedByPeople: z.string().optional(),
			peopleSignatureCount: z.number().optional(),
			lisUrl: z.string()
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
				nickname: nickname || rest.title.replace('ร่างพระราชบัญญัติ', ''),
				categories: categories?.split(',').map((c) => c.trim()) || [
					// TODO: Mock category while datasheet is not ready
					['ขนส่งสาธารณะ', 'เศรษฐกิจ', 'แก้รัฐธรรมนูญ', 'วัฒนธรรม', 'เกษตรกรรม'][
						Math.floor(Math.random() * 5)
					]
				],
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
					const name = text.trim();
					const expectedId = name.replaceAll(' ', '-');
					return politicians.find((politician) => politician.id === expectedId) || name;
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
