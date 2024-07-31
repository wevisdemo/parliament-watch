import { BillStatus, type Bill, BillProposerType } from '$models/bill';
import { movingForwardPolitician } from './politician';

export const inProgressBill: Bill = {
	id: '1',
	acceptanceNumber: '1',
	title: 'ร่าง พรบ.กำหนดระยะเวลาดำเนินงานในกระบวนการยุติธรรม',
	nickname: 'ร่าง พรบ.กำหนดระยะเวลาดำเนินงานในกระบวนการยุติธรรม',
	description:
		'(ยังไม่ใช่ text จริง)ร่างรัฐธรรมนูญแห่งราชอาณาจักรไทย แก้ไขเพิ่มเติม พุทธศักราช .... (แก้ไขเพิ่มเติมหมวด 14 มาตรา 249 มาตรา 250 มาตรา 251 มาตรา 252 มาตรา 253 มาตรา 254 เพิ่มมาตรา 254/1 มาตรา 254/2 มาตรา 254/3 มาตรา 254/4 มาตรา 254/5 และมาตรา 254/6) ร่างรัฐธรรมนูญแห่งราชอาณาจักรไทย แก้ไขเพิ่มเติม พุทธศักราช',
	status: BillStatus.InProgress,
	proposedOn: new Date('2023-07-13'),
	categories: ['สิ่งแวดล้อม', 'ขนส่งมวลชน'],
	proposerType: BillProposerType.Politician,
	proposedLedByPolitician: movingForwardPolitician,
	coProposedByPoliticians: [movingForwardPolitician.firstname, movingForwardPolitician.firstname],
	proposedByAssembly: null,
	proposedByPeople: null,
	attachment: {
		label: 'เอกสารเสนอกฎหมาย',
		url: 'https://www.google.com'
	},
	lisUrl: ''
};

export const enactedBill: Bill = {
	id: '2',
	acceptanceNumber: '2',
	title: 'ร่างพระราชบัญญัติภาษีสรรพสามิต',
	nickname: 'ร่าง พรบ.สุราก้าวหน้า',
	description:
		'(ยังไม่ใช่ text จริง)ร่างรัฐธรรมนูญแห่งราชอาณาจักรไทย แก้ไขเพิ่มเติม พุทธศักราช .... (แก้ไขเพิ่มเติมหมวด 14 มาตรา 249 มาตรา 250 มาตรา 251 มาตรา 252 มาตรา 253 มาตรา 254 เพิ่มมาตรา 254/1 มาตรา 254/2 มาตรา 254/3 มาตรา 254/4 มาตรา 254/5 และมาตรา 254/6) ร่างรัฐธรรมนูญแห่งราชอาณาจักรไทย แก้ไขเพิ่มเติม พุทธศักราช',
	status: BillStatus.Enacted,
	categories: ['สิ่งแวดล้อม', 'ขนส่งมวลชน'],
	proposedOn: new Date('2022-07-13'),
	proposerType: BillProposerType.Politician,
	proposedLedByPolitician: movingForwardPolitician,
	coProposedByPoliticians: [movingForwardPolitician.firstname, movingForwardPolitician.firstname],
	proposedByAssembly: null,
	proposedByPeople: null,
	attachment: {
		label: 'เอกสารเสนอกฎหมาย',
		url: 'https://www.google.com'
	},
	lisUrl: ''
};

export const promiseRelatedBill: Bill = {
	id: '3',
	acceptanceNumber: '3',
	title: 'ร่างพระราชบัญญัติส่งเสริมการเลี้ยงโค',
	nickname: 'ร่าง พรบ.ส่งเสริมการเลี้ยงโค',
	description: '',
	status: BillStatus.InProgress,
	categories: ['เศรษฐกิจ'],
	proposedOn: new Date('2023-10-04'),
	proposerType: BillProposerType.Politician,
	proposedLedByPolitician: movingForwardPolitician,
	coProposedByPoliticians: [movingForwardPolitician.firstname, movingForwardPolitician.firstname],
	proposedByAssembly: null,
	proposedByPeople: null,
	attachment: {
		label: 'เอกสารเสนอกฎหมาย',
		url: 'https://www.google.com'
	},
	lisUrl: ''
};

export const promiseFulfilledBill: Bill = {
	id: '4',
	acceptanceNumber: '4',
	title: 'ร่างพระราชบัญญัติแก้ไขเพิ่มเติมประมวลกฎหมายแพ่งและพาณิชย์',
	nickname: 'ร่าง พรบ.สมรสเท่าเทียม',
	description: '',
	status: BillStatus.Enacted,
	categories: ['สังคม'],
	proposedOn: new Date('2023-10-04'),
	proposerType: BillProposerType.Politician,
	proposedLedByPolitician: movingForwardPolitician,
	coProposedByPoliticians: [movingForwardPolitician.firstname, movingForwardPolitician.firstname],
	proposedByAssembly: null,
	proposedByPeople: null,
	attachment: {
		label: 'เอกสารเสนอกฎหมาย',
		url: 'https://www.google.com'
	},
	lisUrl: ''
};
