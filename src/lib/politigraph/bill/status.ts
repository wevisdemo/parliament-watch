import type { BillStatus } from '../genql';

interface BillStatusProps {
	label: string;
	colorClass: string;
	description: string;
	examples?: string[];
}

export const billStatusProperty: Record<BillStatus, BillStatusProps> = {
	IN_PROGRESS: {
		label: 'กำลังดำเนินการ',
		colorClass: 'bg-yellow-20 text-text-10',
		description: 'ทุกร่างที่ถูกเสนอเข้าสภาและ อยู่ในกระบวนการต่าง ๆ แต่ยังไม่ถูกบังคับใช้'
	},
	ENACTED: {
		label: 'ออกเป็นกฎหมาย',
		colorClass: 'bg-teal-80 text-text-04',
		description: 'ทุกร่างที่ถูกบังคับใช้ผ่านประกาศบนราชกิจจานุเบกษา'
	},
	REJECTED: {
		label: 'ตกไป',
		colorClass: 'bg-red-80 text-text-04',
		description: 'ทุกร่างที่',
		examples: [
			'ประธานสภาวินิจฉัยเป็นร่างการเงินและนายกรัฐมนตรียังไม่รับรอง หรือ',
			'ผ่านเข้าสภาแต่ไม่ผ่านในการลงมติ หรือ',
			'ผู้เสนอขอถอนร่าง หรือ',
			'ถูกวินิจฉัยว่าขัดต่อรัฐธรรมนูญ'
		]
	},
	MERGED: {
		label: 'ถูกรวมร่าง',
		colorClass: 'bg-purple-80 text-text-04',
		description:
			'ทุกร่างที่ผ่านการลงมติในวาระ 1 แต่ถูกพิจารณาไปรวมกับร่างอื่นที่มีวัตถุประสงค์เดียวกัน'
	}
};

export const billStatusList = Object.keys(billStatusProperty) as BillStatus[];
