import type { Vote } from '$models/vote';
import { asSlug } from '../transformers';
import { sheets, withCache } from './shared';
import { asString, Column, Object } from 'sheethuahua';

export const fetchVotes = withCache('Votes', (): Promise<Vote[]> => {
	const partySchema = Object({
		politicianId: Column('politicianId', asString()),
		votingId: Column('votingId', asSlug()),
		voteOption: Column('voteOption', asString())
	});

	return sheets.get('Votes', partySchema);
});
