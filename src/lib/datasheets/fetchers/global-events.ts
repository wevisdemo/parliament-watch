import type { GlobalEvent } from '$models/global-event';
import { sheets, withCache } from './shared';
import { asDate, asString, Column, Object } from 'sheethuahua';

export const fetchGlobalEvents = withCache('Global Events', (): Promise<GlobalEvent[]> => {
	const partySchema = Object({
		title: Column('title', asString()),
		description: Column('description', asString()),
		date: Column('date', asDate()),
		url: Column('url', asString())
	});

	return sheets.get('Global Events', partySchema);
});
