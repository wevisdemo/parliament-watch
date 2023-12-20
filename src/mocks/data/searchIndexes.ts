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
			name: 'ร่าง พ.ร.บ.สุราก้าวหน้า',
			status: BillStatus.Rejected
		},
		{
			name: 'ร่าง พ.ร.บ. งบประมาณรายจ่ายประจําปี 2566',
			status: BillStatus.InProgress
		},
		{
			name: 'ร่าง พ.ร.บ. สมรสเท่าเทียม',
			status: BillStatus.InProgress
		},
		{
			name: 'ร่าง พ.ร.บ. แก้กฎหมายค้ามนุษย์',
			status: BillStatus.Enacted
		},
		{
			name: 'ร่าง พ.ร.บ. ควบคุมการครอบครองอาวุธปืน',
			status: BillStatus.Rejected
		},
		{
			name: 'ร่าง พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล',
			status: BillStatus.InProgress
		},
		{
			name: 'ร่าง พ.ร.บ. คุ้มครองสิทธิผู้บริโภค',
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
			name: 'ร่าง พ.ร.บ. สุราก้าวหน้า (วาระที่ 1)',
			result: DefaultVotingResult.Failed
		},
		{
			name: 'ร่าง พ.ร.บ. แรงงานสัมพันธ์',
			result: DefaultVotingResult.Passed
		},
		{
			name: 'ร่าง พ.ร.บ. ภาษีที่ดินและสิ่งปลูกสร้าง (วาระที่ 1)',
			result: DefaultVotingResult.Passed
		},
		{
			name: 'ร่าง พ.ร.บ. ส่งเสริมการพัฒนาเศรษฐกิจดิจิทัล (วาระที่ 2)',
			result: DefaultVotingResult.Failed
		},
		{
			name: 'ร่าง พ.ร.บ. คุ้มครองผู้บริโภค (วาระที่ 3)',
			result: DefaultVotingResult.Passed
		},
		{
			name: 'ร่าง พ.ร.บ. คุ้มครองสิทธิส่วนบุคคล (วาระที่ 2)',
			result: DefaultVotingResult.Failed
		},
		{
			name: 'ร่าง พ.ร.บ. สมรสเท่าเทียม (วาระที่ 3)',
			result: DefaultVotingResult.Failed
		}
	]
};
