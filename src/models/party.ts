import type { StaticImageResolver } from '$lib/datasheets/image';
import { z } from 'zod';

const DEFAULT_PARTY_COLOR = '#F4F4F4';

export const createPartySchema = (imageResolver: StaticImageResolver) =>
	z
		.object({
			name: z.string().trim(),
			color: z.string().trim().optional()
		})
		.transform(({ name, color: c }) => {
			const color = c ?? DEFAULT_PARTY_COLOR;
			return {
				name,
				color,
				logo: imageResolver.resolve(`${name}.webp`)
			};
		});

export type Party = z.infer<ReturnType<typeof createPartySchema>>;
