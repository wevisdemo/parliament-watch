import { z } from 'zod';
import type { StaticImageResolver } from '$lib/datasheets/image';

const DEFAULT_PARTY_COLOR = '#F4F4F4';

export const createPartySchema = (imageResolver: StaticImageResolver) =>
	z
		.object({
			name: z.string(),
			color: z.string().optional()
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
