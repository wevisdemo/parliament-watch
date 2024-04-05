import {
	type BillEvent,
	BillEventType,
	BillEventActionType,
	eventTypeTitleDescription
} from '$models/bill-event';

export const hearingEvent: BillEvent = {
	billId: '1',
	date: new Date('2023-09-12'),
	title: 'รับฟังความเห็น',
	description: '',
	type: BillEventType.Other
};

export const passingMp1Event: BillEvent = {
	billId: '1',
	date: new Date('2023-10-12'),
	type: BillEventType.MP1,
	actionType: BillEventActionType.Voted,
	votedInVotingId: '1',
	...eventTypeTitleDescription[BillEventType.MP1]
};

export const inProgressMp1Event: BillEvent = {
	...passingMp1Event,
	actionType: undefined,
	votedInVotingId: undefined
};

export const passingMp2Event: BillEvent = {
	billId: '1',
	date: new Date('2023-10-12'),
	type: BillEventType.MP2,
	...eventTypeTitleDescription[BillEventType.MP2]
};

export const inProgressMp2Event: BillEvent = {
	...passingMp2Event
};

export const passingMergedMp2Event: BillEvent = {
	...passingMp2Event,
	actionType: BillEventActionType.Merged,
	mergedIntoBillId: '1'
};

export const passingMp3Event: BillEvent = {
	billId: '1',
	date: new Date('2023-10-15'),
	type: BillEventType.MP3,
	actionType: BillEventActionType.Voted,
	votedInVotingId: '1',
	...eventTypeTitleDescription[BillEventType.MP3]
};

export const failingMp3Event: BillEvent = {
	...passingMp3Event,
	votedInVotingId: '2'
};

export const passingSenate1Event: BillEvent = {
	billId: '1',
	date: new Date('2023-10-18'),
	type: BillEventType.Senate1,
	actionType: BillEventActionType.Voted,
	votedInVotingId: '3',
	...eventTypeTitleDescription[BillEventType.Senate1]
};

export const passingSenate2Event: BillEvent = {
	billId: '1',
	date: new Date('2023-10-18'),
	type: BillEventType.Senate2,
	actionType: BillEventActionType.Voted,
	votedInVotingId: '3',
	...eventTypeTitleDescription[BillEventType.Senate2]
};

export const passingSenate3Event: BillEvent = {
	billId: '1',
	date: new Date('2023-10-20'),
	type: BillEventType.Senate3,
	actionType: BillEventActionType.Voted,
	votedInVotingId: '3',
	...eventTypeTitleDescription[BillEventType.Senate3]
};

export const enforcementEvent: BillEvent = {
	billId: '1',
	date: new Date('2023-10-23'),
	type: BillEventType.Enforcement,
	actionType: BillEventActionType.Enforced,
	enforcementDocumentUrl: 'https://google.com',
	...eventTypeTitleDescription[BillEventType.Enforcement]
};
