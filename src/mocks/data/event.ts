import { EventStatus, type Event, EventType, EventActionType } from '$models/event';

export const hearingEvent: Event = {
	billId: 1,
	date: new Date('2023-09-12'),
	title: 'รับฟังความเห็น',
	type: EventType.Other,
	status: EventStatus.Succeed
};

export const passingMp1Event: Event = {
	billId: 1,
	date: new Date('2023-10-12'),
	type: EventType.MP1,
	status: EventStatus.Succeed,
	actionType: EventActionType.Voted,
	votedInVotingId: '1'
};

export const inProgressMp1Event: Event = {
	...passingMp1Event,
	status: EventStatus.InProgress,
	actionType: undefined,
	votedInVotingId: undefined
};

export const passingMp2Event: Event = {
	billId: 1,
	date: new Date('2023-10-12'),
	type: EventType.MP2,
	status: EventStatus.Succeed
};

export const inProgressMp2Event: Event = {
	...passingMp2Event,
	status: EventStatus.InProgress
};

export const passingMergedMp2Event: Event = {
	...passingMp2Event,
	status: EventStatus.InProgress,
	actionType: EventActionType.Merged,
	mergedIntoBillId: 1
};

export const passingMp3Event: Event = {
	billId: 1,
	date: new Date('2023-10-15'),
	type: EventType.MP3,
	status: EventStatus.Succeed,
	actionType: EventActionType.Voted,
	votedInVotingId: '1'
};

export const failingMp3Event: Event = {
	...passingMp3Event,
	status: EventStatus.Failed,
	votedInVotingId: '2'
};

export const passingSenate1Event: Event = {
	billId: 1,
	date: new Date('2023-10-18'),
	type: EventType.Senate1,
	status: EventStatus.Succeed,
	actionType: EventActionType.Voted,
	votedInVotingId: '3'
};

export const passingSenate2Event: Event = {
	billId: 1,
	date: new Date('2023-10-18'),
	type: EventType.Senate2,
	status: EventStatus.Succeed,
	actionType: EventActionType.Voted,
	votedInVotingId: '3'
};

export const passingSenate3Event: Event = {
	billId: 1,
	date: new Date('2023-10-20'),
	type: EventType.Senate3,
	status: EventStatus.Succeed,
	actionType: EventActionType.Voted,
	votedInVotingId: '3'
};

export const royalAssentEvent: Event = {
	billId: 1,
	date: new Date('2023-10-23'),
	type: EventType.RoyalAssent,
	status: EventStatus.Succeed
};

export const enforcementEvent: Event = {
	billId: 1,
	date: new Date('2023-10-23'),
	type: EventType.Enforcement,
	status: EventStatus.Succeed,
	actionType: EventActionType.Enforced,
	enforcementDocumentUrl: 'https://google.com'
};
