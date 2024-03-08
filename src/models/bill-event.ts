export enum BillEventType {
	Hearing = 'hearing',
	MP1 = 'mp1',
	MP2 = 'mp2',
	MP3 = 'mp3',
	Senate1 = 'senate1',
	Senate2 = 'senate2',
	Senate3 = 'senate3',
	RoyalAssent = 'royalAssent',
	Enforcement = 'enforcement',
	Other = 'other'
}

export enum BillEventActionType {
	Voted = 'voted',
	Merged = 'merged',
	Enforced = 'enforced'
}

export interface BillEvent {
	billId: number;
	date: Date;
	type: BillEventType;
	title?: string;
	description?: string;
	actionType?: BillEventActionType;
	votedInVotingId?: string;
	mergedIntoBillId?: number;
	enforcementDocumentUrl?: string;
}
