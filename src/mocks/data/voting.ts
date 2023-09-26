import {
	DefaultVoteOption,
	DefaultVotingResult,
	type VoteOption,
	type Voting
} from '$models/voting';
import { rep26 } from './assembly';

export const defaultVoteOptions: VoteOption[] = [
	{
		label: DefaultVoteOption.Agreed,
		color: '#00A1AB'
	},
	{ label: DefaultVoteOption.Disagreed, color: '#E52900' },
	{
		label: DefaultVoteOption.Novote,
		color: '#393939'
	},
	{
		label: DefaultVoteOption.Abstain,
		color: '#8D8D8D'
	},
	{
		label: DefaultVoteOption.Absent,
		color: '#E0E0E0'
	}
];

export const mockCategory = [
	'เศรษฐกิจ',
	'ขนส่งสาธารณะ',
	'แก้รัฐธรรมนูญ',
	'ที่อยู่อาศัย',
	'สวัสดิการ'
];

export const passedVoting: Voting = {
	id: 1,
	title: 'ร่าง พ.ร.บ. กำหนดระยะเวลาดำเนินงานในกระบวนการยุติธรรม (วาระ 1)',
	description:
		'ร่างรัฐธรรมนูญแห่งราชอาณาจักรไทย แก้ไขเพิ่มเติม พุทธศักราช .... (แก้ไขเพิ่มเติมหมวด 14 มาตรา 249 มาตรา 250 มาตรา 251 มาตรา 252 มาตรา 253 มาตรา 254 เพิ่มมาตรา 254/1 มาตรา 254/2 มาตรา 254/3 มาตรา 254/4 มาตรา 254/5 และมาตรา 254/6)',
	category: 'เศรษฐกิจ',
	date: new Date(),
	meetingType: 'สภาร่วม',
	participatedAssembleIds: [rep26.id],
	voteOptions: defaultVoteOptions,
	winningCondition:
		'1.ได้เสียงเกินกึ่งหนึ่งของสภา 2.ได้เสียงฝ่ายค้านอย่างน้อย 20% 3. ได้เสียง สว. อย่างน้อย 1 ใน 3',
	result: DefaultVotingResult.Passed,
	sourceUrl: 'https://google.com',
	files: []
};

export const failedVoting: Voting = {
	...passedVoting,
	result: DefaultVotingResult.Failed
};
