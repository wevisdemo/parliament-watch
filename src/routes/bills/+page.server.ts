import type { Assembly } from '$models/assembly';
import { BillStatus, type Bill, BillProposerType } from '$models/bill';
import { fetchAssemblies } from '$lib/datasheets';
import { enactedBill } from '../../mocks/data/bill';

export interface BillsByStatus {
	status: BillStatus;
	samples: Pick<Bill, 'id' | 'nickname'>[];
	count: number;
}

export interface BillsByCategory {
	category: string;
	samples: Pick<Bill, 'id' | 'nickname'>[];
	count: number;
}

export interface BillsByProposerType {
	proposerType: BillProposerType;
	samples: Pick<Bill, 'id' | 'nickname'>[];
	count: number;
	countByStatus: {
		[status in BillStatus]: number;
	};
}

export async function load() {
	const totalCount = 900;
	const samepleBills = [
		{ id: 1, nickname: 'ร่าง พรบ.สุราก้าวหน้า' },
		{ id: 2, nickname: 'ร่าง พรบ.การจัดสรรที่ดิน' },
		{ id: 3, nickname: 'ร่าง พรบ.กำหนดระยะเวลาดำเนินงานในกระบวนการยุติธรรม' }
	];
	const byStatus: BillsByStatus[] = Object.values(BillStatus).map((status) => {
		return {
			status,
			samples: samepleBills,
			count: 225
		};
	});
	const byCategory: BillsByCategory[] = [
		'ขนส่งสาธารณะ',
		'เศรษฐกิจ',
		'แก้รัฐธรรมนูญ',
		'วัฒนธรรม',
		'เกษตรกรรม'
	].map((category) => {
		return {
			category,
			samples: samepleBills,
			count: 180
		};
	});
	const byProposerType: BillsByProposerType[] = Object.values(BillProposerType).map(
		(proposerType) => {
			return {
				proposerType,
				samples: samepleBills,
				count: 300,
				countByStatus: {
					[BillStatus.InProgress]: 100,
					[BillStatus.Enacted]: 95,
					[BillStatus.Rejected]: 45,
					[BillStatus.Merged]: 60
				}
			};
		}
	);
	const latestEnactedBills: Bill[] = [
		enactedBill,
		{
			// Cabinet-proposed
			...enactedBill,
			proposerType: BillProposerType.Cabinet,
			proposedByAssembly: (await fetchAssemblies()).find(
				({ id }) => id === 'สมาชิกสภาผู้แทนราษฎร-26'
			) as Assembly,
			proposedLedByPolitician: undefined,
			coProposedByPoliticians: undefined
		},
		{
			// People-proposed
			...enactedBill,
			proposerType: BillProposerType.People,
			proposedByPeople: {
				ledBy: 'จีรนุช เปรมชัยพร',
				signatoryCount: 205700
			},
			proposedLedByPolitician: undefined,
			coProposedByPoliticians: undefined
		},
		enactedBill,
		enactedBill
	];

	return {
		totalCount,
		byStatus,
		byCategory,
		byProposerType,
		latestEnactedBills
	};
}
