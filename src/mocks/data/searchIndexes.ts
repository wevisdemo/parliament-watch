import { BillStatus } from '$models/bill';
import type { SearchIndexes } from '$models/search';
import { DefaultVotingResult } from '$models/voting';

export const searchIndexes: SearchIndexes = {
	politicians: [
		{
			id: 'สุชาติ-ชมกลิ่น',
			name: 'สุชาติ ชมกลิ่น',
			description: 'สส.บัญชีรายชื่อ | รวมไทยสร้างชาติ'
		},
		{
			id: 'สมคิด-จาตุศรีพิทักษ์',
			name: 'สมคิด จาตุศรีพิทักษ์',
			description: 'นายกรัฐมนตรี'
		},
		{
			id: 'สุชาดา-ชาตรี',
			name: 'สุชาดา ชาตรี',
			description: 'สส.บัญชีรายชื่อ | รวมไทยสร้างชาติ'
		},
		{
			id: 'ภาวัฒน์-พยัคฆบุตร',
			name: 'ภาวัฒน์ พยัคฆบุตร',
			description: 'ไทยสร้างไทย'
		}
	],
	bills: [
		{
			id: '1',
			name: 'ร่าง พรบ.สุราก้าวหน้า',
			status: BillStatus.Rejected
		},
		{
			id: '2',
			name: 'ร่าง พรบ.งบประมาณรายจ่ายประจําปี 2566',
			status: BillStatus.InProgress
		},
		{
			id: '3',
			name: 'ร่าง พรบ.สมรสเท่าเทียม',
			status: BillStatus.InProgress
		},
		{
			id: '4',
			name: 'ร่าง พรบ.แก้กฎหมายค้ามนุษย์',
			status: BillStatus.Enacted
		},
		{
			id: '5',
			name: 'ร่าง พรบ.ควบคุมการครอบครองอาวุธปืน',
			status: BillStatus.Rejected
		},
		{
			id: '6',
			name: 'ร่าง พรบ.คุ้มครองข้อมูลส่วนบุคคล',
			status: BillStatus.InProgress
		},
		{
			id: '7',
			name: 'ร่าง พรบ.คุ้มครองสิทธิผู้บริโภค',
			status: BillStatus.Enacted
		}
	],
	billProposers: [
		{
			name: 'สุชาติ ชมกลิ่น',
			description: 'สส.บัญชีรายชื่อ | รวมไทยสร้างชาติ',
			proposedBillsCount: 0
		},
		{
			name: 'สมคิด จาตุศรีพิทักษ์',
			description: 'นายกรัฐมนตรี',
			proposedBillsCount: 3
		},
		{
			name: 'สุชาดา ชาตรี',
			description: 'สส.บัญชีรายชื่อ | รวมไทยสร้างชาติ',
			proposedBillsCount: 2
		},
		{
			name: 'ภาวัฒน์ พยัคฆบุตร',
			description: 'ไทยสร้างไทย',
			proposedBillsCount: 1
		}
	],
	votings: [
		{
			id: '1',
			name: 'ร่าง พรบ.สุราก้าวหน้า (วาระที่ 1)',
			result: DefaultVotingResult.Failed
		},
		{
			id: '2',
			name: 'ร่าง พรบ.แรงงานสัมพันธ์',
			result: DefaultVotingResult.Passed
		},
		{
			id: '3',
			name: 'ร่าง พรบ.ภาษีที่ดินและสิ่งปลูกสร้าง (วาระที่ 1)',
			result: DefaultVotingResult.Passed
		},
		{
			id: '4',
			name: 'ร่าง พรบ.ส่งเสริมการพัฒนาเศรษฐกิจดิจิทัล (วาระที่ 2)',
			result: DefaultVotingResult.Failed
		},
		{
			id: '5',
			name: 'ร่าง พรบ.คุ้มครองผู้บริโภค (วาระที่ 3)',
			result: DefaultVotingResult.Passed
		},
		{
			id: '6',
			name: 'ร่าง พรบ.คุ้มครองสิทธิส่วนบุคคล (วาระที่ 2)',
			result: DefaultVotingResult.Failed
		},
		{
			id: '7',
			name: 'ร่าง พรบ.สมรสเท่าเทียม (วาระที่ 3)',
			result: DefaultVotingResult.Failed
		}
	]
};
