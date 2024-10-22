import { PromiseStatus } from '$models/promise';

export const promiseStatusList = [
	{
		label: PromiseStatus.clarifying,
		text: 'เราพบว่าคำสัญญานี้มีความคลุมเครือและกำลังอยู่ในระหว่างการขอคำชี้แจงเพิ่มเติม'
	},
	{
		label: PromiseStatus.notStarted,
		text: 'เราไม่พบข้อมูลความเคลื่อนไหวที่เกี่ยวกับคำสัญญานี้'
	},
	{
		label: PromiseStatus.inProgress,
		text: 'เราพบข้อมูลความคืบหน้า แต่ยังไม่บรรลุเป้าหมายที่ได้สัญญาไว้'
	},
	{
		label: PromiseStatus.fulfilled,
		text: 'เราพบข้อมูลความคืบหน้า และข้อมูลที่ชี้ว่าได้บรรลุเป้าหมายที่ได้สัญญาไว้แล้ว'
	},
	{
		label: PromiseStatus.unhonored,
		text: 'เราพบข้อมูลความคืบหน้า ที่ชี้ว่ามีการเลิกดำเนินการเพื่อบรรลุเป้าหมายตามคำสัญญานี้แล้ว'
	}
] as { label: PromiseStatus; text: string }[];
