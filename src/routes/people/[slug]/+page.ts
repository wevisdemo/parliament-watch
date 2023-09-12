import type { Politician } from '../../../models/politician';
import { rep26, gov35 } from '../../../mocks/data/assembly';
import { movingForwardParty } from '../../../mocks/data/party';

export function load({ params }) {
	const [firstname, lastname] = params.slug.split('-');

	const politician: Politician = {
		firstname,
		lastname,
		isActive: true,
		avatar: 'https://placehold.co/800?text=avatar',
		sex: 'ชาย',
		birthdate: new Date('1999-02-12'),
		educations: ['ปริญญาเอก University of Toulouse, France'],
		previousOccupations: ['อาจารย์คณะนิติศาสตร์ มหาวิทยาลัยธรรมศาสตร์'],
		assetValue: 3490000000,
		debtValue: 39494040,
		contacts: [
			{ label: 'Facebook', href: 'https://facebook.com' },
			{ label: 'Twitter', href: 'https://twitter.com' }
		],
		assemblyHistories: [
			{ role: 'สมาชิกแบบบัญชีรายชื่อ', assembly: rep26, from: new Date('2023-01-01') },
			{
				role: 'รองประธานสภา คนที่ 1',
				assembly: rep26,
				from: new Date('2023-01-01'),
				to: new Date('2023-06-12')
			},
			{
				role: 'รัฐมนตรีกระทรวงมหาดไทย',
				assembly: gov35,
				from: new Date('2023-01-01'),
				to: new Date('2023-06-12')
			}
		],
		partyHistories: [
			{
				role: 'เลขาธิการพรรค',
				party: movingForwardParty,
				from: new Date('2023-05-01')
			},
			{
				role: 'หัวหน้าพรรค',
				party: movingForwardParty,
				from: new Date('2023-01-01'),
				to: new Date('2023-05-01')
			}
		]
	};

	return { politician };
}
