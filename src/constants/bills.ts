import { enumBillCreatorType } from '$lib/politigraph/genql';

export const ALL_CATEGORY_KEY = 'ทุกหมวด';

export const CREATOR_TYPE_LABEL = {
	[enumBillCreatorType.POLITICIAN]: 'นักการเมือง',
	[enumBillCreatorType.ASSEMBLY]: 'คณะรัฐมนตรี',
	[enumBillCreatorType.PEOPLE]: 'ประชาชน',
	[enumBillCreatorType.UNKNOWN]: 'อื่นๆ / ไม่พบข้อมูล'
};
