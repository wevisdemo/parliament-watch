import { safeFind } from '$lib/datasheets/processor';
import type { Assembly } from './assembly';
import type { Link } from './link';
import type { Politician } from './politician';
import { z } from 'zod';

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

export const createBillSchema = (politicians: Politician[], assemblies: Assembly[]) =>
	z
		.object({
			id: z.string(),
			acceptanceNumber: z.string(),
			title: z.string(),
			nickname: z.string().optional(),
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
				categories,
				attachmentName,
				attachmentUrl,
				proposedLedByPoliticianId,
				coProposedByPoliticians,
				proposedByAssemblyId,
				proposedLedByPeople,
				peopleSignatureCount,
				...rest
			}) => {
				const proposerType: BillProposerType = proposedLedByPoliticianId
					? BillProposerType.Politician
					: proposedByAssemblyId
						? BillProposerType.Cabinet
						: BillProposerType.People;

				return {
					...rest,
					categories: categories?.split(',').map((c) => c.trim()) || [],
					...(attachmentName && attachmentUrl
						? { attachment: { label: attachmentName, url: attachmentUrl } as Link }
						: {}),
					proposerType,
					...(proposerType === BillProposerType.Politician
						? {
								proposedLedByPolitician: politicians.find(
									({ id }) => id === proposedLedByPoliticianId
								),
								coProposedByPoliticians: coProposedByPoliticians
									?.split(',')
									.map((name) => name.trim())
							}
						: proposerType === BillProposerType.Cabinet
							? {
									proposedByAssembly: safeFind(assemblies, ({ id }) => id === proposedByAssemblyId)
								}
							: ({
									ledBy: proposedLedByPeople,
									signatoryCount: peopleSignatureCount
								} as PeopleProposer))
				};
			}
		);

export type Bill = z.infer<ReturnType<typeof createBillSchema>>;
