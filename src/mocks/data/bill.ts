import { enumBillStatus } from '$lib/politigraph/genql';
import { BillProposerType } from '$models/bill';
import { movingForwardPolitician } from './politician';

export const inProgressBill = {
	id: '1',
	acceptanceNumber: '1',
	title: 'ร่าง พ.ร.บ.กำหนดระยะเวลาดำเนินงานในกระบวนการยุติธรรม',
	nickname: 'ร่าง พ.ร.บ.กำหนดระยะเวลาดำเนินงานในกระบวนการยุติธรรม',
	description:
		'(ยังไม่ใช่ text จริง)ร่างรัฐธรรมนูญแห่งราชอาณาจักรไทย แก้ไขเพิ่มเติม พุทธศักราช .... (แก้ไขเพิ่มเติมหมวด 14 มาตรา 249 มาตรา 250 มาตรา 251 มาตรา 252 มาตรา 253 มาตรา 254 เพิ่มมาตรา 254/1 มาตรา 254/2 มาตรา 254/3 มาตรา 254/4 มาตรา 254/5 และมาตรา 254/6) ร่างรัฐธรรมนูญแห่งราชอาณาจักรไทย แก้ไขเพิ่มเติม พุทธศักราช',
	status: enumBillStatus.IN_PROGRESS,
	proposedOn: new Date('2023-07-13'),
	categories: ['สิ่งแวดล้อม', 'ขนส่งมวลชน'],
	proposerType: BillProposerType.Politician,
	proposedLedByPolitician: movingForwardPolitician,
	coProposedByPoliticians: [movingForwardPolitician.firstname, movingForwardPolitician.firstname],
	attachment: {
		label: 'เอกสารเสนอกฎหมาย',
		url: 'https://www.google.com'
	},
	lisUrl: ''
};

export const enactedBill = {
	id: '2',
	acceptanceNumber: '2',
	title: 'ร่างพระราชบัญญัติภาษีสรรพสามิต',
	nickname: 'ร่าง พ.ร.บ.สุราก้าวหน้า',
	description:
		'(ยังไม่ใช่ text จริง)ร่างรัฐธรรมนูญแห่งราชอาณาจักรไทย แก้ไขเพิ่มเติม พุทธศักราช .... (แก้ไขเพิ่มเติมหมวด 14 มาตรา 249 มาตรา 250 มาตรา 251 มาตรา 252 มาตรา 253 มาตรา 254 เพิ่มมาตรา 254/1 มาตรา 254/2 มาตรา 254/3 มาตรา 254/4 มาตรา 254/5 และมาตรา 254/6) ร่างรัฐธรรมนูญแห่งราชอาณาจักรไทย แก้ไขเพิ่มเติม พุทธศักราช',
	status: enumBillStatus.ENACTED,
	categories: ['สิ่งแวดล้อม', 'ขนส่งมวลชน'],
	proposedOn: new Date('2022-07-13'),
	enactedOn: new Date('2023-07-13'),
	proposerType: BillProposerType.Politician,
	proposedLedByPolitician: movingForwardPolitician,
	coProposedByPoliticians: [movingForwardPolitician.firstname, movingForwardPolitician.firstname],
	attachment: {
		label: 'เอกสารเสนอกฎหมาย',
		url: 'https://www.google.com'
	},
	lisUrl: ''
};

export const promiseRelatedBill = {
	id: '3',
	acceptanceNumber: '3',
	title: 'ร่างพระราชบัญญัติส่งเสริมการเลี้ยงโค',
	nickname: 'ร่าง พรบ.ส่งเสริมการเลี้ยงโค',
	description: '',
	status: enumBillStatus.IN_PROGRESS,
	categories: ['เศรษฐกิจ'],
	proposedOn: new Date('2023-10-04'),
	proposerType: BillProposerType.Politician,
	proposedLedByPolitician: movingForwardPolitician,
	coProposedByPoliticians: [movingForwardPolitician.firstname, movingForwardPolitician.firstname],
	attachment: {
		label: 'เอกสารเสนอกฎหมาย',
		url: 'https://www.google.com'
	},
	lisUrl: ''
};

export const promiseFulfilledBill = {
	id: '4',
	acceptanceNumber: '4',
	title: 'ร่างพระราชบัญญัติแก้ไขเพิ่มเติมประมวลกฎหมายแพ่งและพาณิชย์',
	nickname: 'ร่าง พรบ.สมรสเท่าเทียม',
	description: '',
	status: enumBillStatus.ENACTED,
	categories: ['สังคม'],
	proposedOn: new Date('2023-10-04'),
	enactedOn: new Date('2024-04-30'),
	proposerType: BillProposerType.Politician,
	proposedLedByPolitician: movingForwardPolitician,
	coProposedByPoliticians: [movingForwardPolitician.firstname, movingForwardPolitician.firstname],
	attachment: {
		label: 'เอกสารเสนอกฎหมาย',
		url: 'https://www.google.com'
	},
	lisUrl: ''
};
