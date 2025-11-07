import type { BillStatus } from '../genql';

interface BillStatusProps {
	label: string;
	colorClass: string;
}

export const billStatusProperty: Record<BillStatus, BillStatusProps> = {
	IN_PROGRESS: { label: 'กำลังดำเนินการ', colorClass: 'bg-yellow-20 text-text-10' },
	ENFORCED: { label: 'ออกเป็นกฎหมาย', colorClass: 'bg-teal-80 text-text-04' },
	REJECTED: { label: 'ตกไป', colorClass: 'bg-red-80 text-text-04' },
	MERGED: { label: 'ถูกรวมร่าง', colorClass: 'bg-purple-80 text-text-04' }
};

export const billStatusList = Object.keys(billStatusProperty) as BillStatus[];
