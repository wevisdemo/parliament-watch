import { enumBillCreatorType } from '$lib/politigraph/genql';

export const MP_OTHER_TERMS = {
	id: 'MP_OTHER_TERMS_ID',
	value: 'สส. ชุดอื่น ๆ (ก่อนปี 62)',
	founding_date: null,
	// for displaying other terms not in politigraph, dissolution_date chosen to be just before 25th term
	dissolution_date: '2019-03-23'
};

export const ALL_CATEGORY_KEY = 'ทุกหมวด';

export const CREATOR_TYPE_LABEL = {
	[enumBillCreatorType.POLITICIAN]: 'นักการเมือง',
	[enumBillCreatorType.ASSEMBLY]: 'คณะรัฐมนตรี',
	[enumBillCreatorType.PEOPLE]: 'ประชาชน',
	[enumBillCreatorType.UNKNOWN]: 'อื่นๆ / ไม่พบข้อมูล'
};
