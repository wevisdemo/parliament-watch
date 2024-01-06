export interface Seo {
	title: string;
	description: string;
	og: string;
}

export const createSeo = (data: Partial<Seo>): Seo => {
	return {
		title: data.title ?? 'Parliament Watch - ขับเคลื่อนประชาธิปไตย ร่วมเฝ้าดูความเคลื่อนไหวรัฐสภา',
		description: data.description ?? 'ติดตามกฎหมาย นโยบาย และการทำงานของนักการเมือง',
		og: data.og ?? 'https://parliamentwatch.wevis.info/images/og.png'
	};
};
