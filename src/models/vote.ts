import { z } from 'zod';

export const voteSchema = z.object({
	politicianId: z.string(),
	votingId: z.string(),
	voteOption: z.string()
});

export type Vote = z.infer<typeof voteSchema>;
