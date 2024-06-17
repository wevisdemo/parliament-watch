import { safeFind } from '$lib/datasheets/processor';
import type { Party } from './party';
import { Table, Column, type RowType } from 'sheethuahua';

export enum AssemblyName {
	Representatives = 'สภาผู้แทนราษฎร',
	Senates = 'วุฒิสภา',
	Cabinet = 'คณะรัฐมนตรี'
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
	},
	[AssemblyName.Cabinet]: {
		abbreviation: 'ครม.',
		// TODO: No cabinet member data yet
		mainRoles: []
	}
};

export const assemblyTable = Table('Assemblies', {
	id: Column.String(),
	name: Column.OneOf(Object.values(AssemblyName)),
	term: Column.Number(),
	startedAt: Column.Date(),
	endedAt: Column.OptionalDate(),
	origin: Column.OptionalString()
});

export function transformAssembly(
	assembly: RowType<typeof assemblyTable>,
	parties: Party[],
	assemblyPartyGroups: RowType<typeof assemblyPartyGroupTable>[]
) {
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
}

export type Assembly = ReturnType<typeof transformAssembly>;

export enum AssemblyPartyGroup {
	Government = 'ฝ่ายรัฐบาล',
	Opposition = 'ฝ่ายค้าน'
}

export const assemblyPartyGroupTable = Table('AssemblyPartyGroups', {
	assemblyId: Column.String(),
	partyName: Column.String(),
	group: Column.OneOf(Object.values(AssemblyPartyGroup))
});

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
