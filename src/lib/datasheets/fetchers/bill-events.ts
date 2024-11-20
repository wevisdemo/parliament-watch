import {
	BillEventActionType,
	BillEventType,
	eventTypeTitleDescription,
	type BillEvent
} from '$models/bill-event';
import { asSlug } from '../transformers';
import { sheets, withCache } from './shared';
import { asDate, asOneOf, asString, Column, Object } from 'sheethuahua';

const billEventSchema = Object({
	billId: Column('billId', asSlug()),
	date: Column('date', asDate().optional()),
	type: Column('type', asOneOf(global.Object.values(BillEventType))),
	title: Column('title', asString().optional()),
	description: Column('description', asString().optional()),
	actionType: Column('actionType', asOneOf(global.Object.values(BillEventActionType)).optional()),
	votedInVotingId: Column('votedInVotingId', asSlug().optional()),
	mergedIntoBillId: Column('mergedIntoBillId', asSlug().optional()),
	enforcementDocumentUrl: Column('enforcementDocumentUrl', asString().optional())
});

export const fetchBillEvents = withCache(
	'BillEvents',
	async (): Promise<BillEvent[]> =>
		(await sheets.get('BillEvents', billEventSchema)).map((e) => ({
			...e,
			title: e.title ?? eventTypeTitleDescription[e.type].title,
			description: e.description ?? eventTypeTitleDescription[e.type].description
		}))
);
