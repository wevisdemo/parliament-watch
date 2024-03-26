import { safeFind } from '$lib/datasheets/processor';
import type { Party } from './party';
import { z } from 'zod';

export enum AssemblyName {
	Representatives = 'สภาผู้แทนราษฎร',
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

export const createAssemblySchema = (
	parties: Party[],
	assemblyPartyGroups: z.infer<typeof assemblyPartyGroupSchema>[]
) =>
	z
		.object({
			id: z.string().trim(),
			name: z.nativeEnum(AssemblyName),
			term: z.number(),
			startedAt: z.date(),
			endedAt: z.date().optional(),
			origin: z.string().trim()
		})
		.transform((assembly) => {
			const getPartyGroup = (groupName: AssemblyPartyGroup) =>
				assemblyPartyGroups
					.filter(({ assemblyId, group }) => assemblyId === assembly.id && group === groupName)
					.map(({ partyName }) => safeFind(parties, ({ name }) => name === partyName));

			return {
				...assembly,
				...(assemblyStaticInfoMap[assembly.name] as { abbreviation: string; mainRoles: string[] }),
				governmentParties: getPartyGroup(AssemblyPartyGroup.Government),
				oppositionParties: getPartyGroup(AssemblyPartyGroup.Opposition)
			};
		});

export type Assembly = z.infer<ReturnType<typeof createAssemblySchema>>;

export enum AssemblyPartyGroup {
	Government = 'ฝ่ายรัฐบาล',
	Opposition = 'ฝ่ายค้าน'
}

export const assemblyPartyGroupSchema = z
	.object({
		assemblyId: z.string().trim(),
		partyName: z.string().trim(),
		group: z.nativeEnum(AssemblyPartyGroup)
	})
	.transform((d) => d);

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
