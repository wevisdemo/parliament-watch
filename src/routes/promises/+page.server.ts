import { fetchAssemblies, fetchParties, fetchPoliticians, fetchPromises } from '$lib/datasheets';
import { getAssemblyMembers } from '$lib/datasheets/assembly-member';
import type { Assembly } from '$models/assembly';
import type { Party } from '$models/party';
import type { Politician } from '$models/politician';
import { PromiseStatus, type Promise, type PromiseSummary } from '$models/promise';
import { error } from '@sveltejs/kit';
import { groups } from 'd3';
import dayjs from 'dayjs';

const MAX_PROMISES_SAMPLE = 3;

export interface CabinetSummary extends Pick<Assembly, 'id' | 'startedAt'> {
	primeMinister: Pick<Politician, 'firstname' | 'lastname' | 'avatar'> & { party?: Party };
	cabinetMemberCount: number;
	cabinetMemberCountsByParty: { party: Party | 'ไม่สังกัดพรรค'; count: number }[];
	policyStatement: string;
}

export interface PreviousCabinetSummary extends Pick<Assembly, 'id' | 'startedAt'> {
	primeMinister: Pick<Politician, 'firstname' | 'lastname'> & { party?: Party };
	cabinetMemberCountsByParty: { party: Party | 'ไม่สังกัดพรรค'; count: number }[];
	endedAt: Date;
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

export type AssemblyMember = ReturnType<typeof getAssemblyMembers>[number];

const CURRENT_CABINET_ASSEMBLY_ID = 'คณะรัฐมนตรี-64';
const PREVIOUS_CABINET_ASSEMBLY_ID = 'คณะรัฐมนตรี-63';

function findCabinetAssemblyWithId(assemblies: Assembly[], id: string) {
	const cabinetAssembly = assemblies.find((a) => a.id === id);
	if (!cabinetAssembly) {
		error(500, `Cannot find the cabinet: ${id}`);
	}
	return cabinetAssembly;
}

function findPrimeMinister(cabinetMembers: AssemblyMember[]) {
	const primeMinister = cabinetMembers.find((m) => m.assemblyRole?.role === 'นายกรัฐมนตรี');
	if (!primeMinister) {
		error(500, `Cannot find the prime minister in the given cabinet`);
	}
	return primeMinister;
}

function getCainetMembers(cabinetAssembly: Assembly, politicians: Politician[]) {
	return getAssemblyMembers(cabinetAssembly, politicians).filter(
		({ assemblyRole }) =>
			!assemblyRole?.endedAt ||
			(cabinetAssembly.endedAt && !dayjs(cabinetAssembly.endedAt).isAfter(assemblyRole.endedAt))
	);
}

function getCabinetMemberCountsByParty(cabinetMembers: any[], parties: Party[]) {
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

	return Object.entries(cabinetMemberCountsByPartyName).map(
		([name, count]): { party: Party | 'ไม่สังกัดพรรค'; count: number } => {
			const party =
				name === 'ไม่สังกัดพรรค' ? 'ไม่สังกัดพรรค' : parties.find((p) => p.name === name);
			if (!party) {
				error(500, `Cannot find a party with name: ${name}`);
			}
			return {
				party,
				count: count as number
			};
		}
	);
}

export async function load() {
	const assemblies: Assembly[] = await fetchAssemblies();
	const politicians: Politician[] = await fetchPoliticians();
	const parties: Party[] = await fetchParties();
	const promises: Promise[] = await fetchPromises();

	const cabinetAssembly = findCabinetAssemblyWithId(assemblies, CURRENT_CABINET_ASSEMBLY_ID);
	const cabinetMembers = getCainetMembers(cabinetAssembly, politicians);
	const cabinetMemberCountsByParty = getCabinetMemberCountsByParty(cabinetMembers, parties);
	const primeMinister = findPrimeMinister(cabinetMembers);

	const mockPolicyStatement =
		'นางสาวแพทองธาร ชินวัตร นายกรัฐมนตรี ได้แถลงนโยบายต่อรัฐสภาเมื่อวันที่ 12 กันยายน 2567 โดยเน้นความท้าทายที่ประเทศไทยต้องเผชิญ เช่น การเติบโตทางเศรษฐกิจที่ต่ำกว่าศักยภาพ ปัญหาหนี้สิน ความเหลื่อมล้ำ และสิ่งแวดล้อม โดยรัฐบาลตั้งใจจะเปลี่ยนความท้าทายเหล่านี้ให้เป็นโอกาสและความเสมอภาคทางเศรษฐกิจและสังคม นโยบายเร่งด่วนของรัฐบาลประกอบด้วย 10 ข้อ อาทิ การปรับโครงสร้างหนี้ การกระตุ้นเศรษฐกิจผ่านดิจิทัลวอลเล็ต การลดราคาพลังงาน และการส่งเสริมการท่องเที่ยว รวมถึงแผนระยะยาวเพื่อพัฒนาเศรษฐกิจดิจิทัล ยานยนต์ไฟฟ้า และพลังงานสะอาด ';

	const cabinet: CabinetSummary = {
		id: cabinetAssembly.id,
		startedAt: cabinetAssembly.startedAt,
		primeMinister: {
			firstname: primeMinister.firstname,
			lastname: primeMinister.lastname,
			party: primeMinister.partyRole?.party,
			avatar: primeMinister.avatar
		},
		cabinetMemberCount: cabinetMembers.length,
		cabinetMemberCountsByParty,
		policyStatement: mockPolicyStatement
	};

	const previousCabinetAssembly = findCabinetAssemblyWithId(
		assemblies,
		PREVIOUS_CABINET_ASSEMBLY_ID
	);
	const previousCabinetMembers = getCainetMembers(previousCabinetAssembly, politicians);
	const previousCabinetMemberCountsByParty = getCabinetMemberCountsByParty(
		previousCabinetMembers,
		parties
	);
	const previousPrimeMinister = findPrimeMinister(previousCabinetMembers);

	if (!previousCabinetAssembly.endedAt) {
		error(500, `Previous cabinet not have endedAt`);
	}

	const previousCabinet: PreviousCabinetSummary = {
		id: previousCabinetAssembly.id,
		startedAt: previousCabinetAssembly.startedAt,
		endedAt: previousCabinetAssembly.endedAt,
		primeMinister: {
			firstname: previousPrimeMinister.firstname,
			lastname: previousPrimeMinister.lastname,
			party: previousPrimeMinister.partyRole?.party
		},
		cabinetMemberCountsByParty: previousCabinetMemberCountsByParty
	};

	const byStatus: PromisesByStatus[] = groups(promises, (p) => p.status).map(
		([status, promisesByStatus]) => ({
			status,
			samples: promisesByStatus
				.slice(0, MAX_PROMISES_SAMPLE)
				.map(({ id, statements }) => ({ id, statements })),
			count: promisesByStatus.length
		})
	);

	const byCategory: PromisesByCategory[] = groups(
		promises.flatMap((p) =>
			p.categories.map((category) => ({
				...p,
				category
			}))
		),
		(p) => p.category
	).map(([category, promisesByCategory]) => ({
		category,
		byStatuses: Object.fromEntries(
			groups(promisesByCategory, (p) => p.status).map(([status, promisesByStatus]) => [
				status,
				promisesByStatus.length
			])
		) as PromiseCountByStatus,
		count: promisesByCategory.length
	}));

	const promiseSummaries: PromiseSummary[] = promises.map(
		({ id, statements, party, keywords, categories, status, progresses }) => ({
			id,
			statements,
			party,
			keywords,
			categories,
			status,
			latestProgressDate: progresses.at(0)?.date
		})
	);

	return {
		cabinet,
		previousCabinet,
		byStatus,
		byCategory,
		activeCount: promises.filter(({ status }) => status !== PromiseStatus.notStarted).length,
		count: promises.length,
		promiseSummaries
	};
}
