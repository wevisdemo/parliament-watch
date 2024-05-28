import { safeFind } from '$lib/datasheets/processor';
import { slugify } from '$lib/slug';
import type { Assembly } from './assembly';
import type { Link } from './link';
import { Table, Column, type RowType } from 'sheethuahua';

export const votingTable = Table('Votings', {
	id: Column.String(),
	nickname: Column.String(),
	title: Column.OptionalString(),
	date: Column.Date(),
	description: Column.OptionalString(),
	representativeAssemblyId: Column.OptionalString(),
	senateAssemblyId: Column.OptionalString(),
	result: Column.OptionalString(),
	winningCondition: Column.OptionalString(),
	documents: Column.String(),
	sourceUrl: Column.String()
});

export const transformVoting = (
	{
		id,
		result,
		representativeAssemblyId,
		senateAssemblyId,
		documents,
		...voting
	}: RowType<typeof votingTable>,
	assemblies: Assembly[]
) => ({
	id: slugify(id),
	result: result || 'รอตรวจสอบ',
	meetingType:
		representativeAssemblyId && senateAssemblyId
			? 'ประชุมร่วมกันของรัฐสภา'
			: representativeAssemblyId
				? 'ประชุมสภาผู้แทนราษฎร'
				: 'ประชุมวุฒิสภา',
	participatedAssemblies: [representativeAssemblyId, senateAssemblyId]
		.filter((assemblyId) => !!assemblyId)
		.map<Assembly>((assemblyId) => safeFind(assemblies, (a) => a.id === assemblyId)),
	// TODO: Only support default vote option for now
	voteOptions: [
		DefaultVoteOption.Agreed,
		DefaultVoteOption.Disagreed,
		DefaultVoteOption.Novote,
		DefaultVoteOption.Abstain,
		DefaultVoteOption.Absent
	] as (DefaultVoteOption | CustomVoteOption | string)[],
	files: documents.split('\n').map<Link>((line) => {
		const [label, url] = line.split(',').map((value) => value.trim());
		return { label, url };
	}),
	...voting
});

export type Voting = ReturnType<typeof transformVoting>;

export interface CustomVoteOption {
	label: string;
	colorIntensity: number; // 0-1
}

export enum DefaultVotingResult {
	Passed = 'ผ่าน',
	Failed = 'ไม่ผ่าน'
}

export enum DefaultVoteOption {
	Agreed = 'เห็นด้วย',
	Disagreed = 'ไม่เห็นด้วย',
	Novote = 'งดออกเสียง',
	Abstain = 'ไม่ลงคะแนน',
	Absent = 'ลา / ขาดลงมติ'
}

export const defaultVoteOptions: string[] = [
	DefaultVoteOption.Agreed,
	DefaultVoteOption.Disagreed,
	DefaultVoteOption.Novote,
	DefaultVoteOption.Abstain,
	DefaultVoteOption.Absent
];
