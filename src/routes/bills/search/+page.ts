import { AssemblyName, type Assembly } from '$models/assembly';
import { BillStatus, type Bill, BillProposerType } from '$models/bill';
import { assemblies } from '../../../libs/datasheets';
import { enactedBill } from '../../../mocks/data/bill';
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

	const mpAssemblies = assemblies.filter(({ name }) => name === AssemblyName.Representatives);

	const filterOptions: FilterOptions = {
		mpAssemblies,
		status: billStatuses,
		categories: mockCategories,
		billProposerType: billProposerTypes
	};

	const bills: BillSummary[] = new Array(100).fill({}).map((i) => ({
		id: i,
		title: enactedBill.title,
		nickname: enactedBill.nickname,
		proposedOn: enactedBill.proposedOn,
		purposedAtMpAssemblyId: mpAssemblies[i % 2].id,
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
