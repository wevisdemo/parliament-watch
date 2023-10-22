import { BillStatus, type Bill } from '$models/bill';
import { movingForwardPolitician } from './politician';

export const inProgressBill: Bill = {
	id: 1,
	title: 'ร่าง พ.ร.บ. กำหนดระยะเวลาดำเนินงานในกระบวนการยุติธรรม',
	nickname: 'ร่าง พ.ร.บ. กำหนดระยะเวลาดำเนินงานในกระบวนการยุติธรรม',
	description:
		'(ยังไม่ใช่ text จริง)ร่างรัฐธรรมนูญแห่งราชอาณาจักรไทย แก้ไขเพิ่มเติม พุทธศักราช .... (แก้ไขเพิ่มเติมหมวด 14 มาตรา 249 มาตรา 250 มาตรา 251 มาตรา 252 มาตรา 253 มาตรา 254 เพิ่มมาตรา 254/1 มาตรา 254/2 มาตรา 254/3 มาตรา 254/4 มาตรา 254/5 และมาตรา 254/6) ร่างรัฐธรรมนูญแห่งราชอาณาจักรไทย แก้ไขเพิ่มเติม พุทธศักราช',
	status: BillStatus.InProgress,
	proposedOn: new Date('2022-07-13'),
	proposedBy: [movingForwardPolitician]
};
