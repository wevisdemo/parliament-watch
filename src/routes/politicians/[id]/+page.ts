import type { Politician } from '../../../models/politician';
import { rep26, gov35 } from '../../../mocks/data/assembly';
import { movingForwardParty } from '../../../mocks/data/party';
import type { Voting } from '$models/voting';
import { failedVoting, passedVoting } from '../../../mocks/data/voting';

interface VotingHistory {
	total: number;
	latest: Pick<Voting, 'id' | 'title' | 'result'>[];
}

interface VotingAbsentStats {
	totalVoting: number;
	absentVoting: number;
	averageAbsentVoting: number;
}

export function load({ params }) {
	const [firstname, lastname] = params.id.split('-');

	const politician: Politician = {
		id: params.id,
		prefix: 'นาย',
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
		assemblyRoles: [
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
		partyRoles: [
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

	const mockLatestVoting: VotingHistory['latest'] = [
		failedVoting,
		passedVoting,
		passedVoting,
		failedVoting,
		passedVoting
	].map(({ id, title, result }) => ({ id, title, result }));

	const agreedVoting: VotingHistory = {
		total: 23,
		latest: mockLatestVoting
	};

	const disagreedVoting: VotingHistory = {
		total: 14,
		latest: mockLatestVoting
	};

	const votingAbsentStats: VotingAbsentStats = {
		totalVoting: 100,
		absentVoting: 15,
		averageAbsentVoting: 22
	};

	return { politician, agreedVoting, disagreedVoting, votingAbsentStats };
}
