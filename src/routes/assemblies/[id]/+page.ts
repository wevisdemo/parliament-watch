import { AssemblyName } from '$models/assembly';
import type { Party } from '$models/party';
import type { Politician } from '$models/politician';
import { DefaultVotingResult, type Voting } from '$models/voting';
import { fetchAssemblies, fetchFromIdOr404 } from '../../../libs/datasheets';
import {
	bhumjaithaiParty,
	democratsParty,
	movingForwardParty,
	pheuThaiParty
} from '../../../mocks/data/party';
import { fetchAssemblyMembers } from './data';

export interface Summary {
	totalMembers: number;
	highlightGroup: MemberGroup[];
	groupBySex: MemberGroup[];
	groupByAgeRange: MemberGroup[];
	groupByEducation: MemberGroup[];
	groupByAssetValue: MemberGroup[];
}

export interface MemberGroup {
	name: string;
	total: number;
	parties?: (Pick<Party, 'name' | 'color'> & { count: number })[];
}

export interface MainMember {
	assemblyRole: string;
	politician: Pick<Politician, 'id' | 'firstname' | 'lastname' | 'avatar'>;
	party?: Party;
	description?: string;
}

export interface VoteCardProps {
	voting: Pick<Voting, 'id' | 'title' | 'date' | 'result'>;
	highlightedVoteByGroups: {
		name: string;
		count: number;
		total: number;
	}[];
}

export async function load({ params }) {
	const fullAssembly = await fetchFromIdOr404(fetchAssemblies, params.id);

	const { mainRoles, ...assembly } = fullAssembly;
	const isSenates = assembly.name === AssemblyName.Senates;

	const members = await fetchAssemblyMembers(fullAssembly);

	// TODO: use first members while assemblies role in datasheet is not filled out yet
	const mainMembers: MainMember[] = mainRoles.map((mainRole, i) => {
		const { id, firstname, lastname, avatar, partyRole, assemblyRole } = members[i];

		return {
			assemblyRole: mainRole,
			politician: {
				id,
				firstname,
				lastname,
				avatar
			},
			party: partyRole?.party,
			description: assemblyRole?.appointmentMethod
		};
	});

	const summary: Summary = {
		totalMembers: 500,
		highlightGroup: isSenates
			? [
					{
						name: 'เลือกโดย คสช.',
						total: 194
					},
					{
						name: 'เลือกกันเอง',
						total: 50
					},
					{
						name: 'โดยตำแหน่ง',
						total: 6
					}
			  ]
			: [
					{
						name: 'ฝ่ายรัฐบาล',
						total: 300,
						parties: [
							{ ...pheuThaiParty, count: 200 },
							{ ...bhumjaithaiParty, count: 100 }
						]
					},
					{
						name: 'ฝ่ายค้าน',
						total: 200,
						parties: [
							{ ...movingForwardParty, count: 150 },
							{ ...democratsParty, count: 50 }
						]
					}
			  ],
		groupBySex: [
			{
				name: 'ชาย',
				total: 300,
				parties: [
					{ ...pheuThaiParty, count: 100 },
					{ ...bhumjaithaiParty, count: 100 },
					{ ...movingForwardParty, count: 50 },
					{ ...democratsParty, count: 50 }
				]
			},
			{
				name: 'หญิง',
				total: 150,
				parties: [
					{ ...pheuThaiParty, count: 50 },
					{ ...bhumjaithaiParty, count: 50 },
					{ ...movingForwardParty, count: 30 },
					{ ...democratsParty, count: 20 }
				]
			},
			{ name: 'ไม่มีข้อมูล', total: 50 }
		],
		groupByAgeRange: [
			{
				name: 'Silent Gen (19xx-19xx)',
				total: 100,
				parties: [
					{ ...pheuThaiParty, count: 30 },
					{ ...bhumjaithaiParty, count: 30 },
					{ ...movingForwardParty, count: 20 },
					{ ...democratsParty, count: 20 }
				]
			},
			{
				name: 'Baby Boomers (19xx-19xx)',
				total: 150,
				parties: [
					{ ...pheuThaiParty, count: 50 },
					{ ...bhumjaithaiParty, count: 50 },
					{ ...movingForwardParty, count: 30 },
					{ ...democratsParty, count: 20 }
				]
			},
			{
				name: 'Gen X (19xx-19xx)',
				total: 80,
				parties: [
					{ ...pheuThaiParty, count: 20 },
					{ ...bhumjaithaiParty, count: 20 },
					{ ...movingForwardParty, count: 20 },
					{ ...democratsParty, count: 20 }
				]
			},
			{
				name: 'Gen Y (19xx-19xx)',
				total: 70,
				parties: [
					{ ...pheuThaiParty, count: 30 },
					{ ...bhumjaithaiParty, count: 20 },
					{ ...movingForwardParty, count: 10 },
					{ ...democratsParty, count: 10 }
				]
			},
			{
				name: 'Gen Z (19xx-19xx)',
				total: 70,
				parties: [
					{ ...pheuThaiParty, count: 40 },
					{ ...bhumjaithaiParty, count: 10 },
					{ ...movingForwardParty, count: 10 },
					{ ...democratsParty, count: 10 }
				]
			},
			{ name: 'ไม่มีข้อมูล', total: 30 }
		],
		groupByEducation: [
			{
				name: 'สถาบันทหาร',
				total: 100,
				parties: [
					{ ...pheuThaiParty, count: 30 },
					{ ...bhumjaithaiParty, count: 20 },
					{ ...movingForwardParty, count: 10 },
					{ ...democratsParty, count: 10 }
				]
			},
			{
				name: 'ต่ำกว่าปริญญาตรี',
				total: 150,
				parties: [
					{ ...pheuThaiParty, count: 50 },
					{ ...bhumjaithaiParty, count: 50 },
					{ ...movingForwardParty, count: 30 },
					{ ...democratsParty, count: 20 }
				]
			},
			{
				name: 'ปริญญาตรี',
				total: 80,
				parties: [
					{ ...pheuThaiParty, count: 20 },
					{ ...bhumjaithaiParty, count: 20 },
					{ ...movingForwardParty, count: 20 },
					{ ...democratsParty, count: 20 }
				]
			},
			{
				name: 'ปริญญาโท',
				total: 70,
				parties: [
					{ ...pheuThaiParty, count: 30 },
					{ ...bhumjaithaiParty, count: 30 },
					{ ...movingForwardParty, count: 20 },
					{ ...democratsParty, count: 20 }
				]
			},
			{
				name: 'ปริญญาเอก',
				total: 70,
				parties: [
					{ ...pheuThaiParty, count: 40 },
					{ ...bhumjaithaiParty, count: 10 },
					{ ...movingForwardParty, count: 10 },
					{ ...democratsParty, count: 10 }
				]
			},
			{ name: 'ไม่มีข้อมูล', total: 30 }
		],
		groupByAssetValue: [
			{
				name: 'ต่ำกว่า 1 ล้านบาท',
				total: 100,
				parties: [
					{ ...pheuThaiParty, count: 30 },
					{ ...bhumjaithaiParty, count: 30 },
					{ ...movingForwardParty, count: 20 },
					{ ...democratsParty, count: 20 }
				]
			},
			{
				name: '1-10 ล้านบาท',
				total: 150,
				parties: [
					{ ...pheuThaiParty, count: 50 },
					{ ...bhumjaithaiParty, count: 50 },
					{ ...movingForwardParty, count: 30 },
					{ ...democratsParty, count: 20 }
				]
			},
			{
				name: '11-100 ล้านบาท',
				total: 80,
				parties: [
					{ ...pheuThaiParty, count: 20 },
					{ ...bhumjaithaiParty, count: 20 },
					{ ...movingForwardParty, count: 20 },
					{ ...democratsParty, count: 20 }
				]
			},
			{
				name: '101-1000 ล้านบาท',
				total: 70,
				parties: [
					{ ...pheuThaiParty, count: 30 },
					{ ...bhumjaithaiParty, count: 20 },
					{ ...movingForwardParty, count: 10 },
					{ ...democratsParty, count: 10 }
				]
			},
			{
				name: '1000 ล้านบาทขึ้นไป',
				total: 70,
				parties: [
					{ ...pheuThaiParty, count: 40 },
					{ ...bhumjaithaiParty, count: 10 },
					{ ...movingForwardParty, count: 10 },
					{ ...democratsParty, count: 10 }
				]
			},
			{ name: 'ไม่มีข้อมูล', total: 30 }
		]
	};

	const latestVotes: VoteCardProps[] = new Array(5)
		.fill([
			{ name: 'สส. ฝ่ายรัฐบาล', count: 160, total: 315 },
			{ name: 'สส. ฝ่ายค้าน', count: 164, total: 185 },
			{ name: 'สว.', count: 200, total: 250 }
		])
		.map<VoteCardProps>((highlightedVoteByGroups, i) => ({
			voting: {
				id: i + 1,
				date: new Date(`09/${i + 1}/2023`),
				title:
					i % 3 < 2 ? 'ร่าง พ.ร.บ. สุราก้าวหน้า (ส่งไป ครม.)' : 'เลือกนายกรัฐมนตรีไทย คนที่ 29',
				result: [DefaultVotingResult.Passed, DefaultVotingResult.Failed, 'ชื่อแคนดิเดต'][i % 3]
			},
			highlightedVoteByGroups
		}));

	const assemblyIds: string[] = (await fetchAssemblies()).map(({ id }) => id);

	return {
		assemblyIds,
		assembly,
		summary,
		mainMembers,
		latestVotes
	};
}
