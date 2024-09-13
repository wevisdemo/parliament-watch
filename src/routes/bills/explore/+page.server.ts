import type { CheckboxFilterChoice } from '$components/DataPage/DataPage.svelte';
import { fetchAssemblies, fetchBills } from '$lib/datasheets';
import { createSeo } from '$lib/seo';
import { AssemblyName } from '$models/assembly';
import { BillProposerType, BillStatus, type Bill } from '$models/bill';
import dayjs from 'dayjs';

const OTHER_CATEGORY_KEY = 'อื่นๆ';

interface FilterOptions {
	mpAssemblies: CheckboxFilterChoice[];
	status: BillStatus[];
	categories: string[];
	billProposerType: BillProposerType[];
	proposerNames: string[];
	proposerCabinet: proposerCabinetType[];
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
		| 'proposedByAssembly'
		| 'proposedLedByPolitician'
		| 'proposedByPeople'
	> {
	purposedAtMpAssemblyId: string;
	proposedLedByPoliticianName?: string;
	proposedLedByPeopleName?: string;
}

interface proposerCabinetType {
	name: string;
	id: string;
}

export async function load() {
	const assemblies = (await fetchAssemblies()).filter(
		({ name }) => name === AssemblyName.Representatives
	);

	const bills: BillSummary[] = (await fetchBills()).map((bill) => {
		const proposedDate = dayjs(bill.proposedOn);

		return {
			...bill,
			categories: bill.categories.length > 0 ? bill.categories : [OTHER_CATEGORY_KEY],
			purposedAtMpAssemblyId:
				assemblies.find(
					({ startedAt, endedAt }) =>
						proposedDate.isAfter(startedAt) && (!endedAt || proposedDate.isBefore(endedAt))
				)?.id || OTHER_CATEGORY_KEY,
			proposedLedByPoliticianName: bill.proposedLedByPolitician
				? `${bill.proposedLedByPolitician.firstname} ${bill.proposedLedByPolitician.lastname}`
				: undefined,
			proposedLedByPeopleName: bill.proposedByPeople?.ledBy
		};
	});

	const billStatuses = Object.values(BillStatus).filter((status) =>
		bills.some((bill) => bill.status === status)
	);

	const billProposerTypes = Object.values(BillProposerType).filter((proposerType) =>
		bills.some((bill) => bill.proposerType === proposerType)
	);

	const proposerNames = [
		...new Set(
			bills
				.filter((bill) => bill.proposedLedByPeopleName || bill.proposedLedByPoliticianName)
				.map(
					(bill) => bill.proposedLedByPeopleName || bill.proposedLedByPoliticianName
				) as string[] /* either of pplName or polName will be present, so it will be a `string` */
		)
	].sort((a, z) => a.localeCompare(z));

	const proposerCabinet = bills
		.filter(
			(bill) => bill.proposerType === BillProposerType.Assembly && bill.purposedAtMpAssemblyId
		)
		.map((bill) => ({
			name: `คณะรัฐมนตรี ชุดที่ ${bill.proposedByAssembly!.term} (${bill.proposedByAssembly!.startedAt.getFullYear() + 543})`,
			id: bill.proposedByAssembly!.id
		}))
		.filter((cabinet, index, self) => index === self.findIndex((t) => t.id === cabinet.id));

	const categories = [...new Set(bills.flatMap((bill) => bill.categories))].sort((a, z) =>
		a.localeCompare(z)
	);

	if (categories.includes(OTHER_CATEGORY_KEY)) {
		categories.splice(categories.indexOf(OTHER_CATEGORY_KEY), 1);
		categories.push(OTHER_CATEGORY_KEY);
	}

	const mpAssemblies: CheckboxFilterChoice[] = assemblies
		.filter(({ id }) => bills.some((bill) => bill.purposedAtMpAssemblyId === id))
		.sort((a, z) => z.startedAt.getTime() - a.startedAt.getTime())
		.map((assembly) => ({
			label: `${assembly.name}ชุดที่ ${assembly.term} (${formatThaiYear(assembly.startedAt)} - ${
				formatThaiYear(assembly?.endedAt) ?? 'ปัจจุบัน'
			})`,
			value: assembly.id
		}));

	if (bills.some((bill) => bill.purposedAtMpAssemblyId === OTHER_CATEGORY_KEY)) {
		mpAssemblies.push({
			label: 'สภาผู้แทนราษฎรชุดอื่นๆ (ก่อนชุดที่ 25)',
			value: OTHER_CATEGORY_KEY
		});
	}

	const filterOptions: FilterOptions = {
		mpAssemblies,
		status: billStatuses,
		categories,
		billProposerType: billProposerTypes,
		proposerNames,
		proposerCabinet
	};

	return {
		filterOptions,
		bills,
		seo: createSeo({
			title: 'สำรวจร่างกฎหมายในสภาแบบละเอียด'
		})
	};
}

function formatThaiYear(date: Date | null) {
	if (!date) return;
	return date.toLocaleString('th-TH', { year: 'numeric' });
}
