import { z } from 'zod';
import { safeFind } from '$lib/datasheets/processor';
import type { Party } from './party';

export enum AssemblyName {
	Representatives = 'สมาชิกสภาผู้แทนราษฎร',
	Senates = 'วุฒิสภา'
}

const assemblyStaticInfoMap = {
	[AssemblyName.Representatives]: {
		abbreviation: 'สส.',
		mainRoles: [
			'ประธานสภาผู้แทนราษฎร',
			'รองประธานสภาผู้แทนราษฎร คนที่ 1',
			'รองประธานสภาผู้แทนราษฎร คนที่ 2',
			'ประธานฝ่ายรัฐบาล',
			'ผู้นำฝ่ายค้าน'
		]
	},
	[AssemblyName.Senates]: {
		abbreviation: 'สว.',
		mainRoles: ['ประธานวุฒิสภา']
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

export enum GroupByOption {
	Party = 'party',
	Province = 'province',
	AppointmentMethod = 'appointment-method',
	Sex = 'sex',
	Age = 'age',
	Education = 'education'
	// TODO: Asset is not in phase 1
	// Assets = 'assets'
}

export const groupByOptionLabelMap = new Map<GroupByOption, string>([
	[GroupByOption.Party, 'พรรค'],
	[GroupByOption.Province, 'จังหวัด'],
	[GroupByOption.AppointmentMethod, 'ที่มา'],
	[GroupByOption.Sex, 'เพศสภาพ'],
	[GroupByOption.Age, 'รุ่นอายุ'],
	[GroupByOption.Education, 'การศึกษา']
	// [GroupByOption.Assets, 'ทรัพย์สิน']
]);
