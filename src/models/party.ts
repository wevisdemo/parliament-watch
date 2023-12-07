import { z } from 'zod';

const DEFAULT_PARTY_COLOR = '#F4F4F4';

export const partySchema = z
	.object({
		name: z.string(),
		color: z.string().optional()
	})
	.transform(({ name, color: c }) => {
		const color = c ?? DEFAULT_PARTY_COLOR;
		return {
			name,
			color,
			// TODO: map logo url
			logo: `https://placehold.co/64x64/${color}/white?text=P`
		};
	});

export type Party = z.infer<typeof partySchema>;
