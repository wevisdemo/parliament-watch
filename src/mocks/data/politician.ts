import { AssemblyName } from '$models/assembly';
import type { Politician } from '../../models/politician';
import { movingForwardParty } from './party';

export const movingForwardPolitician: Politician = {
	id: 'พริษฐ์-วัชรสินธุ',
	avatar: 'https://via.placeholder.com/64',
	firstname: 'พริษฐ์',
	lastname: 'วัชรสินธุ',
	isActive: true,
	sex: 'male',
	birthdate: new Date('10/12/1992'),
	educations: [
		'ปริญญาตรี สาขา ปรัชญา การเมือง เศรษฐศาสตร์ (เกียรตินิยมอันดับ 1 เหรียญทอง) - University of Oxford (2011-15)'
	],
	previousOccupations: ['CEO - StartDee', 'Management Consultant - McKinsey & Company'],
	contacts: [],
	assemblyRoles: [
		{
			role: 'สมาชิกแบบบัญชีรายชื่อ',
			assembly: {
				id: 'สภาผู้แทนราษฎร-26',
				name: AssemblyName.Representatives,
				abbreviation: 'สส.',
				term: 26,
				startedAt: new Date('01/01/2023'),
				origin:
					'มาจากการเลือกตั้งทั่วไป พ.ศ. 2566 ประกอบด้วยสมาชิก (สส.) 500 คน ตามระบบจัดสรรปันส่วนผสมโดย 400 คนเป็นผู้แทนเขต และอีก 100 คน มาจากระบบบัญชีรายชื่อ',
				mainRoles: [
					'ประธานสภา',
					'รองประธานสภา คนที่ 1',
					'รองประธานสภา คนที่ 2',
					'ประธานฝ่ายรัฐบาล',
					'ประธานฝ่ายค้าน'
				],
				governmentParties: [],
				oppositionParties: []
			},
			startedAt: new Date('2023-01-01')
		}
	],
	partyRoles: [
		{
			party: movingForwardParty,
			role: 'Policy Campaign Manager',
			startedAt: new Date('01/01/2022')
		}
	]
};
