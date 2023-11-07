export enum GroupByOption {
	Party = 'party',
	Province = 'province',
	Sex = 'sex',
	Age = 'age',
	Education = 'education',
	Assets = 'assets'
}

export const groupByOptionLabelMap = new Map<GroupByOption, string>([
	[GroupByOption.Party, 'พรรค'],
	[GroupByOption.Province, 'จังหวัด'],
	[GroupByOption.Sex, 'เพศสภาพ'],
	[GroupByOption.Age, 'รุ่นอายุ'],
	[GroupByOption.Education, 'การศึกษา'],
	[GroupByOption.Assets, 'ทรัพย์สิน']
]);
