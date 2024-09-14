import { PromiseStatus, type Promise } from '$models/promise';
import {
	clarifyingPromise,
	fulfilledPromise,
	inProgressPromise,
	notStartedPromise,
	unhonoredPromise
} from '../../mocks/data/promise';

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

export async function load() {
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
		byStatus: mockPromisesByStatus,
		byCategory: mockPromisesByCategory,
		activeCount: 100,
		count: 205
	};
}
