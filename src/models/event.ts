export enum EventType {
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

export enum EventStatus {
	Succeed = 'succeed',
	InProgress = 'in-progress',
	Failed = 'failed'
}

export enum EventActionType {
	Voted = 'voted',
	Merged = 'merged',
	Enforced = 'enforced'
}

export interface Event {
	billId: number;
	date: Date;
	type: EventType;
	title?: string;
	description?: string;
	status: EventStatus;
	actionType?: EventActionType;
	votedInVotingId?: string;
	mergedIntoBillId?: number;
	enforcementDocumentUrl?: string;
}
