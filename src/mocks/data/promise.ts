import { PromiseStatus, type Promise } from '../../models/promise';
import { promiseFulfilledBill, promiseRelatedBill } from './bill';
import { passingMp1Event, passingSenate3Event } from './event';
import { pheuThaiParty } from './party';

export const inProgressPromise: Promise = {
	id: '1',
	party: pheuThaiParty,
	statements: [
		'ส่งเสริมการเลี้ยงโค จากปริมาณความต้องการจาก ต่างประเทศในแถบเอเชียตะวันออกปีละกว่า 1 ล้านตัว และประเทศในแถบตะวันออกกลางปีละประมาณ 3 ล้านตัว และมีแนวโน้มที่เพิ่มสูงขึ้นอย่างต่อเนื่องทุกปี รวมทั้งปศุสัตว์ อื่นได้แก่ แพะ แกะ ไก่งวง ฯลฯ และประมงน้ำจืดด้วย ซึ่งย่อมสร้างรายได้ต่อเนื่องไปยังเกษตรกรผู้ปลูกพืชอาหารสัตว์ เป็นวงกว้าง'
	],
	coverImageUrl: '',
	keywords: ['Soft Power', 'แรงงาน', 'THACCA'],
	categories: ['เศรษฐกิจ'],
	status: PromiseStatus.inProgress,
	references: [
		{
			label: 'นโยบายเกษตร - พรรคเพื่อไทย',
			url: 'https://ptp.or.th/%E0%B8%99%E0%B9%82%E0%B8%A2%E0%B8%9A%E0%B8%B2%E0%B8%A2%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%9E%E0%B8%A3%E0%B8%A3%E0%B8%84%E0%B9%80%E0%B8%9E%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B9%84%E0%B8%97%E0%B8%A2/agricultural-policy',
			description: 'เว็บไซตปัจจุบัน'
		},
		{
			label: 'นโยบายเกษตร - พรรคเพื่อไทย (เมื่อวันที่ 1 มีนาคม 2567 )',
			url: 'https://ptp.or.th/%E0%B8%99%E0%B9%82%E0%B8%A2%E0%B8%9A%E0%B8%B2%E0%B8%A2%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%9E%E0%B8%A3%E0%B8%A3%E0%B8%84%E0%B9%80%E0%B8%9E%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B9%84%E0%B8%97%E0%B8%A2/agricultural-policy',
			description: 'บน Wayback Machine โดย Archive.org'
		},
		{
			label: 'นโยบายเกษตร - พรรคเพื่อไทย (ภาพบันทึกหน้าจอ เมื่อวันที่  1 พฤษภาคม)',
			url: 'https://ptp.or.th/%E0%B8%99%E0%B9%82%E0%B8%A2%E0%B8%9A%E0%B8%B2%E0%B8%A2%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%9E%E0%B8%A3%E0%B8%A3%E0%B8%84%E0%B9%80%E0%B8%9E%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B9%84%E0%B8%97%E0%B8%A2/agricultural-policy',
			description: 'บันทึกโดยทีมงาน WeVis'
		},
		{
			label: 'แผ่นพับหาเสียงพรรคเพื่อไทย.pdf',
			url: 'https://ptp.or.th/%E0%B8%99%E0%B9%82%E0%B8%A2%E0%B8%9A%E0%B8%B2%E0%B8%A2%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%9E%E0%B8%A3%E0%B8%A3%E0%B8%84%E0%B9%80%E0%B8%9E%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B9%84%E0%B8%97%E0%B8%A2/agricultural-policy',
			description: 'เอกสารโดยพรรคเพื่อไทย'
		}
	],
	progresses: [
		{
			id: '1-1',
			type: 'indirect',
			date: new Date('2023-08-12'),
			title: 'จัดตั้งรัฐบาลสำเร็จ',
			reference: {
				label: 'springnews.co.th',
				url: 'https://springnews.co.th',
				description: 'เว็บไซต์ปัจจุบัน'
			}
		},
		{
			id: '1-2',
			type: 'checkpoint',
			date: new Date('2023-09-11'),
			title: 'แถลงนโยบายต่อรัฐสภา',
			description:
				'พบข้อความที่เกี่ยวข้องในคำแถลงนโยบายของคณะรัฐมนตรี ดังนี้ "...การบริหารจัดการภาคการเกษตรที่ครบถ้วนทุกด้านตั้งแต่ดิน น้ำ พันธุ์พืช พันธุ์สัตว์ กลไกราคา แหล่งเงินทุน นวัตกรรม และกรรมสิทธิ์ที่ดินของเกษตรกรผู้ปลูกพืชผู้เลี้ยงปศุสัตว์ และกลุ่มประมง มีเป้าหมายให้รายได้ของเกษตรกรทั้งประเทศเพิ่มขึ้นอย่างมีนัยสำคัญภายในระยะเวลา ๔ ปี..."',
			reference: {
				label: 'คำแถลงนโยบายของคณะรัฐมนตรี.pdf',
				url: 'https://www.soc.go.th/wp-content/uploads/2023/09/history_66.pdf',
				description: 'เอกสารจากคณะรัฐมนตรี'
			}
		},
		{
			id: '1-3',
			type: 'checkpoint',
			date: new Date('2023-09-11'),
			title: 'ประชุมคณะทำงานพัฒนาการเกษตร',
			description:
				'‘ภูมิธรรม’ หารือ รมว.กระทรวงการพัฒนาผู้ประกอบการและการสหกรณ์มาเลเซีย เร่งผลักดันความร่วมมือ เพื่อส่งเสริมสนับสนุนแฟรนไชส์ทั้งสองประเทศ โดยสนับสนุนองค์ความรู้ด้านการทำธุรกิจ พร้อมจัดส่งผู้เชี่ยวชาญร่วมทำ Workshop และ Business Matching ระหว่างกัน เพื่อกระชับความสัมพันธ์ทางการค้า และดันมูลค่าการค้าไทย-มาเลเซียให้เติบโต',
			reference: {
				label:
					'‘ภูมิธรรม’ หารือรัฐมนตรีมาเลเซีย เดินหน้าร่วมมือ ผลักดันธุรกิจแฟรนไชส์ ดันมูลค่าการค้าไทย-มาเลเซียให้...',
				url: 'https://www.moc.go.th/th/gallery/category/detail/id/5/iid/500',
				description: 'เว็บไซต์กระทรวงการเกษตร'
			}
		},
		{
			id: '1-4',
			type: 'checkpoint',
			date: new Date('2023-12-25'),
			title: 'เอกสารส.ค.ส.ของพรรค',
			evidence: {
				type: 'document',
				url: 'https://google.com'
			}
		},
		{
			id: '1-5',
			type: 'checkpoint',
			date: new Date('2024-01-22'),
			title: 'ป้ายแสดงคำสัญญาในงานสัมมนาของพรรค',
			evidence: {
				type: 'image',
				url: 'https://picsum.photos/400'
			}
		},
		{
			id: '1-6',
			type: 'indirect',
			date: new Date('2024-04-28'),
			title: 'ปรับคณะรัฐมนตรีใหม่',
			reference: {
				label: 'springnews.co.th',
				url: 'https://springnews.co.th',
				description: 'เว็บไซต์ปัจจุบัน'
			}
		},
		{
			id: '1-7',
			type: 'checkpoint',
			date: new Date('2024-05-27'),
			title: 'ร่าง พ.ร.บ. ส่งเสริมการเลี้ยงโค ผ่าน วาระ 1',
			bill: promiseRelatedBill,
			billEvent: {
				...passingMp1Event,
				billId: '3',
				date: new Date('2024-05-27')
			}
		}
	]
};

export const notStartedPromise: Promise = {
	id: '2',
	party: pheuThaiParty,
	statements: ['ไทยจะเป็น Blockchain Hub และ Fintech Center ของอาเซียน '],
	coverImageUrl:
		'https://ptp.or.th/wp-content/uploads/2023/03/14-%E0%B9%80%E0%B8%97%E0%B8%84%E0%B9%82%E0%B8%99%E0%B9%82%E0%B8%A5%E0%B8%A2%E0%B8%B5-1024x681.jpg',
	keywords: ['Blockchain', 'Fintech', 'อาเซียน'],
	categories: ['เทคโนโลยี', 'เศรษฐกิจ'],
	status: PromiseStatus.notStarted,
	progresses: [
		{
			id: '2-1',
			type: 'indirect',
			date: new Date('2023-08-12'),
			title: 'จัดตั้งรัฐบาลสำเร็จ',
			reference: {
				label: 'springnews.co.th',
				url: 'https://springnews.co.th',
				description: 'เว็บไซต์ปัจจุบัน'
			}
		},
		{
			id: '2-2',
			type: 'indirect',
			date: new Date('2024-04-28'),
			title: 'ปรับคณะรัฐมนตรีใหม่',
			reference: {
				label: 'springnews.co.th',
				url: 'https://springnews.co.th',
				description: 'เว็บไซต์ปัจจุบัน'
			}
		}
	],
	references: [
		{
			label: 'นโยบายเทคโนโลยีและนวัตกรรม - พรรคเพื่อไทย',
			url: 'https://ptp.or.th/%e0%b8%99%e0%b9%82%e0%b8%a2%e0%b8%9a%e0%b8%b2%e0%b8%a2%e0%b8%ab%e0%b8%a5%e0%b8%b1%e0%b8%81%e0%b8%9e%e0%b8%a3%e0%b8%a3%e0%b8%84%e0%b9%80%e0%b8%9e%e0%b8%b7%e0%b9%88%e0%b8%ad%e0%b9%84%e0%b8%97%e0%b8%a2/technology-policy-2',
			description: 'เว็บไซตปัจจุบัน'
		}
	]
};

export const fulfilledPromise: Promise = {
	id: '3',
	party: pheuThaiParty,
	statements: [
		'แก้กฎหมายให้ทุกคนได้เข้าถึงสิทธิทางกฎหมายและสวัสดิการรัฐอย่างเท่าเทียม ไม่มีใครต้องถูกกีดกันจากเงื่อนไขทางเพศสภาพและเพศวิถี เช่น สิทธิประกันสังคม สวัสดิการข้าราชการ สิทธิลดหย่อนภาษี สิทธิในการหมั้น การอุ้มบุญ การขอสัญชาติ'
	],
	coverImageUrl:
		'https://ptp.or.th/wp-content/uploads/2023/03/17-%E0%B8%99%E0%B9%82%E0%B8%A2%E0%B8%9A%E0%B8%B2%E0%B8%A2%E0%B8%AA%E0%B8%B4%E0%B8%97%E0%B8%98%E0%B8%B4%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1%E0%B8%AB%E0%B8%A5%E0%B8%B2%E0%B8%81%E0%B8%AB%E0%B8%A5%E0%B8%B2%E0%B8%A2%E0%B8%97%E0%B8%B2%E0%B8%87%E0%B9%80%E0%B8%9E%E0%B8%A8.jpg',
	keywords: ['ความเท่าเทียม', 'LGBTQ+'],
	categories: ['สังคม', 'สิทธิและเสรีภาพ'],
	status: PromiseStatus.fulfilled,
	progresses: [
		{
			id: '3-1',
			type: 'indirect',
			date: new Date('2023-08-12'),
			title: 'จัดตั้งรัฐบาลสำเร็จ',
			reference: {
				label: 'springnews.co.th',
				url: 'https://springnews.co.th',
				description: 'เว็บไซต์ปัจจุบัน'
			}
		},
		{
			id: '3-2',
			type: 'indirect',
			date: new Date('2024-04-28'),
			title: 'ปรับคณะรัฐมนตรีใหม่',
			reference: {
				label: 'springnews.co.th',
				url: 'https://springnews.co.th',
				description: 'เว็บไซต์ปัจจุบัน'
			}
		},
		{
			id: '3-3',
			type: 'checkpoint',
			date: new Date('2024-06-18'),
			title: 'ร่าง พ.ร.บ. กฎหมายสมรสเท่าเทียม ผ่าน วาระ 3',
			bill: promiseFulfilledBill,
			billEvent: {
				...passingSenate3Event,
				billId: '4',
				date: new Date('2024-06-18')
			}
		}
	],
	references: [
		{
			label: 'นโยบายสิทธิมนุษยชนและความหลากหลายทางเพศ - พรรคเพื่อไทย',
			url: 'https://ptp.or.th/lgbtq',
			description: 'เว็บไซตปัจจุบัน'
		}
	]
};

export const unhonoredPromise: Promise = {
	id: '4',
	party: pheuThaiParty,
	statements: [
		'ปฏิรูปกองทัพเป็นทหารมืออาชีพ ป้องกันการก้าวก่ายแทรกแซงทางการเมืองและการบริหารราชการแผ่นดิน ให้มีความเป็นทหารอาชีพ และแก้ไขกฎหมายยกเลิกการเกณฑ์ทหาร ให้เข้ารับราชการทหารโดยสมัครใจ'
	],
	coverImageUrl:
		'https://ptp.or.th/wp-content/uploads/2023/03/%E0%B9%81%E0%B8%81%E0%B9%89%E0%B8%A3%E0%B8%B1%E0%B8%90%E0%B8%98%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B8%99%E0%B8%B9%E0%B8%8D-01-1536x1025.jpg',
	keywords: ['กองทัพ', 'ทหาร'],
	categories: ['ปกครอง', 'ประชาธิปไตย'],
	status: PromiseStatus.unhonored,
	progresses: [
		{
			id: '3-1',
			type: 'indirect',
			date: new Date('2023-08-12'),
			title: 'จัดตั้งรัฐบาลสำเร็จ',
			reference: {
				label: 'springnews.co.th',
				url: 'https://springnews.co.th',
				description: 'เว็บไซต์ปัจจุบัน'
			}
		},
		{
			id: '3-2',
			type: 'indirect',
			date: new Date('2024-04-28'),
			title: 'ปรับคณะรัฐมนตรีใหม่',
			reference: {
				label: 'springnews.co.th',
				url: 'https://springnews.co.th',
				description: 'เว็บไซต์ปัจจุบัน'
			}
		}
	],
	references: [
		{
			label: 'นโยบายแก้รัฐธรรมนูญ - พรรคเพื่อไทย',
			url: 'https://ptp.or.th/%E0%B8%99%E0%B9%82%E0%B8%A2%E0%B8%9A%E0%B8%B2%E0%B8%A2%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%9E%E0%B8%A3%E0%B8%A3%E0%B8%84%E0%B9%80%E0%B8%9E%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B9%84%E0%B8%97%E0%B8%A2/political-policy',
			description: 'เว็บไซตปัจจุบัน'
		}
	]
};
