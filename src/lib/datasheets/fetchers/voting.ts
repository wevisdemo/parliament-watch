import type { Assembly } from '$models/assembly';
import { DefaultVoteOption, type Voting } from '$models/voting';
import { asCsvLinks, asSlug, asValidAssembly } from '../transformers';
import { sheets, withCache } from './shared';
import { asDate, asString, Column, Object, Tuple } from 'sheethuahua';

export const fetchVotings = withCache('Votings', async (): Promise<Voting[]> => {
	const partySchema = Object({
		id: Column('id', asSlug()),
		nickname: Column('nickname', asString()),
		title: Column('title', asString().optional()),
		date: Column('date', asDate()),
		description: Column('description', asString().optional()),
		participatedAssemblies: Tuple([
			Column('representativeAssemblyId', (await asValidAssembly()).optional()),
			Column('senateAssemblyId', (await asValidAssembly()).optional())
		]),
		result: Column('result', asString().optional('รอตรวจสอบ')),
		winningCondition: Column('winningCondition', asString().optional()),
		files: Column('documents', asCsvLinks()),
		sourceUrl: Column('sourceUrl', asString())
	});

	return (await sheets.get('Votings', partySchema)).map((voting) => ({
		...voting,
		participatedAssemblies: voting.participatedAssemblies.filter(
			(assembly) => assembly !== undefined
		) as Assembly[],
		meetingType:
			voting.participatedAssemblies[0] && voting.participatedAssemblies[1]
				? 'ประชุมร่วมกันของรัฐสภา'
				: voting.participatedAssemblies[0]
					? 'ประชุมสภาผู้แทนราษฎร'
					: 'ประชุมวุฒิสภา',
		// TODO: Only support default vote option for now
		voteOptions: [
			DefaultVoteOption.Agreed,
			DefaultVoteOption.Disagreed,
			DefaultVoteOption.Novote,
			DefaultVoteOption.Abstain,
			DefaultVoteOption.Absent
		] as Voting['voteOptions']
	}));
});
