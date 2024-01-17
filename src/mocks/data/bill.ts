import { BillStatus, type Bill, BillProposerType } from '$models/bill';
import { movingForwardPolitician } from './politician';

export const inProgressBill: Bill = {
	id: 1,
	title: 'ร่าง พรบ.กำหนดระยะเวลาดำเนินงานในกระบวนการยุติธรรม',
	nickname: 'ร่าง พรบ.กำหนดระยะเวลาดำเนินงานในกระบวนการยุติธรรม',
	description:
		'(ยังไม่ใช่ text จริง)ร่างรัฐธรรมนูญแห่งราชอาณาจักรไทย แก้ไขเพิ่มเติม พุทธศักราช .... (แก้ไขเพิ่มเติมหมวด 14 มาตรา 249 มาตรา 250 มาตรา 251 มาตรา 252 มาตรา 253 มาตรา 254 เพิ่มมาตรา 254/1 มาตรา 254/2 มาตรา 254/3 มาตรา 254/4 มาตรา 254/5 และมาตรา 254/6) ร่างรัฐธรรมนูญแห่งราชอาณาจักรไทย แก้ไขเพิ่มเติม พุทธศักราช',
	status: BillStatus.InProgress,
	proposedOn: new Date('2022-07-13'),
	categories: ['สิ่งแวดล้อม', 'ขนส่งมวลชน'],
	proposerType: BillProposerType.Politician,
	proposedLedByPolitician: movingForwardPolitician,
	coProposedByPoliticians: [movingForwardPolitician, movingForwardPolitician],
	attachment: {
		label: 'เอกสารเสนอกฏหมาย',
		url: 'https://www.google.com'
	}
};

export const enactedBill: Bill = {
	id: 2,
	title: 'ร่างพระราชบัญญัติภาษีสรรพสามิต',
	nickname: 'ร่าง พรบ.สุราก้าวหน้า',
	description:
		'(ยังไม่ใช่ text จริง)ร่างรัฐธรรมนูญแห่งราชอาณาจักรไทย แก้ไขเพิ่มเติม พุทธศักราช .... (แก้ไขเพิ่มเติมหมวด 14 มาตรา 249 มาตรา 250 มาตรา 251 มาตรา 252 มาตรา 253 มาตรา 254 เพิ่มมาตรา 254/1 มาตรา 254/2 มาตรา 254/3 มาตรา 254/4 มาตรา 254/5 และมาตรา 254/6) ร่างรัฐธรรมนูญแห่งราชอาณาจักรไทย แก้ไขเพิ่มเติม พุทธศักราช',
	status: BillStatus.Enacted,
	categories: ['สิ่งแวดล้อม', 'ขนส่งมวลชน'],
	proposedOn: new Date('2022-07-13'),
	proposerType: BillProposerType.Politician,
	proposedLedByPolitician: movingForwardPolitician,
	coProposedByPoliticians: [movingForwardPolitician, movingForwardPolitician],
	attachment: {
		label: 'เอกสารเสนอกฏหมาย',
		url: 'https://www.google.com'
	},
	enactedOn: new Date('2023-02-01')
};
