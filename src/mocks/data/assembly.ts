import type { Assembly } from '../../models/assembly';

export const rep26: Assembly = {
	id: 'rep-26',
	name: 'สมาชิกสภาผู้แทนราษฎร',
	abbreviation: 'สส.',
	term: 26,
	startedAt: new Date('01/01/2023'),
	origin:
		'มาจากการเลือกตั้งทั่วไป พ.ศ. 2566 ประกอบด้วยสมาชิก (ส.ส.) 500 คน ตามระบบจัดสรรปันส่วนผสมโดย 400 คนเป็นผู้แทนเขต และอีก 100 คน มาจากระบบบัญชีรายชื่อ',
	mainRoles: [
		'ประธานสภา',
		'รองประธานสภา คนที่ 1',
		'รองประธานสภา คนที่ 2',
		'ประธานฝ่ายรัฐบาล',
		'ประธานฝ่ายค้าน'
	]
};

export const gov35: Assembly = {
	id: 'gov-35',
	name: 'คณะรัฐมนตรี',
	abbreviation: 'ครม.',
	term: 35,
	startedAt: new Date('01/01/2023'),
	endedAt: new Date('05/05/2023'),
	origin: 'มาจากซักที่',
	mainRoles: ['นายกรัฐมนตรี', 'รองนายกรัฐมนตรี']
};
