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
	assetValue: 10000000,
	debtValue: 10000000,
	contacts: [],
	assemblyRoles: [
		{
			role: 'สมาชิกแบบบัญชีรายชื่อ',
			assembly: {
				id: 'สมาชิกสภาผู้แทนราษฎร-26',
				name: AssemblyName.Representatives,
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

// For Release Mocking
// Update: 09 01 2024
export const CHUAN_LEEKPAI: Politician = {
	id: 'ชวน-หลีกภัย',
	prefix: 'นาย',
	firstname: 'ชวน',
	lastname: 'หลีกภัย',
	sex: 'ชาย',
	birthdate: new Date('1938-07-28T00:00:00.000Z'),
	avatar: '/images/politicians/ชวน-หลีกภัย.webp',
	isActive: true,
	educations: ['ปริญญาตรี นิติศาสตรบัณฑิต มหาวิทยาลัยธรรมศาสตร์'],
	previousOccupations: ['สมาชิกสภาผู้แทนราษฎร', 'นายกรัฐมนตรี'],
	partyRoles: [
		{
			role: 'สมาชิก',
			startedAt: new Date('2019-03-24T00:00:00.000Z'),
			party: {
				name: 'ประชาธิปัตย์',
				color: '#00B2FF',
				logo: '/images/parties/ประชาธิปัตย์.webp'
			}
		}
	],
	assemblyRoles: [
		{
			role: 'สมาชิก',
			appointmentMethod: 'บัญชีรายชื่อ',
			listNumber: 2,
			startedAt: new Date('2023-05-24T00:00:00.000Z'),
			assembly: {
				name: AssemblyName.Representatives,
				id: 'สมาชิกสภาผู้แทนราษฎร-26',
				term: 26,
				startedAt: new Date('2023-05-24T00:00:00.000Z'),
				origin:
					'มาจากการเลือกตั้งทั่วไป พ.ศ. 2566 ประกอบด้วยสมาชิก (ส.ส.) 500 คน ตามระบบจัดสรรปันส่วนผสมโดย 400 คนเป็นผู้แทนเขต และอีก 100 คน มาจากระบบบัญชีรายชื่อ',
				abbreviation: 'สส.',
				mainRoles: [
					'ประธานสภาผู้แทนราษฎร',
					'รองประธานสภาผู้แทนราษฎร คนที่ 1',
					'รองประธานสภาผู้แทนราษฎร คนที่ 2',
					'ประธานฝ่ายรัฐบาล',
					'ผู้นำฝ่ายค้าน'
				],
				governmentParties: [],
				oppositionParties: []
			}
		},
		{
			role: 'ประธานสภาผู้แทนราษฎร',
			appointmentMethod: 'บัญชีรายชื่อ',
			listNumber: 2,
			startedAt: new Date('2019-03-24T00:00:00.000Z'),
			endedAt: new Date('2023-03-24T00:00:00.000Z'),
			assembly: {
				name: AssemblyName.Representatives,
				id: 'สมาชิกสภาผู้แทนราษฎร-25',
				term: 25,
				startedAt: new Date('2019-03-24T00:00:00.000Z'),
				endedAt: new Date('2023-03-24T00:00:00.000Z'),
				origin:
					'มาจากการเลือกตั้งทั่วไป พ.ศ. 2562 ประกอบด้วยสมาชิก (ส.ส.) 500 คน 350 คนเป็นผู้แทนเขตเลือกตั้งทั้ง 350 เขตตามระบบจัดสรรปันส่วนผสม ซึ่งลดจำนวนลงตามรัฐธรรมนูญแห่งราชอาณาจักรไทย พุทธศักราช 2560 และอีก 150 คนมาจากระบบบัญชีรายชื่อที่ใช้สูตรที่นั่งปรับระดับ (leveling seat)',
				abbreviation: 'สส.',
				mainRoles: [
					'ประธานสภาผู้แทนราษฎร',
					'รองประธานสภาผู้แทนราษฎร คนที่ 1',
					'รองประธานสภาผู้แทนราษฎร คนที่ 2',
					'ประธานฝ่ายรัฐบาล',
					'ผู้นำฝ่ายค้าน'
				],
				governmentParties: [],
				oppositionParties: []
			}
		}
	],
	contacts: [
		{
			label: 'Facebook',
			url: 'https://www.facebook.com/ChuanLeekpaiOfficial/'
		}
	]
};

export const BANYAT_BANTADTAN: Politician = {
	id: 'บัญญัติ-บรรทัดฐาน',
	prefix: 'นาย',
	firstname: 'บัญญัติ',
	lastname: 'บรรทัดฐาน',
	sex: 'ชาย',
	birthdate: new Date('1942-05-15T00:00:00.000Z'),
	avatar: '/images/politicians/บัญญัติ-บรรทัดฐาน.webp',
	isActive: true,
	educations: ['ปริญญาตรี นิติศาสตรบัณฑิต มหาวิทยาลัยธรรมศาสตร์'],
	previousOccupations: ['สมาชิกสภาผู้แทนราษฎร'],
	partyRoles: [
		{
			role: 'สมาชิก',
			startedAt: new Date('2019-03-24T00:00:00.000Z'),
			party: {
				name: 'ประชาธิปัตย์',
				color: '#00B2FF',
				logo: '/images/parties/ประชาธิปัตย์.webp'
			}
		}
	],
	assemblyRoles: [
		{
			role: 'สมาชิก',
			appointmentMethod: 'บัญชีรายชื่อ',
			listNumber: 3,
			startedAt: new Date('2023-05-24T00:00:00.000Z'),
			assembly: {
				name: AssemblyName.Representatives,
				id: 'สมาชิกสภาผู้แทนราษฎร-26',
				term: 26,
				startedAt: new Date('2023-05-24T00:00:00.000Z'),
				origin:
					'มาจากการเลือกตั้งทั่วไป พ.ศ. 2566 ประกอบด้วยสมาชิก (ส.ส.) 500 คน ตามระบบจัดสรรปันส่วนผสมโดย 400 คนเป็นผู้แทนเขต และอีก 100 คน มาจากระบบบัญชีรายชื่อ',
				abbreviation: 'สส.',
				mainRoles: [
					'ประธานสภาผู้แทนราษฎร',
					'รองประธานสภาผู้แทนราษฎร คนที่ 1',
					'รองประธานสภาผู้แทนราษฎร คนที่ 2',
					'ประธานฝ่ายรัฐบาล',
					'ผู้นำฝ่ายค้าน'
				],
				governmentParties: [],
				oppositionParties: []
			}
		},
		{
			role: 'สมาชิก',
			appointmentMethod: 'บัญชีรายชื่อ',
			listNumber: 3,
			startedAt: new Date('2019-03-24T00:00:00.000Z'),
			endedAt: new Date('2023-03-24T00:00:00.000Z'),
			assembly: {
				name: AssemblyName.Representatives,
				id: 'สมาชิกสภาผู้แทนราษฎร-25',
				term: 25,
				startedAt: new Date('2019-03-24T00:00:00.000Z'),
				endedAt: new Date('2023-03-24T00:00:00.000Z'),
				origin:
					'มาจากการเลือกตั้งทั่วไป พ.ศ. 2562 ประกอบด้วยสมาชิก (ส.ส.) 500 คน 350 คนเป็นผู้แทนเขตเลือกตั้งทั้ง 350 เขตตามระบบจัดสรรปันส่วนผสม ซึ่งลดจำนวนลงตามรัฐธรรมนูญแห่งราชอาณาจักรไทย พุทธศักราช 2560 และอีก 150 คนมาจากระบบบัญชีรายชื่อที่ใช้สูตรที่นั่งปรับระดับ (leveling seat)',
				abbreviation: 'สส.',
				mainRoles: [
					'ประธานสภาผู้แทนราษฎร',
					'รองประธานสภาผู้แทนราษฎร คนที่ 1',
					'รองประธานสภาผู้แทนราษฎร คนที่ 2',
					'ประธานฝ่ายรัฐบาล',
					'ผู้นำฝ่ายค้าน'
				],
				governmentParties: [],
				oppositionParties: []
			}
		}
	],
	contacts: []
};
