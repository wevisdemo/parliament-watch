import type { Assembly } from '$models/assembly.js';
import type { Party } from '$models/party.js';
import type { Politician } from '$models/politician.js';
import { rep26 } from '../../../mocks/data/assembly.js';
import {
	bhumjaithaiParty,
	democratsParty,
	movingForwardParty,
	pheuThaiParty
} from '../../../mocks/data/party.js';

type AssemblySummary = Omit<Assembly, 'mainRoles'>;

interface Summary {
	totalMembers: number;
	highlightGroup: MemberGroup[];
	groupBySex: MemberGroup[];
	groupByAgeRange: MemberGroup[];
	groupByEducation: MemberGroup[];
	groupByAssetValue: MemberGroup[];
}

interface MemberGroup {
	name: string;
	total: number;
	parties?: { party: Party; count: number }[];
}

interface MainMember {
	assemblyRole: string;
	politician: Pick<Politician, 'id' | 'firstname' | 'lastname'>;
	party: Party;
	partyRole: string;
}

export function load({ params }) {
	const { mainRoles, ...rep26Summary } = rep26;

	const assembly: AssemblySummary = {
		...rep26Summary,
		id: params.id
	};

	const mainMembers: MainMember[] = mainRoles.map((assemblyRole) => ({
		assemblyRole,
		politician: {
			id: 'สมชาติ-สกุลสมมุติ',
			firstname: 'สมชาติ',
			lastname: 'สกุลสมมุติ'
		},
		party: movingForwardParty,
		partyRole: 'สส. บัญชีรายชื่อ'
	}));

	const summary: Summary = {
		totalMembers: 500,
		highlightGroup: [
			{
				name: 'ฝ่ายรัฐบาล',
				total: 300,
				parties: [
					{ party: pheuThaiParty, count: 200 },
					{ party: bhumjaithaiParty, count: 100 }
				]
			},
			{
				name: 'ฝ่ายค้าน',
				total: 200,
				parties: [
					{ party: movingForwardParty, count: 150 },
					{ party: democratsParty, count: 50 }
				]
			}
		],
		groupBySex: [
			{
				name: 'ชาย',
				total: 300,
				parties: [
					{ party: pheuThaiParty, count: 100 },
					{ party: bhumjaithaiParty, count: 100 },
					{ party: movingForwardParty, count: 50 },
					{ party: democratsParty, count: 50 }
				]
			},
			{
				name: 'หญิง',
				total: 150,
				parties: [
					{ party: pheuThaiParty, count: 50 },
					{ party: bhumjaithaiParty, count: 50 },
					{ party: movingForwardParty, count: 30 },
					{ party: democratsParty, count: 20 }
				]
			},
			{ name: 'ไม่มีข้อมูล', total: 50 }
		],
		groupByAgeRange: [
			{
				name: 'Silent Gen (19xx-19xx)',
				total: 100,
				parties: [
					{ party: pheuThaiParty, count: 30 },
					{ party: bhumjaithaiParty, count: 30 },
					{ party: movingForwardParty, count: 20 },
					{ party: democratsParty, count: 20 }
				]
			},
			{
				name: 'Baby Boomers (19xx-19xx)',
				total: 150,
				parties: [
					{ party: pheuThaiParty, count: 50 },
					{ party: bhumjaithaiParty, count: 50 },
					{ party: movingForwardParty, count: 30 },
					{ party: democratsParty, count: 20 }
				]
			},
			{
				name: 'Gen X (19xx-19xx)',
				total: 80,
				parties: [
					{ party: pheuThaiParty, count: 20 },
					{ party: bhumjaithaiParty, count: 20 },
					{ party: movingForwardParty, count: 20 },
					{ party: democratsParty, count: 20 }
				]
			},
			{
				name: 'Gen Y (19xx-19xx)',
				total: 70,
				parties: [
					{ party: pheuThaiParty, count: 30 },
					{ party: bhumjaithaiParty, count: 20 },
					{ party: movingForwardParty, count: 10 },
					{ party: democratsParty, count: 10 }
				]
			},
			{
				name: 'Gen Z (19xx-19xx)',
				total: 70,
				parties: [
					{ party: pheuThaiParty, count: 40 },
					{ party: bhumjaithaiParty, count: 10 },
					{ party: movingForwardParty, count: 10 },
					{ party: democratsParty, count: 10 }
				]
			},
			{ name: 'ไม่มีข้อมูล', total: 30 }
		],
		groupByEducation: [
			{
				name: 'สถาบันทหาร',
				total: 100,
				parties: [
					{ party: pheuThaiParty, count: 30 },
					{ party: bhumjaithaiParty, count: 20 },
					{ party: movingForwardParty, count: 10 },
					{ party: democratsParty, count: 10 }
				]
			},
			{
				name: 'ต่ำกว่าปริญญาตรี',
				total: 150,
				parties: [
					{ party: pheuThaiParty, count: 50 },
					{ party: bhumjaithaiParty, count: 50 },
					{ party: movingForwardParty, count: 30 },
					{ party: democratsParty, count: 20 }
				]
			},
			{
				name: 'ปริญญาตรี',
				total: 80,
				parties: [
					{ party: pheuThaiParty, count: 20 },
					{ party: bhumjaithaiParty, count: 20 },
					{ party: movingForwardParty, count: 20 },
					{ party: democratsParty, count: 20 }
				]
			},
			{
				name: 'ปริญญาโท',
				total: 70,
				parties: [
					{ party: pheuThaiParty, count: 30 },
					{ party: bhumjaithaiParty, count: 30 },
					{ party: movingForwardParty, count: 20 },
					{ party: democratsParty, count: 20 }
				]
			},
			{
				name: 'ปริญญาเอก',
				total: 70,
				parties: [
					{ party: pheuThaiParty, count: 40 },
					{ party: bhumjaithaiParty, count: 10 },
					{ party: movingForwardParty, count: 10 },
					{ party: democratsParty, count: 10 }
				]
			},
			{ name: 'ไม่มีข้อมูล', total: 30 }
		],
		groupByAssetValue: [
			{
				name: 'ต่ำกว่า 1 ล้านบาท',
				total: 100,
				parties: [
					{ party: pheuThaiParty, count: 30 },
					{ party: bhumjaithaiParty, count: 30 },
					{ party: movingForwardParty, count: 20 },
					{ party: democratsParty, count: 20 }
				]
			},
			{
				name: '1-10 ล้านบาท',
				total: 150,
				parties: [
					{ party: pheuThaiParty, count: 50 },
					{ party: bhumjaithaiParty, count: 50 },
					{ party: movingForwardParty, count: 30 },
					{ party: democratsParty, count: 20 }
				]
			},
			{
				name: '11-100 ล้านบาท',
				total: 80,
				parties: [
					{ party: pheuThaiParty, count: 20 },
					{ party: bhumjaithaiParty, count: 20 },
					{ party: movingForwardParty, count: 20 },
					{ party: democratsParty, count: 20 }
				]
			},
			{
				name: '101-1000 ล้านบาท',
				total: 70,
				parties: [
					{ party: pheuThaiParty, count: 30 },
					{ party: bhumjaithaiParty, count: 20 },
					{ party: movingForwardParty, count: 10 },
					{ party: democratsParty, count: 10 }
				]
			},
			{
				name: '1000 ล้านบาทขึ้นไป',
				total: 70,
				parties: [
					{ party: pheuThaiParty, count: 40 },
					{ party: bhumjaithaiParty, count: 10 },
					{ party: movingForwardParty, count: 10 },
					{ party: democratsParty, count: 10 }
				]
			},
			{ name: 'ไม่มีข้อมูล', total: 30 }
		]
	};

	return {
		assembly,
		summary,
		mainMembers
	};
}
