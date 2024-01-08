export interface Seo {
	title: string;
	description: string;
	og: string;
}

export const DEFAULT_SEO = {
	title: 'Parliament Watch - ขับเคลื่อนประชาธิปไตย ร่วมเฝ้าดูความเคลื่อนไหวรัฐสภา',
	description: 'ติดตามกฎหมาย นโยบาย และการทำงานของนักการเมือง',
	og: 'https://parliamentwatch.wevis.info/images/og.png'
};

export const createSeo = (data: Partial<Seo>): Seo => {
	return {
		title: data.title ? `${data.title} - Parliament Watch` : DEFAULT_SEO.title,
		description: data.description ?? DEFAULT_SEO.description,
		og: data.og ?? DEFAULT_SEO.og
	};
};
