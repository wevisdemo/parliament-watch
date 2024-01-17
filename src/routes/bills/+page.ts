import type { Bill, BillProposerType, BillStatus } from '$models/bill';

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
