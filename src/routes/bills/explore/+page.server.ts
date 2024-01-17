import { fetchAssemblies } from '$lib/datasheets';
import { AssemblyName, type Assembly } from '$models/assembly';
import { BillProposerType, BillStatus, type Bill } from '$models/bill';
import { enactedBill } from '../../../mocks/data/bill';
import { movingForwardPolitician } from '../../../mocks/data/politician';
import { createSeo } from '../../../utils/seo';

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

export async function load() {
	const billStatuses = Object.values(BillStatus);
	const mockCategories = ['ขนส่งสาธารณะ', 'เศรษฐกิจ', 'แก้รัฐธรรมนูญ', 'วัฒนธรรม', 'เกษตรกรรม'];
	const billProposerTypes = Object.values(BillProposerType);

	const mpAssemblies = (await fetchAssemblies()).filter(
		({ name }) => name === AssemblyName.Representatives
	);

	const filterOptions: FilterOptions = {
		mpAssemblies,
		status: billStatuses,
		categories: mockCategories,
		billProposerType: billProposerTypes
	};

	const bills: BillSummary[] = new Array(100).fill({}).map((_, i) => ({
		id: i,
		title: enactedBill.title,
		nickname: enactedBill.nickname,
		proposedOn: enactedBill.proposedOn,
		purposedAtMpAssemblyId: mpAssemblies[i % mpAssemblies.length].id,
		status: billStatuses[i % billStatuses.length],
		categories: [mockCategories[i % mockCategories.length]],
		...getProposerProperties(i)
	}));

	return {
		filterOptions,
		bills,
		seo: createSeo({
			title: 'สำรวจร่างกฎหมายในสภาแบบละเอียด'
		})
	};
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
