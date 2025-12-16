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
			name: 'ร่าง พ.ร.บ.สุราก้าวหน้า',
			status: 'REJECTED'
		},
		{
			id: '2',
			name: 'ร่าง พ.ร.บ.งบประมาณรายจ่ายประจําปี 2566',
			status: 'MERGED'
		},
		{
			id: '3',
			name: 'ร่าง พ.ร.บ.สมรสเท่าเทียม',
			status: 'MERGED'
		},
		{
			id: '4',
			name: 'ร่าง พ.ร.บ.แก้กฎหมายค้ามนุษย์',
			status: 'ENACTED'
		},
		{
			id: '5',
			name: 'ร่าง พ.ร.บ.ควบคุมการครอบครองอาวุธปืน',
			status: 'REJECTED'
		},
		{
			id: '6',
			name: 'ร่าง พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล',
			status: 'MERGED'
		},
		{
			id: '7',
			name: 'ร่าง พ.ร.บ.คุ้มครองสิทธิผู้บริโภค',
			status: 'ENACTED'
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
			name: 'ร่าง พ.ร.บ.สุราก้าวหน้า (วาระที่ 1)',
			result: DefaultVotingResult.Failed
		},
		{
			id: '2',
			name: 'ร่าง พ.ร.บ.แรงงานสัมพันธ์',
			result: DefaultVotingResult.Passed
		},
		{
			id: '3',
			name: 'ร่าง พ.ร.บ.ภาษีที่ดินและสิ่งปลูกสร้าง (วาระที่ 1)',
			result: DefaultVotingResult.Passed
		},
		{
			id: '4',
			name: 'ร่าง พ.ร.บ.ส่งเสริมการพัฒนาเศรษฐกิจดิจิทัล (วาระที่ 2)',
			result: DefaultVotingResult.Failed
		},
		{
			id: '5',
			name: 'ร่าง พ.ร.บ.คุ้มครองผู้บริโภค (วาระที่ 3)',
			result: DefaultVotingResult.Passed
		},
		{
			id: '6',
			name: 'ร่าง พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล (วาระที่ 2)',
			result: DefaultVotingResult.Failed
		},
		{
			id: '7',
			name: 'ร่าง พ.ร.บ.สมรสเท่าเทียม (วาระที่ 3)',
			result: DefaultVotingResult.Failed
		}
	]
};
