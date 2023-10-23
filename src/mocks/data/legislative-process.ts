import type { proposingALaw } from '$models/legislative-process';

export const mockProposingALawTable: proposingALaw[] = [
	{
		id: 'ครม.',
		name: 'ครม.',
		col1: 'มีสิทธิเสนอร่าง',
		col2: 'มีสิทธิเสนอร่าง',
		col3: 'มีสิทธิเสนอร่าง',
		col4: 'มีสิทธิเสนอร่าง'
	},
	{
		id: 'สส.',
		name: 'สส.',
		col1: '20 คน',
		col2: '-',
		col3: 'สส. ไม่น้อยกว่า 1 ใน 10',
		col4: 'สส. ไม่น้อยกว่า 1 ใน 5'
	},
	{
		id: 'สมาชิกรัฐสภา',
		name: 'สมาชิกรัฐสภา',
		col1: '-',
		col2: '-',
		col3: '-',
		col4: 'สส. และ สว. ไม่น้อยกว่า 1 ใน 5'
	},
	{
		id: 'ประชาชนผู้มีสิทธิเลือกตั้ง',
		name: 'ประชาชนผู้มีสิทธิเลือกตั้ง',
		col1: '10,000 คน',
		col2: '-',
		col3: '-',
		col4: '50,000 คน'
	}
];
