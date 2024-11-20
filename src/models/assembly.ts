import type { Party } from './party';

export enum AssemblyName {
	Representatives = 'สภาผู้แทนราษฎร',
	Senates = 'วุฒิสภา',
	Cabinet = 'คณะรัฐมนตรี'
}
export interface Assembly {
	id: string;
	name: AssemblyName;
	term: number;
	startedAt: Date;
	endedAt?: Date;
	origin?: string;
	governmentParties: Party[];
	oppositionParties: Party[];
	abbreviation: string;
	mainRoles: string[];
}

export const assemblyStaticInfoMap = {
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
		mainRoles: []
	}
};

export enum AssemblyPartyGroup {
	Government = 'ฝ่ายรัฐบาล',
	Opposition = 'ฝ่ายค้าน'
}

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
