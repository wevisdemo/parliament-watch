import { BillStatus, type Bill } from '$models/bill.js';
import type { Event } from '$models/event.js';
import type { Voting } from '$models/voting.js';
import { inProgressBill, enactedBill } from '../../../mocks/data/bill.js';
import {
	enforcementEvent,
	failingMp3Event,
	hearingEvent,
	inProgressMp2Event,
	passingMergedMp2Event,
	passingMp1Event,
	passingMp2Event,
	passingMp3Event,
	passingSenate1Event,
	passingSenate2Event,
	passingSenate3Event,
	royalAssentEvent
} from '../../../mocks/data/event.js';
import { failedVoting, passedVoting } from '../../../mocks/data/voting.js';

export interface VotingResultSummary {
	agreed: number;
	total: number;
	subResults?: {
		affiliationName: string;
		agreed: number;
		total: number;
	}[];
}

export function load({ params }) {
	/*
	 * | billId | Status      |
	 * | ------ | ----------- |
	 * | 1      | InProgress  |
	 * | 2      | Success     |
	 * | 3      | Rejected    |
	 * | 4      | Merged      |
	 */
	const billId = Number(params.id);
	const bill = enactedBill;
	bill.id = billId;

	let mergedBills: Bill[] | undefined;

	let events: Event[] = [];
	let mergedIntoBill: Bill | undefined;
	let mergedIntoBillLatestEvent: Event | undefined;
	let relatedVotingResults: {
		[id: number]: {
			voting: Voting;
			resultSummary: VotingResultSummary;
		};
	} = {};

	if (billId === 1) {
		bill.status = BillStatus.InProgress;
		mergedBills = [
			{ ...enactedBill, status: BillStatus.Merged },
			{ ...enactedBill, status: BillStatus.Merged }
		];
		events = [hearingEvent, passingMp1Event, inProgressMp2Event];
		relatedVotingResults = {
			1: { voting: passedVoting, resultSummary: fakeMpPassedVotingResultSummary }
		};
	} else if (billId === 2) {
		bill.status = BillStatus.Enacted;
		events = [
			hearingEvent,
			passingMp1Event,
			passingMp2Event,
			passingMp3Event,
			passingSenate1Event,
			passingSenate2Event,
			passingSenate3Event,
			royalAssentEvent,
			enforcementEvent
		];
		relatedVotingResults = {
			1: { voting: passedVoting, resultSummary: fakeMpPassedVotingResultSummary },
			3: { voting: passedVoting, resultSummary: fakeSenatePassedVotingResultSummary }
		};
	} else if (billId === 3) {
		bill.status = BillStatus.Rejected;
		events = [hearingEvent, passingMp1Event, passingMp2Event, failingMp3Event];
		relatedVotingResults = {
			1: { voting: passedVoting, resultSummary: fakeMpPassedVotingResultSummary },
			2: { voting: failedVoting, resultSummary: fakeMpFailedVotingResultSummary }
		};
	} else if (billId === 4) {
		bill.status = BillStatus.Merged;
		events = [hearingEvent, passingMp1Event, passingMergedMp2Event];
		mergedIntoBill = inProgressBill;
		mergedIntoBillLatestEvent = { ...inProgressMp2Event, billId: inProgressBill.id };
		relatedVotingResults = {
			1: { voting: passedVoting, resultSummary: fakeMpPassedVotingResultSummary }
		};
	}

	events.reverse();

	return {
		bill,
		mergedBills, // Bills that got merged into this bill.
		events,
		mergedIntoBill, // The bill that this bill got merged into. (merged event)
		mergedIntoBillLatestEvent,
		relatedVotingResults // Info of votings in events
	};
}

const fakeMpPassedVotingResultSummary: VotingResultSummary = {
	agreed: 324,
	total: 500,
	subResults: [
		{
			affiliationName: 'ส.ส. ฝ่ายรัฐบาล',
			agreed: 310,
			total: 310
		},
		{
			affiliationName: 'ส.ส. ฝ่ายค้าน',
			agreed: 14,
			total: 190
		}
	]
};

const fakeMpFailedVotingResultSummary: VotingResultSummary = {
	agreed: 130,
	total: 500,
	subResults: [
		{
			affiliationName: 'ส.ส. ฝ่ายรัฐบาล',
			agreed: 0,
			total: 310
		},
		{
			affiliationName: 'ส.ส. ฝ่ายค้าน',
			agreed: 130,
			total: 190
		}
	]
};

const fakeSenatePassedVotingResultSummary: VotingResultSummary = {
	agreed: 200,
	total: 250
};
