import type { PromiseStatus } from '$models/promise';

export const promiseStatusList = [
	{
		label: 'รอคำชี้แจงเพิ่มเติม',
		text: 'เราพบว่าคำสัญญานี้มีความคลุมเครือและกำลังอยู่ในระหว่างการขอคำชี้แจงเพิ่มเติม'
	},
	{
		label: 'ไม่พบความเคลื่อนไหว',
		text: 'เราไม่พบข้อมูลความเคลื่อนไหวที่เกี่ยวกับคำสัญญานี้'
	},
	{
		label: 'กำลังดำเนินการ',
		text: 'เราพบข้อมูลความคืบหน้า แต่ยังไม่บรรลุเป้าหมายที่ได้สัญญาไว้'
	},
	{
		label: 'ดำเนินการแล้ว',
		text: 'เราพบข้อมูลความคืบหน้า และข้อมูลที่ชี้ว่าได้บรรลุเป้าหมายที่ได้สัญญาไว้แล้ว'
	},
	{
		label: 'เลิกดำเนินการ',
		text: 'เราพบข้อมูลความคืบหน้า ที่ชี้ว่ามีการเลิกดำเนินการเพื่อบรรลุเป้าหมายตามคำสัญญานี้แล้ว'
	}
] as { label: PromiseStatus; text: string }[];
