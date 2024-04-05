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
	hearing: {
		title: 'รับฟังความเห็น',
		description: ''
	},
	mp1: {
		title: 'สส.พิจารณา วาระ 1',
		description: 'รับหลักการและตั้งกรรมาธิการ'
	},
	mp2: {
		title: 'สส.พิจารณา วาระ 2',
		description: 'ขั้นกรรมาธิการ และ สส.ลงมติรับรายมาตรา'
	},
	mp3: {
		title: 'สส.พิจารณา วาระ 3',
		description: 'ขั้นลงมติเห็นชอบ'
	},
	senate1: {
		title: 'สว.พิจารณา วาระ 1',
		description: 'รับหลักการและตั้งกรรมาธิการ'
	},
	senate2: {
		title: 'สว.พิจารณา วาระ 2',
		description: 'ขั้นกรรมาธิการ และ สส.ลงมติรับรายมาตรา'
	},
	senate3: {
		title: 'สว.พิจารณา วาระ 3',
		description: 'ขั้นลงมติเห็นชอบ'
	},
	enforcement: {
		title: 'ออกเป็นกฎหมาย',
		description: ''
	},
	other: {
		title: 'รับฟังความเห็น',
		description: ''
	}
};

export const billEventSchema = z
	.object({
		billId: z.string(),
		date: z.string(),
		type: z.nativeEnum(BillEventType),
		title: z.string().optional(),
		description: z.string().optional(),
		actionType: z.nativeEnum(BillEventActionType).optional(),
		votedInVotingId: z.string().optional(),
		mergedIntoBillId: z.string().optional(),
		enforcementDocumentUrl: z.string().optional()
	})
	.transform(({ billId, date, title, description, mergedIntoBillId, ...rest }) => ({
		billId: md5(billId),
		date: new Date(date),
		title: title ?? eventTypeTitleDescription[rest.type].title,
		description: description ?? eventTypeTitleDescription[rest.type].description,
		...(mergedIntoBillId ? { mergedIntoBillId: md5(mergedIntoBillId) } : {}),
		...rest
	}));

export type BillEvent = z.infer<typeof billEventSchema>;
