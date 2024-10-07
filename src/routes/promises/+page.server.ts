import { fetchAssemblies, fetchParties, fetchPoliticians } from '$lib/datasheets';
import { getAssemblyMembers } from '$lib/datasheets/assembly-member';
import type { Party } from '$models/party';
import type { Politician } from '$models/politician';
import { PromiseStatus, type Promise, type PromiseProgress } from '$models/promise';
import {
	clarifyingPromise,
	fulfilledPromise,
	inProgressPromise,
	notStartedPromise,
	promiseSummaries,
	unhonoredPromise
} from '../../mocks/data/promise';
import { error } from '@sveltejs/kit';
import type { Assembly } from 'carbon-icons-svelte';
import dayjs from 'dayjs';

export interface CabinetSummary extends Pick<Assembly, 'id' | 'startedAt'> {
	primeMinister: Pick<Politician, 'firstname' | 'lastname'> & { party?: Party };
	cabinetMemberCount: number;
	cabinetMemberCountsByParty: { party: Party | 'ไม่สังกัดพรรค'; count: number }[];
	policyStatement: string;
}

export type PromiseSample = Pick<Promise, 'id' | 'statements'>;
export type PromiseCountByStatus = {
	[PromiseStatus.inProgress]: number;
	[PromiseStatus.fulfilled]: number;
	[PromiseStatus.unhonored]: number;
};

export interface PromisesByStatus {
	status: PromiseStatus;
	samples: PromiseSample[];
	count: number;
}

export interface PromisesByCategory {
	category: string;
	byStatuses: PromiseCountByStatus;
	count: number;
}

export interface PromiseSummary
	extends Pick<Promise, 'id' | 'statements' | 'party' | 'keywords' | 'categories' | 'status'> {
	latestProgressDate: PromiseProgress;
}

const CURRENT_CABINET_ASSEMBLY_ID = 'คณะรัฐมนตรี-64';

export async function load() {
	const cabinetAssembly = (await fetchAssemblies()).find(
		(a) => a.id === CURRENT_CABINET_ASSEMBLY_ID
	);
	if (!cabinetAssembly) {
		error(500, `Cannot find the current cabinet: ${CURRENT_CABINET_ASSEMBLY_ID}`);
	}

	const politicians = await fetchPoliticians();
	const parties = await fetchParties();

	const cabinetMembers = getAssemblyMembers(cabinetAssembly, politicians).filter(
		({ assemblyRole }) =>
			!assemblyRole?.endedAt ||
			(cabinetAssembly.endedAt && !dayjs(cabinetAssembly.endedAt).isAfter(assemblyRole.endedAt))
	);

	const cabinetMemberCountsByPartyName = cabinetMembers
		.map((m) => m.partyRole?.party.name)
		.reduce(
			(result, value) => {
				const key = value ?? 'ไม่สังกัดพรรค';
				result[key] = (result[key] ?? 0) + 1;
				return result;
			},
			{} as { [partyName: string]: number }
		);

	const cabinetMemberCountsByParty = Object.entries(cabinetMemberCountsByPartyName).map(
		([name, count]): { party: Party | 'ไม่สังกัดพรรค'; count: number } => {
			const party =
				name === 'ไม่สังกัดพรรค' ? 'ไม่สังกัดพรรค' : parties.find((p) => p.name === name);
			if (!party) {
				error(500, `Cannot find a party with name: ${name}`);
			}
			return {
				party,
				count
			};
		}
	);

	const primeMinister = cabinetMembers.find((m) => m.assemblyRole?.role === 'นายกรัฐมนตรี');

	if (!primeMinister) {
		error(500, `Cannot find the current prime minister in the given cabinet`);
	}

	const mockPolicyStatement =
		'นางสาวแพทองธาร ชินวัตร นายกรัฐมนตรี ได้แถลงนโยบายต่อรัฐสภาเมื่อวันที่ 12 กันยายน 2567 โดยเน้นความท้าทายที่ประเทศไทยต้องเผชิญ เช่น การเติบโตทางเศรษฐกิจที่ต่ำกว่าศักยภาพ ปัญหาหนี้สิน ความเหลื่อมล้ำ และสิ่งแวดล้อม โดยรัฐบาลตั้งใจจะเปลี่ยนความท้าทายเหล่านี้ให้เป็นโอกาสและความเสมอภาคทางเศรษฐกิจและสังคม นโยบายเร่งด่วนของรัฐบาลประกอบด้วย 10 ข้อ อาทิ การปรับโครงสร้างหนี้ การกระตุ้นเศรษฐกิจผ่านดิจิทัลวอลเล็ต การลดราคาพลังงาน และการส่งเสริมการท่องเที่ยว รวมถึงแผนระยะยาวเพื่อพัฒนาเศรษฐกิจดิจิทัล ยานยนต์ไฟฟ้า และพลังงานสะอาด ';

	const cabinet: CabinetSummary = {
		id: cabinetAssembly.id,
		startedAt: cabinetAssembly.startedAt,
		primeMinister: {
			firstname: primeMinister.firstname,
			lastname: primeMinister.lastname,
			party: primeMinister.partyRole?.party
		},
		cabinetMemberCount: cabinetMembers.length,
		cabinetMemberCountsByParty,
		policyStatement: mockPolicyStatement
	};

	const mockPromisesByStatus: PromisesByStatus[] = [
		{
			status: PromiseStatus.inProgress,
			samples: [
				{ id: inProgressPromise.id, statements: inProgressPromise.statements },
				{ id: inProgressPromise.id, statements: inProgressPromise.statements },
				{ id: inProgressPromise.id, statements: inProgressPromise.statements }
			],
			count: 85
		},
		{
			status: PromiseStatus.fulfilled,
			samples: [
				{ id: fulfilledPromise.id, statements: fulfilledPromise.statements },
				{ id: fulfilledPromise.id, statements: fulfilledPromise.statements },
				{ id: fulfilledPromise.id, statements: fulfilledPromise.statements }
			],
			count: 10
		},
		{
			status: PromiseStatus.unhonored,
			samples: [
				{ id: unhonoredPromise.id, statements: unhonoredPromise.statements },
				{ id: unhonoredPromise.id, statements: unhonoredPromise.statements },
				{ id: unhonoredPromise.id, statements: unhonoredPromise.statements }
			],
			count: 5
		},
		{
			status: PromiseStatus.notStarted,
			samples: [
				{ id: notStartedPromise.id, statements: notStartedPromise.statements },
				{ id: notStartedPromise.id, statements: notStartedPromise.statements },
				{ id: notStartedPromise.id, statements: notStartedPromise.statements }
			],
			count: 100
		},
		{
			status: PromiseStatus.clarifying,
			samples: [
				{ id: clarifyingPromise.id, statements: clarifyingPromise.statements },
				{ id: clarifyingPromise.id, statements: clarifyingPromise.statements },
				{ id: clarifyingPromise.id, statements: clarifyingPromise.statements }
			],
			count: 5
		}
	];

	const mockPromisesByCategory: PromisesByCategory[] = [
		{
			category: 'ขนส่งสาธารณะ',
			byStatuses: {
				[PromiseStatus.inProgress]: 3,
				[PromiseStatus.fulfilled]: 1,
				[PromiseStatus.unhonored]: 2
			},
			count: 6
		},
		{
			category: 'สังคม',
			byStatuses: {
				[PromiseStatus.inProgress]: 10,
				[PromiseStatus.fulfilled]: 0,
				[PromiseStatus.unhonored]: 4
			},
			count: 14
		},
		{
			category: 'เศรษฐกิจ',
			byStatuses: {
				[PromiseStatus.inProgress]: 3,
				[PromiseStatus.fulfilled]: 1,
				[PromiseStatus.unhonored]: 2
			},
			count: 6
		},
		{
			category: 'สิ่งแวดล้อม',
			byStatuses: {
				[PromiseStatus.inProgress]: 3,
				[PromiseStatus.fulfilled]: 1,
				[PromiseStatus.unhonored]: 2
			},
			count: 6
		},
		{
			category: 'ความมั่นคง',
			byStatuses: {
				[PromiseStatus.inProgress]: 1,
				[PromiseStatus.fulfilled]: 0,
				[PromiseStatus.unhonored]: 1
			},
			count: 2
		}
	];

	return {
		cabinet,
		byStatus: mockPromisesByStatus,
		byCategory: mockPromisesByCategory,
		activeCount: 100,
		count: 205,
		promiseSummaries
	};
}
