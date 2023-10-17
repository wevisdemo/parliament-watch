import type { Politician } from '../../models/politician';
import { movingForwardParty } from './party';

export const movingForwardPolitician: Politician = {
	id: '1',
	avatar: 'https://via.placeholder.com/64',
	firstname: 'พริษฐ์',
	lastname: 'วัชรสินธุ',
	isActive: true,
	sex: 'male',
	birthdate: new Date('10/12/1992'),
	educations: [
		'ปริญญาตรี สาขา ปรัชญา การเมือง เศรษฐศาสตร์ (เกียรตินิยมอันดับ 1 เหรียญทอง) - University of Oxford (2011-15)'
	],
	previousOccupations: ['CEO - StartDee', 'Management Consultant - McKinsey & Company'],
	assetValue: 10000000,
	debtValue: 10000000,
	contacts: [],
	assemblyRoles: [],
	partyRoles: [
		{
			party: movingForwardParty,
			role: 'Policy Campaign Manager',
			startedAt: new Date('01/01/2022')
		}
	]
};
