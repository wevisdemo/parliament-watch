import type { Assembly } from '$models/assembly';
import { BillStatus, type Bill, BillProposerType } from '$models/bill';
import { rep25, rep26 } from '../../../mocks/data/assembly';
import { succeededBill } from '../../../mocks/data/bill';
import { movingForwardPolitician } from '../../../mocks/data/politician';

interface FilterOptions {
	mpAssemblies: Assembly[];
	status: BillStatus[];
	categories: string[];
	billProposerType: BillProposerType[];
}

interface BillSummary
	extends Pick<
		Bill,
		| 'id'
		| 'title'
		| 'nickname'
		| 'proposedOn'
		| 'categories'
		| 'status'
		| 'proposerType'
		| 'proposedLedByPolitician'
		| 'proposedByPeople'
	> {
	purposedAtMpAssemblyId: string;
	proposedLedByPoliticianName?: string;
	proposedLedByPeopleName?: string;
}

export function load() {
	const billStatuses = Object.values(BillStatus);
	const mockCategories = ['ขนส่งสาธารณะ', 'เศรษฐกิจ', 'แก้รัฐธรรมนูญ', 'วัฒนธรรม', 'เกษตรกรรม'];
	const billProposerTypes = Object.values(BillProposerType);

	const filterOptions: FilterOptions = {
		mpAssemblies: [rep25, rep26],
		status: billStatuses,
		categories: mockCategories,
		billProposerType: billProposerTypes
	};

	const bills: BillSummary[] = new Array(100).fill({}).map((i) => ({
		id: i,
		title: succeededBill.title,
		nickname: succeededBill.nickname,
		proposedOn: succeededBill.proposedOn,
		purposedAtMpAssemblyId: i % 2 ? rep25.id : rep26.id,
		status: billStatuses[i % billStatuses.length],
		categories: [mockCategories[i % mockCategories.length]],
		...getProposerProperties(i)
	}));

	return { filterOptions, bills };
}

function getProposerProperties(
	i: number
): Pick<BillSummary, 'proposerType' | 'proposedLedByPoliticianName' | 'proposedLedByPeopleName'> {
	const billProposerTypes = Object.values(BillProposerType);

	switch (billProposerTypes[i % billProposerTypes.length]) {
		case BillProposerType.Politician:
			return {
				proposerType: BillProposerType.Politician,
				proposedLedByPoliticianName:
					movingForwardPolitician.firstname + ' ' + movingForwardPolitician.lastname
			};
		case BillProposerType.Cabinet:
			return {
				proposerType: BillProposerType.Cabinet
			};
		case BillProposerType.People:
			return {
				proposerType: BillProposerType.People,
				proposedLedByPeopleName: 'ยิ่งชีพ อัชฌานนท์'
			};
	}
}
