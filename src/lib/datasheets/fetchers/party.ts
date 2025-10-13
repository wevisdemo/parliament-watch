import type { Party } from '$models/party';
import { asStaticImage } from '../transformers';
import { sheets, withCache } from './shared';
import { asString, Column, Object } from 'sheethuahua';

const DEFAULT_PARTY_COLOR = '#F4F4F4';

export const fetchParties = withCache('Parties', (): Promise<Party[]> => {
	const partySchema = Object({
		name: Column('name', asString()),
		color: Column('color', asString().optional(DEFAULT_PARTY_COLOR)),
		logo: Column('name', asStaticImage('/images/parties'))
	});

	return sheets.get('Parties', partySchema);
});
