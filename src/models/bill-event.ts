import md5 from 'md5';
import { z } from 'zod';

export enum BillEventType {
	Hearing = 'hearing',
	MP1 = 'mp1',
	MP2 = 'mp2',
	MP3 = 'mp3',
	Senate1 = 'senate1',
	Senate2 = 'senate2',
	Senate3 = 'senate3',
	Enforcement = 'enforcement',
	Other = 'other'
}

export enum BillEventActionType {
	Voted = 'voted',
	Merged = 'merged',
	Enforced = 'enforced'
}

export const eventTypeTitleDescription = {
	[BillEventType.Hearing]: {
		title: 'รับฟังความเห็น',
		description: ''
	},
	[BillEventType.MP1]: {
		title: 'สส.พิจารณา วาระ 1',
		description: 'รับหลักการและตั้งกรรมาธิการ'
	},
	[BillEventType.MP2]: {
		title: 'สส.พิจารณา วาระ 2',
		description: 'ขั้นกรรมาธิการ และ สส.ลงมติรับรายมาตรา'
	},
	[BillEventType.MP3]: {
		title: 'สส.พิจารณา วาระ 3',
		description: 'ขั้นลงมติเห็นชอบ'
	},
	[BillEventType.Senate1]: {
		title: 'สว.พิจารณา วาระ 1',
		description: 'รับร่าง พ.ร.บ. ไว้พิจารณา'
	},
	[BillEventType.Senate2]: {
		title: 'สว.พิจารณา วาระ 2',
		description: 'อยู่ระหว่างการพิจารณา'
	},
	[BillEventType.Senate3]: {
		title: 'สว.พิจารณา วาระ 3',
		description: 'พิจารณาให้ความเห็นชอบ'
	},
	[BillEventType.Enforcement]: {
		title: 'ออกเป็นกฎหมาย',
		description: ''
	},
	[BillEventType.Other]: {
		title: 'หมายเหตุ',
		description: ''
	}
};

export const billEventSchema = z
	.object({
		billId: z.string(),
		date: z.string().optional(),
		type: z.nativeEnum(BillEventType),
		title: z.string().optional(),
		description: z.string().optional(),
		actionType: z.nativeEnum(BillEventActionType).optional(),
		votedInVotingId: z.string().optional(),
		mergedIntoBillId: z.string().optional(),
		enforcementDocumentUrl: z.string().optional()
	})
	.transform(
		({ billId, date, title, description, mergedIntoBillId, votedInVotingId, ...rest }) => ({
			billId: md5(billId),
			date: date ? new Date(date) : undefined,
			title: title ?? eventTypeTitleDescription[rest.type].title,
			description: description ?? eventTypeTitleDescription[rest.type].description,
			...(mergedIntoBillId ? { mergedIntoBillId: md5(mergedIntoBillId) } : {}),
			...(votedInVotingId ? { votedInVotingId: md5(votedInVotingId) } : {}),
			...rest
		})
	);

export type BillEvent = z.infer<typeof billEventSchema>;
