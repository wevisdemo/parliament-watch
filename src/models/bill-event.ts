export type BillEvent = {
	date?: Date;
	type: BillEventType;
	actionType?: BillEventActionType;
	enforcementDocumentUrl?: string;
	billId: string;
	title: string;
	description: string;
	mergedIntoBillId?: string;
	votedInVotingId?: string;
};

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
