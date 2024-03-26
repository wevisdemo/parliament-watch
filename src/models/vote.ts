import md5 from 'md5';
import { z } from 'zod';

export const voteSchema = z
	.object({
		politicianId: z.string().trim(),
		votingId: z.string().trim(),
		voteOption: z.string().trim()
	})
	.transform(({ votingId, ...votes }) => ({
		votingId: md5(votingId),
		...votes
	}));

export type Vote = z.infer<typeof voteSchema>;
