import { BillStatus, type Bill, BillProposerType } from '$models/bill';

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

export function load() {
	const totalCount = 900;
	const samepleBills = [
		{ id: 1, nickname: 'ร่าง พ.ร.บ. สุราก้าวหน้า' },
		{ id: 2, nickname: 'ร่าง พ.ร.บ. การจัดสรรที่ดิน' },
		{ id: 3, nickname: 'ร่าง พ.ร.บ. กำหนดระยะเวลาดำเนินงานในกระบวนการยุติธรรม' }
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
					[BillStatus.Success]: 95,
					[BillStatus.Rejected]: 45,
					[BillStatus.Merged]: 60
				}
			};
		}
	);

	return {
		totalCount,
		byStatus,
		byCategory,
		byProposerType
	};
}
