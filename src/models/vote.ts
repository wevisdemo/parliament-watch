import { z } from 'zod';
import md5 from 'md5';

export const voteSchema = z
	.object({
		politicianId: z.string(),
		votingId: z.string(),
		voteOption: z.string()
	})
	.transform(({ votingId, ...votes }) => ({
		votingId: md5(votingId),
		...votes
	}));

export type Vote = z.infer<typeof voteSchema>;
