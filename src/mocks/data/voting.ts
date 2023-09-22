import {
	DefaultVotingResult,
	type VoteOption,
	type Voting,
	type VotingSummary
} from '$models/voting';
import { rep26 } from './assembly';

const yesNoVoteOptions: VoteOption[] = [
	{
		label: 'เห็นด้วย',
		color: '#0EE2E2'
	},
	{ label: 'ไม่เห็นด้วย', color: '#E52900' }
];

export const passedVoting: Voting = {
	id: 1,
	title: 'ร่าง พ.ร.บ. กำหนดระยะเวลาดำเนินงานในกระบวนการยุติธรรม (วาระ 1)',
	description:
		'ร่างรัฐธรรมนูญแห่งราชอาณาจักรไทย แก้ไขเพิ่มเติม พุทธศักราช .... (แก้ไขเพิ่มเติมหมวด 14 มาตรา 249 มาตรา 250 มาตรา 251 มาตรา 252 มาตรา 253 มาตรา 254 เพิ่มมาตรา 254/1 มาตรา 254/2 มาตรา 254/3 มาตรา 254/4 มาตรา 254/5 และมาตรา 254/6)',
	category: 'Foreign Policy and Defence',
	date: new Date(),
	meetingType: 'สภาร่วม',
	participatedAssembleIds: [rep26.id],
	voteOptions: yesNoVoteOptions,
	winningCondition:
		'1.ได้เสียงเกินกึ่งหนึ่งของสภา 2.ได้เสียงฝ่ายค้านอย่างน้อย 20% 3. ได้เสียง สว. อย่างน้อย 1 ใน 3',
	result: DefaultVotingResult.Passed,
	sourceUrl: 'https://google.com',
	files: []
};

export const passedVotingSummary: VotingSummary = {
	id: passedVoting.id,
	title: passedVoting.title,
	result: passedVoting.result,
	date: passedVoting.date,
	files: passedVoting.files
};

export const failedVotingSummary: VotingSummary = {
	...passedVotingSummary,
	result: DefaultVotingResult.Failed
};
