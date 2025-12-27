import type {
	CheckboxFilterChoice,
	ComboboxFilterChoice
} from '$components/DataPage/DataPage.svelte';
import { formatYearRange } from '$lib/date';
import { billStatusList } from '$lib/politigraph/bill/status';
import type { BillStatus } from '$lib/politigraph/genql';
import { graphql } from '$lib/politigraph/server';
import { createSeo } from '$lib/seo';
import { BillProposerType } from '$models/bill';
import dayjs from 'dayjs';

const OTHER_CATEGORY_KEY = 'อื่นๆ';

interface FilterOptions {
	mpAssemblies: CheckboxFilterChoice[];
	statuses: BillStatus[];
	categories: string[];
	proposerTypes: BillProposerType[];
	proposerPeople: string[];
	proposerCabinets: string[];
	proposerParties: ComboboxFilterChoice[];
}

export async function load() {
	const data = await graphql.query({
		organizations: {
			__args: {
				where: {
					classification_IN: ['HOUSE_OF_REPRESENTATIVE', 'POLITICAL_PARTY']
				},
				sort: [{ founding_date: 'DESC' }]
			},
			id: true,
			name: true,
			founding_date: true,
			dissolution_date: true,
			classification: true,
			image: true
		},
		bills: {
			__args: {
				sort: [{ proposal_date: 'DESC' }]
			},
			id: true,
			title: true,
			nickname: true,
			status: true,
			proposal_date: true,
			categories: true,
			links: {
				url: true,
				note: true
			},
			creators: {
				__typename: true,
				on_Organization: {
					name: true
				},
				on_Person: {
					name: true,
					memberships: {
						start_date: true,
						end_date: true,
						posts: {
							start_date: true,
							end_date: true,
							label: true,
							organizations: {
								name: true,
								classification: true,
								founding_date: true,
								dissolution_date: true
							}
						}
					}
				}
			},
			co_proposers: {
				name: true,
				memberships: {
					start_date: true,
					end_date: true,
					posts: {
						start_date: true,
						end_date: true,
						label: true,
						organizations: {
							name: true,
							classification: true,
							founding_date: true,
							dissolution_date: true
						}
					}
				}
			},
			people_signature_count: true
		}
	});

	const assemblies = data.organizations.filter(
		(org) => org.classification == 'HOUSE_OF_REPRESENTATIVE'
	);
	const parties = data.organizations.filter((org) => org.classification == 'POLITICAL_PARTY');

	const bills = data.bills.map(({ creators, people_signature_count, ...bill }) => {
		const proposedDate = dayjs(bill.proposal_date);

		return {
			...bill,
			categories: bill.categories?.length ? bill.categories : [OTHER_CATEGORY_KEY],
			purposedAtMpAssemblyId:
				assemblies.find(
					({ founding_date, dissolution_date }) =>
						proposedDate.isAfter(founding_date) &&
						(!dissolution_date || proposedDate.isBefore(dissolution_date))
				)?.id || OTHER_CATEGORY_KEY,
			proposerType: !creators[0]
				? BillProposerType.Unknown
				: creators[0].__typename === 'Organization'
					? BillProposerType.Assembly
					: people_signature_count
						? BillProposerType.People
						: BillProposerType.Politician,
			proposer: creators.at(0) ?? { __typename: null, name: OTHER_CATEGORY_KEY, memberships: [] }
		};
	});

	const billStatuses = billStatusList.filter((status) =>
		bills.some((bill) => bill.status === status)
	);

	const proposerTypes = Object.values(BillProposerType).filter((proposerType) =>
		bills.some((bill) => bill.proposerType === proposerType)
	);

	const proposerPeople = [
		...new Set(
			bills
				.filter((bill) => bill.proposer.__typename === 'Person')
				.map((bill) => bill.proposer.name)
		)
	].sort((a, z) => a.localeCompare(z));

	const proposerCabinets = [
		...new Set(
			bills
				.filter((bill) => bill.proposer.__typename === 'Organization')
				.map((bill) => bill.proposer.name)
		)
	].sort((a, z) => a.localeCompare(z));

	const proposerParties: ComboboxFilterChoice[] = [
		...new Set(
			parties.map((party) => ({
				id: party.name,
				text: party.name,
				imageSrc: party.image ?? '/images/politicians/_placeholder.webp'
			}))
		)
	].sort((a, z) => a.text.localeCompare(z.text));

	const categories = [...new Set(bills.flatMap((bill) => bill.categories ?? []))].sort((a, z) =>
		a.localeCompare(z)
	);

	if (categories.includes(OTHER_CATEGORY_KEY)) {
		categories.splice(categories.indexOf(OTHER_CATEGORY_KEY), 1);
		categories.push(OTHER_CATEGORY_KEY);
	}

	const mpAssemblies: CheckboxFilterChoice[] = assemblies
		.filter(({ id }) => bills.some((bill) => bill.purposedAtMpAssemblyId === id))
		.sort((a, z) => (z.founding_date ?? '').localeCompare(a.founding_date ?? ''))
		.map((assembly) => ({
			label: `${assembly.name} (${formatYearRange(assembly.founding_date, assembly.dissolution_date)})`,
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
		statuses: billStatuses,
		categories,
		proposerTypes,
		proposerPeople,
		proposerCabinets,
		proposerParties
	};

	return {
		filterOptions,
		bills,
		seo: createSeo({
			title: 'สำรวจร่างกฎหมายในสภาแบบละเอียด'
		})
	};
}
