import { fetchAssemblies, fetchParties, fetchPoliticians } from '$lib/datasheets';
import { getAssemblyMembers } from '$lib/datasheets/assembly-member';
import type { Party } from '$models/party';
import type { Politician } from '$models/politician';
import { PromiseStatus, type Promise } from '$models/promise';
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
}

export type PromiseSample = Pick<Promise, 'id' | 'statements'>;
export type PromiseCountByStatus = Record<PromiseStatus, number>;

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

	const cabinet: CabinetSummary = {
		id: cabinetAssembly.id,
		startedAt: cabinetAssembly.startedAt,
		primeMinister: {
			firstname: primeMinister.firstname,
			lastname: primeMinister.lastname,
			party: primeMinister.partyRole?.party
		},
		cabinetMemberCount: cabinetMembers.length,
		cabinetMemberCountsByParty
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
				[PromiseStatus.notStarted]: 17,
				[PromiseStatus.inProgress]: 3,
				[PromiseStatus.clarifying]: 1,
				[PromiseStatus.fulfilled]: 1,
				[PromiseStatus.unhonored]: 2
			},
			count: 24
		},
		{
			category: 'สังคม',
			byStatuses: {
				[PromiseStatus.notStarted]: 1,
				[PromiseStatus.inProgress]: 10,
				[PromiseStatus.clarifying]: 1,
				[PromiseStatus.fulfilled]: 0,
				[PromiseStatus.unhonored]: 4
			},
			count: 16
		},
		{
			category: 'เศรษฐกิจ',
			byStatuses: {
				[PromiseStatus.notStarted]: 1,
				[PromiseStatus.inProgress]: 3,
				[PromiseStatus.clarifying]: 1,
				[PromiseStatus.fulfilled]: 1,
				[PromiseStatus.unhonored]: 2
			},
			count: 8
		},
		{
			category: 'สิ่งแวดล้อม',
			byStatuses: {
				[PromiseStatus.notStarted]: 2,
				[PromiseStatus.inProgress]: 3,
				[PromiseStatus.clarifying]: 0,
				[PromiseStatus.fulfilled]: 1,
				[PromiseStatus.unhonored]: 2
			},
			count: 8
		},
		{
			category: 'ความมั่นคง',
			byStatuses: {
				[PromiseStatus.notStarted]: 2,
				[PromiseStatus.inProgress]: 1,
				[PromiseStatus.clarifying]: 0,
				[PromiseStatus.fulfilled]: 0,
				[PromiseStatus.unhonored]: 1
			},
			count: 4
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
