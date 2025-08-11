import { BillProposerType, BillStatus, type Bill, type PeopleProposer } from '$models/bill';
import type { Link } from '$models/link';
import { asPolitician, asPoliticianList, asSlug, asValidAssembly } from '../transformers';
import { sheets, withCache } from './shared';
import { asDate, asOneOf, asString, Column, Object, asArray, asNumber } from 'sheethuahua';

export const fetchBills = withCache('Bills', async (): Promise<Bill[]> => {
	const billSchema = Object({
		id: Column('id', asSlug()),
		acceptanceNumber: Column('acceptanceNumber', asString()),
		title: Column('title', asString()),
		nickname: Column('nickname', asString().optional()),
		description: Column('description', asString().optional()),
		status: Column('status', asOneOf(global.Object.values(BillStatus))),
		categories: Column('categories', asArray(asString()).optional([])),
		proposedOn: Column('proposedOn', asDate()),
		attachment: Object({
			name: Column('attachmentName', asString().optional()),
			url: Column('attachmentUrl', asString().optional())
		}),
		proposedLedByPolitician: Column('proposedLedByPoliticianId', (await asPolitician()).optional()),
		coProposedByPoliticians: Column(
			'coProposedByPoliticians',
			(await asPoliticianList()).optional()
		),
		proposedByAssembly: Column('proposedByAssemblyId', (await asValidAssembly()).optional()),
		proposedByPeople: Object({
			ledBy: Column('proposedLedByPeople', asString().optional()),
			signatoryCount: Column('peopleSignatureCount', asNumber().optional(0))
		}),
		lisUrl: Column('lisUrl', asString())
	});

	return (await sheets.get('Bills', billSchema)).map((bill) => ({
		...bill,
		nickname: bill.nickname || bill.title.replace('ร่างพระราชบัญญัติ', 'ร่าง พ.ร.บ.'),
		proposerType: bill.proposedLedByPolitician
			? BillProposerType.Politician
			: bill.proposedByAssembly
				? BillProposerType.Assembly
				: bill.proposedByPeople
					? BillProposerType.People
					: BillProposerType.Unknown,
		proposedByPeople: bill.proposedByPeople.ledBy
			? (bill.proposedByPeople as PeopleProposer)
			: undefined,
		attachment: bill.attachment.name && bill.attachment.url ? (bill.attachment as Link) : undefined
	}));
});
