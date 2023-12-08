import { z } from 'zod';
import { safeFind } from '../libs/datasheets/processor';
import type { Party } from './party';

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

export const createAssemblySchema = (parties: Party[]) =>
	z
		.object({
			id: z.string(),
			name: z.nativeEnum(AssemblyName),
			term: z.number(),
			startedAt: z.date(),
			endedAt: z.date().optional(),
			origin: z.string(),
			governmentParties: z.string().optional(),
			oppositionParties: z.string().optional()
		})
		.transform(({ name, governmentParties, oppositionParties, ...rest }) => {
			const findPartiesFromCommaSeperatedName = (text?: string) =>
				text?.split(',').map((partyName) => safeFind(parties, (p) => p.name === partyName.trim()));

			return {
				name,
				...rest,
				...(assemblyStaticInfoMap[name] as { abbreviation: string; mainRoles: string[] }),
				governmentParties: findPartiesFromCommaSeperatedName(governmentParties),
				oppositionParties: findPartiesFromCommaSeperatedName(oppositionParties)
			};
		});

export type Assembly = z.infer<ReturnType<typeof createAssemblySchema>>;
