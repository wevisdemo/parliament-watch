import { createSeo } from '$lib/seo';

export interface DutySection {
	heading: string;
	details: string[];
}

export type Legislation = {
	title: string;
	details: string;
	presentedBy: string[];
	consideredBy: string | [string, string];
	endorsedBy: string;
	stepDescription?: string;
	steps: string[];
	examples: { link: string; description: string }[];
};

export function load() {
	const representatives: DutySection[] = [
		{
			heading: 'เสนอร่างกฎหมาย',
			details: [
				'สส.จำนวน 20 คน สามารถเสนอร่าง พ.ร.บ.',
				'สส.จำนวน 1 ใน 5 เสนอแก้ไขรัฐธรรมนูญ',
				'สส.จำนวน 1 ใน 10 สามารถเสนอร่าง พ.ร.ป.'
			]
		},
		{
			heading: 'พิจารณาร่างกฎหมาย (พ.ร.บ.)',
			details: [
				'ลงมติรับร่างกฎหมายเข้าสภา',
				'พิจารณาร่างกฎหมายเป็นรายมาตราในชั้นกรรมาธิการ',
				'ลงมติเห็นชอบหรือไม่เห็นชอบร่างกฎหมาย',
				'ยืนยันออกร่าง พ.ร.บ.ที่ สว.ไม่อนุมัติ'
			]
		},
		{
			heading: 'อนุมัติ พ.ร.ก.หรือกฎหมายฉุกเฉินที่ออกโดย ครม.ให้เป็นกฎหมาย',
			details: [
				'ลงมติเห็นชอบหรือไม่เห็นชอบ พ.ร.ก.',
				'เสนอต่อประธานสภาฯ เพื่อให้ประธานสภาฯ ส่งเรื่องไปให้ศาลรัฐธรรมนูญวินิจฉัย และให้ชะลอ พ.ร.ก.ไว้ก่อน',
				'อนุมัติ พ.ร.ก.หรือกฎหมายฉุกเฉินที่ออกโดย ครม.ให้เป็นกฎหมาย'
			]
		},
		{
			heading: 'ดำเนินกิจการสภา',
			details: [
				'ศึกษาและพิจารณาข้อกฎหมายในคณะกรรมาธิการสามัญประจำสภา',
				'พิจารณาศึกษาและสอบสวนกรณีต่างๆ เมื่อมีการตั้งคณะกรรมาธิการวิสามัญเป็นการเฉพาะ',
				'เลือก สส.เป็นกรรมาธิการคณะกรรมาธิการสามัญ',
				'เลือก สส.หรือผู้ที่ไม่ได้เป็น สส.ตั้งเป็นคณะกรรมาธิการวิสามัญ เพื่อศึกษาเรื่องใดๆ และรายงานให้สภาทราบตามระยะเวลาที่สภากําหนด'
			]
		},
		{
			heading: 'ลงมติเลือกนายกรัฐมนตรี',
			details: ['เสนอชื่อผู้ที่สมควรดำรงตำแหน่งเป็นนายกฯ', 'ลงมติเลือกนายกฯ']
		}
	];

	const senates: DutySection[] = [
		{
			heading: 'พิจารณาร่างกฎหมาย (พ.ร.บ.)',
			details: [
				'กลั่นกรองและให้ความเห็นร่างกฎหมายที่ สส.เห็นชอบ',
				'ยับยั้งร่างกฎหมายเพื่อส่งให้ สส.พิจารณาอีกครั้ง'
			]
		},
		{
			heading: 'อนุมัติ พ.ร.ก.หรือกฎหมายฉุกเฉินที่ออกโดย ครม.ให้เป็นกฎหมาย',
			details: [
				'ลงมติเห็นชอบหรือไม่เห็นชอบ พ.ร.ก.',
				'เสนอต่อประธานสภาฯ เพื่อให้ประธานสภาฯ ส่งเรื่องไปให้ศาลรัฐธรรมนูญวินิจฉัย และให้ชะลอ พ.ร.ก.ไว้ก่อน'
			]
		},
		{
			heading: 'ควบคุมการบริหารราชการแผ่นดิน',
			details: [
				'ตั้งกระทู้ถามรัฐมนตรีเกี่ยวกับงานในหน้าที่ในรูปแบบเป็นหนังสือหรือด้วยวาจา และสามารถตั้งกระทู้ถามด้วยวาจาโดยไม่ต้องแจ้งล่วงหน้า',
				'ตรวจสอบและเร่งรัดให้รัฐบาลดำเนินงานตามแผนยุทธศาสตร์ชาติ',
				'ยื่นให้ศาลรัฐธรรมนูญวินิจฉัยชี้ขาดกรณีรัฐบาลไม่ดำเนินงานตามยุทธศาสตร์ชาติ'
			]
		},
		{
			heading: 'ดำเนินกิจการสภา',
			details: [
				'เลือก สว.เป็นกรรมาธิการคณะกรรมาธิการสามัญ',
				'เลือก สว.หรือผู้ที่ไม่ได้เป็น สว.ตั้งเป็นคณะกรรมาธิการวิสามัญ เพื่อศึกษาเรื่องใดๆ และรายงานให้สภาทราบตามระยะเวลาที่สภากําหนด'
			]
		},
		{
			heading: 'แต่งตั้งผู้ดำรงตำแหน่งในองค์กรตามรัฐธรรมนูญ',
			details: [
				'ลงมติเห็นชอบผู้ที่ดำรงตำแหน่งตุลาการศาลรัฐธรรมนูญ',
				'พิจารณาแต่งตั้งบุคคลในองค์กรอิสระ ได้แก่ ป.ป.ช., ก.ก.ต., ผู้ตรวจการแผ่นดิน, คณะกรรมการตรวจเงินแผ่นดิน'
			]
		}
	];

	const both: DutySection[] = [
		{
			heading: 'ด้านนิติบัญญัติ (การตรากฎหมาย)',
			details: [
				'พิจารณาร่างพระราชบัญญัติประกอบรัฐธรรมนูญ (พ.ร.ป.)',
				'ปรึกษาร่าง พ.ร.ป.หรือร่าง พ.ร.บ.ใหม่',
				'พิจารณาให้ความเห็นชอบตามที่ ครม.ร้องขอ',
				'ตราข้อบังคับการประชุมรัฐสภา',
				'แก้ไขเพิ่มเติมรัฐธรรมนูญ'
			]
		},
		{
			heading: 'ด้านการบริหารราชการแผ่นดิน',
			details: [
				'ประชุมร่วมกันของรัฐสภา',
				'รับฟังคำแถลงนโยบายของ ครม.',
				'เปิดอภิปรายทั่วไปในที่ประชุมร่วมกันของรัฐสภา'
			]
		},
		{
			heading: 'ด้านการประชุมรัฐสภา',
			details: [
				'เปิดประชุมรัฐสภาครั้งแรก',
				'ให้ความเห็นชอบในการปิดสมัยประชุม',
				'ตราข้อบังคับการประชุมรัฐสภา'
			]
		},
		{
			heading: 'ด้านการให้ความเห็นชอบ',
			details: [
				'ให้ความเห็นชอบในการประกาศสงคราม',
				'รับฟังคำชี้แจงและให้ความเห็นชอบหนังสือสัญญาที่มีบทเปลี่ยนแปลงอาณาเขต อำนาจอธิปไตย หรือกระทบต่อความมั่นคงทางเศรษฐกิจ สังคม หรือการค้าของประเทศอย่างกว้างขวาง'
			]
		},
		{
			heading: 'กรณีตามบทเฉพาะกาล',
			details: [
				'ลงมติเลือกนายกรัฐมนตรี ตามมาตรา 272 (5 ปีแรกของรัฐสภาชุดแรก)',
				'พิจารณาร่าง พ.ร.บ.ที่ตราขึ้นตามหมวด 16 การปฏิรูปประเทศ',
				'พิจารณาร่าง พ.ร.บ.ที่ สว.หรือ สส.ยับยั้งไว้ตามมาตรา 271'
			]
		},
		{
			heading: 'ด้านหมวดพระมหากษัตริย์',
			details: [
				'ให้ความเห็นชอบในการแต่งตั้งผู้สำเร็จราชการแทนพระองค์',
				'รับทราบการปฏิญาณตนของผู้สำเร็จราชการแทนพระองค์ต่อรัฐสภา',
				'รับทราบการแก้ไขเพิ่มเติมกฎมณเฑียรบาลว่าด้วยการสืบราชสันตติวงศ์ พระพุทธศักราช 2467',
				'รับทราบหรือให้ความเห็นชอบในการสืบราชสมบัติ'
			]
		}
	];

	const legislations: Legislation[] = [
		{
			title: 'ร่างพระราชบัญญัติ (พ.ร.บ.)',
			details: 'กฎหมายโดยทั่วไปจะถูกตราเป็น พ.ร.บ.',
			presentedBy: ['ครม.', 'สส.20 คน', 'ประชาชน 10,000 คน'],
			consideredBy: ['สส.', 'สว.'],
			endorsedBy: 'พระมหากษัตริย์',
			steps: [
				'ร่างกฎหมายเข้าสภา',
				'ผ่านสภาผู้แทนราษฎร',
				'ผ่านวุฒิสภา',
				'ผ่านศาลรัฐธรรมนูญ (หากมีผู้ร้องเรียน)',
				'พระมหากษัตริย์ลงพระปรมาภิไธย',
				'ประกาศบนราชกิจจานุเบกษา'
			],
			examples: [
				{
					link: 'https://theyworkforus.wevis.info/votelog/263/',
					description: 'ร่าง พ.ร.บ.กำหนดระยะเวลาดำเนินงานในกระบวนการยุติธรรม (วาระ 1)'
				},
				{
					link: 'https://theyworkforus.wevis.info/votelog/230/',
					description: 'ร่าง พ.ร.บ.ล้มละลาย (วาระ 1)'
				},
				{
					link: 'http://sql.ldd.go.th/intraaccount/Information_Law/File/Law-10.pdf',
					description: 'พ.ร.บ.ด้วยการกระทำความผิดเกี่ยวกับคอมพิวเตอร์ พ.ศ. 2560'
				}
			]
		},
		{
			title: 'การอนุมัติพระราชกำหนด (พ.ร.ก.)',
			details:
				'พ.ร.ก.เป็นกฎหมายที่ ครม.ประกาศใช้ในกรณีฉุกเฉินหรือในสภาวะที่มีความจำเป็น โดยไม่ต้องผ่านกระบวนการพิจารณาของรัฐสภาในขั้นแรก เป็นเครื่องมือที่ให้อำนาจฝ่ายบริหารในการตรากฎหมาย เป็นอำนาจเฉพาะของรัฐบาลในยามฉุกเฉิน เมื่อประกาศใช้ พ.ร.ก.แล้ว ครม.ต้องเสนอ พ.ร.ก.ที่ประกาศใช้ต่อรัฐสภาเพื่อให้พิจารณาอนุมัติเป็น พ.ร.บ.โดยเร็ว',
			presentedBy: ['ครม.'],
			consideredBy: ['สส.', 'สว.'],
			endorsedBy: 'พระมหากษัตริย์',
			stepDescription:
				'หลังประกาศใช้ ครม.ต้องเสนอ พ.ร.ก.ที่ประกาศใช้ต่อรัฐสภาเพื่อให้พิจารณา ในการประชุมรัฐสภาสมัยต่อไป ถ้าอยู่นอกสมัยประชุมและประเมินว่าการรอสมัยประชุมสามัญจะเป็นการชักช้า ครม.ต้องเรียกประชุมสมัยวิสามัญเพื่อให้รัฐสภาพิจารณาอนุมัติ การอนุมัติ พ.ร.ก.เป็นกฎหมายนั้น กำหนดว่าหาก สส.ลงคะแนนเสียงไม่ถึงกึ่งหนึ่ง ให้ พ.ร.ก.ฉบับนั้นตกไป แต่ถ้า สส.อนุมัติ แต่ สว.ไม่อนุมัติ แล้ว สส.ยืนยันการอนุมัติด้วยคะแนนเสียงเกินครึ่งหนึ่งของจำนวน สส.ทั้งหมด ก็ให้ พ.ร.ก.มีผลเป็นกฎหมายและประกาศใช้เป็น พ.ร.บ.ต่อไป',
			steps: [
				'ครม.เสนอร่าง พ.ร.ก.',
				'พระมหากษัตริย์ลงพระปรมาภิไธย',
				'บังคับใช้ พ.ร.ก.',
				'ผ่านศาลรัฐธรรมนูญ (หากมีผู้ร้องเรียน)',
				'ผ่านสภาผู้แทนราษฎร',
				'ประกาศใช้เป็น พ.ร.บ.บนราชกิจจานุเบกษา'
			],
			examples: [
				{
					link: 'https://theyworkforus.wevis.info/votelog/152/',
					description: 'อนุมัติ พ.ร.ก.พิกัดอัตราศุลกากร'
				},
				{
					link: 'https://theyworkforus.wevis.info/votelog/83/',
					description: 'อนุมัติ พ.ร.ก.เงินกู้โควิด-19 (ห้าแสนล้านบาท)'
				},
				{
					link: 'https://www4.fisheries.go.th/file_footer/20160517105511_file.pdf',
					description: 'พ.ร.ก.การประมง พ.ศ. 2558'
				}
			]
		},
		{
			title: 'ร่างแก้ไขรัฐธรรมนูญ',
			details:
				'รัฐธรรมนูญเป็นกฎหมายสูงสุด การแก้ไขเพิ่มเติมรัฐธรรมนูญจึงมีกระบวนการไว้เป็นการเฉพาะและมีวิธีการแก้ไขที่ซับซ้อน โดยเฉพาะเงื่อนไขที่ต้องมีเสียง สว. 1 ใน 3 หรือ 84 คน และ สส.ฝ่ายค้าน 20% ในจำนวนเสียงครึ่งหนึ่งของสองสภาที่ใช้ลงมติเห็นชอบแก้ไขรัฐธรรมนูญ นอกจากนี้ ยังบังคับให้ทำประชามติถ้าจะแก้ไขในประเด็น บททั่วไป พระมหากษัตริย์ วิธีแก้ไขรัฐธรรมนูญ คุณสมบัตินักการเมือง อำนาจศาล และองค์กรอิสระ อีกทั้งยังให้อำนาจศาลรัฐธรรมนูญในการยับยั้งการแก้ไข หากมีสมาชิกรัฐสภาร้องเรียน',
			presentedBy: ['ครม.', 'สส. 1 ใน 5', 'สส. + สว. 1 ใน 5', 'ประชาชน 50,000 คน'],
			consideredBy: 'สภาร่วม (สส. + สว.)',
			endorsedBy: 'พระมหากษัตริย์',
			steps: [
				'ร่างแก้ไขรัฐธรรมนูญเข้าสภา',
				'ผ่านประชุมร่วมกันของรัฐสภา (สส. + สว.)',
				'ประชามติแก้ไขรัฐธรรมนูญ (ในประเด็นที่กำหนด)',
				'ผ่านศาลรัฐธรรมนูญ (หากมีผู้ร้องเรียน)',
				'พระมหากษัตริย์ลงพระปรมาภิไธย',
				'ประกาศบนราชกิจจานุเบกษา'
			],
			examples: [
				{
					link: 'https://theyworkforus.wevis.info/votelog/262/',
					description: 'แก้ รธน. ปลดล็อคท้องถิ่น (คณะก้าวหน้า) (วาระ 1)'
				},
				{
					link: 'https://theyworkforus.wevis.info/votelog/45/',
					description: 'แก้ รธน. ฉบับที่ 7 ร่างประชาชน รื้อ สร้าง ร่าง รัฐธรรมนูญใหม่ (โหวต 7 ฉบับ)'
				},
				{
					link: 'https://theyworkforus.wevis.info/votelog/291/',
					description: 'แก้ รธน. เพิ่มสิทธิพื้นฐาน (เพื่อไทย) (วาระ 1)'
				}
			]
		},
		{
			title: 'ร่างพระราชบัญญัติประกอบรัฐธรรมนูญ (ร่าง พ.ร.ป.)',
			details:
				'พ.ร.ป.เป็นกฎหมายประกอบรัฐธรรมนูญที่ตราขึ้นในรูปแบบ พ.ร.บ.ซึ่งเป็นส่วนหนึ่งของรัฐธรรมนูญที่ทำหน้าที่อธิบายขยายความและกำหนดรายละเอียดสาระสำคัญของเรื่องต่างๆ ในรัฐธรรมนูญตามที่รัฐธรรมนูญกำหนดเพื่อให้มีความสมบูรณ์ครบถ้วนและชัดเจนยิ่งขึ้น โดยในรัฐธรรมนูญ 2560 มาตรา 130 ระบุให้มี พ.ร.ป.ทั้งสิ้น 10 ฉบับ ตัวอย่างเช่น พ.ร.ป.ว่าด้วยพรรคการเมือง พ.ร.ป.ว่าด้วยการตรวจเงินแผ่นดิน พ.ร.ป.ว่าด้วยการได้มาซึ่ง สว.เป็นต้น',
			presentedBy: ['ครม.', 'สส. 1 ใน 10'],
			consideredBy: 'สภาร่วม (สส. + สว.)',
			endorsedBy: 'พระมหากษัตริย์',
			steps: [
				'ร่าง พ.ร.ป.เข้าสภา',
				'ผ่านประชุมร่วมกันของรัฐสภา (สส. + สว.)',
				'รัฐสภาส่งร่าง พ.ร.ป.ให้องค์กรที่เกี่ยวข้องให้ความเห็น',
				'ผ่านศาลรัฐธรรมนูญ (หากมีผู้ร้องเรียน)',
				'พระมหากษัตริย์ลงพระปรมาภิไธย',
				'ประกาศบนราชกิจจานุเบกษา'
			],
			examples: [
				{
					link: 'https://theyworkforus.wevis.info/votelog/177/',
					description: 'ร่าง พ.ร.ป.พรรคการเมือง (ก้าวไกล) (วาระ 1)'
				},
				{
					link: 'https://theyworkforus.wevis.info/votelog/174/',
					description: 'ร่าง พ.ร.ป.พรรคการเมือง (คณะรัฐมนตรี) (วาระ 1)'
				},
				{
					link: 'https://theyworkforus.wevis.info/votelog/202/',
					description: 'แก้ไขร่าง พ.ร.ป. สส.เรื่องการคำนวณบัญชีรายชื่อ'
				}
			]
		}
	];

	return {
		dutySection: {
			representatives,
			senates,
			both
		},
		legislations,
		seo: createSeo({
			title: 'รัฐออกกฎหมายอย่างไร'
		})
	};
}
