import type { Assembly } from '../../models/assembly';

export const rep26: Assembly = {
	id: 'rep-26',
	name: 'สมาชิกสภาผู้แทนราษฎร',
	abbreviation: 'สส.',
	term: 26,
	startedAt: new Date('01-01-2023')
};

export const gov35: Assembly = {
	id: 'gov-35',
	name: 'คณะรัฐมนตรี',
	abbreviation: 'ครม.',
	term: 35,
	startedAt: new Date('01-01-2023'),
	endedAt: new Date('05-05-2023')
};
