import { safeFind } from '$lib/datasheets/processor';
import type { Assembly } from './assembly';
import type { Link } from './link';
import md5 from 'md5';
import { z } from 'zod';

export const createVotingSchema = (assemblies: Assembly[]) =>
	z
		.object({
			id: z.string().trim(),
			nickname: z.string().trim(),
			title: z.string().trim().optional(),
			date: z.date(),
			description: z.string().trim().optional(),
			representativeAssemblyId: z.string().trim().optional(),
			senateAssemblyId: z.string().trim().optional(),
			result: z.string().trim().default('รอตรวจสอบ'),
			winningCondition: z.string().trim().optional(),
			categories: z.string().trim().optional(),
			documents: z.string().trim(),
			sourceUrl: z.string().trim()
		})
		.transform(
			({ id, categories, representativeAssemblyId, senateAssemblyId, documents, ...voting }) => ({
				id: md5(id),
				categories: categories?.split(',').map((category) => category.trim()) || [],
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

export const CATEGORY_NOT_SPECIFIED = 'ไม่ระบุ';

export const defaultVoteOptions: string[] = [
	DefaultVoteOption.Agreed,
	DefaultVoteOption.Disagreed,
	DefaultVoteOption.Novote,
	DefaultVoteOption.Abstain,
	DefaultVoteOption.Absent
];
