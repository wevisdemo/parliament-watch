import { z } from 'zod';

export enum AssemblyName {
	Representatives = 'สมาชิกสภาผู้แทนราษฎร',
	Senates = 'วุฒิสภา'
}

const assemblyStaticInfoMap = {
	[AssemblyName.Representatives]: {
		abbreviation: 'สส.',
		mainRoles: [
			'ประธานสภา',
			'รองประธานสภา คนที่ 1',
			'รองประธานสภา คนที่ 2',
			'ประธานฝ่ายรัฐบาล',
			'ประธานฝ่ายค้าน'
		]
	},
	[AssemblyName.Senates]: {
		abbreviation: 'สว.',
		mainRoles: ['ประธานสภา', 'รองประธานสภา คนที่ 1', 'รองประธานสภา คนที่ 2']
	}
};

export const assemblySchema = z
	.object({
		id: z.string(),
		name: z.nativeEnum(AssemblyName),
		term: z.number(),
		startedAt: z.date(),
		endedAt: z.date().optional(),
		origin: z.string()
	})
	.transform((d) => ({
		...d,
		...assemblyStaticInfoMap[d.name]
	}));

export type Assembly = z.infer<typeof assemblySchema>;
