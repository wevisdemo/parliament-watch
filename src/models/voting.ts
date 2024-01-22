import { z } from 'zod';
import type { Link } from './link';
import type { Assembly } from './assembly';
import { safeFind } from '$lib/datasheets/processor';
import md5 from 'md5';

export const createVotingSchema = (assemblies: Assembly[]) =>
	z
		.object({
			id: z.string(),
			title: z.string(),
			officialTitle: z.string().optional(),
			date: z.date(),
			description: z.string().optional(),
			representativeAssemblyId: z.string().optional(),
			senateAssemblyId: z.string().optional(),
			result: z.string().default('รอตรวจสอบ'),
			winningCondition: z.string().optional(),
			categories: z.string().optional(),
			documents: z.string(),
			sourceUrl: z.string()
		})
		.transform(
			({ id, categories, representativeAssemblyId, senateAssemblyId, documents, ...voting }) => ({
				id: md5(id),
				categories: categories?.split(',') || [],
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
			})
		);

export type Voting = z.infer<ReturnType<typeof createVotingSchema>>;

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
