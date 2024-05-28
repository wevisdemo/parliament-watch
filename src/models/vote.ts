import { slugify } from '$lib/slug';
import { z } from 'zod';

export const voteSchema = z
	.object({
		politicianId: z.string().trim(),
		votingId: z.string().trim(),
		voteOption: z.string().trim()
	})
	.transform(({ votingId, ...votes }) => ({
		votingId: slugify(votingId),
		...votes
	}));

export type Vote = z.infer<typeof voteSchema>;
