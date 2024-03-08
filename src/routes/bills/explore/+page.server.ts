import { fetchAssemblies } from '$lib/datasheets';
import { createSeo } from '$lib/seo';
import { AssemblyName, type Assembly } from '$models/assembly';
import { BillProposerType, BillStatus, type Bill } from '$models/bill';
import { enactedBill } from '../../../mocks/data/bill';
import { movingForwardPolitician } from '../../../mocks/data/politician';

interface FilterOptions {
	mpAssemblies: Assembly[];
	status: BillStatus[];
	categories: string[];
	billProposerType: BillProposerType[];
	proposerNames: string[];
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

	const proposerNames = [
		...new Set(
			bills
				.filter((bill) => bill.proposedLedByPeopleName || bill.proposedLedByPoliticianName)
				.map(
					(bill) => bill.proposedLedByPeopleName || bill.proposedLedByPoliticianName
				) as string[] /* either of pplName or polName will be present, so it will be a `string` */
		)
	];

	const filterOptions: FilterOptions = {
		mpAssemblies,
		status: billStatuses,
		categories: mockCategories,
		billProposerType: billProposerTypes,
		proposerNames
	};

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
