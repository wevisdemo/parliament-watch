<script lang="ts">
	import { page } from '$app/stores';
	import BillStatusTag from '$components/BillStatusTag/BillStatusTag.svelte';
	import type {
		SelectedCheckboxValueType,
		SelectedComboboxValueType
	} from '$components/DataPage/DataPage.svelte';
	import DataPage from '$components/DataPage/DataPage.svelte';
	import LinksCell from '$components/DataPage/LinksCell.svelte';
	import { formatThaiDate } from '$lib/date.js';
	import { billStatusProperty } from '$lib/politigraph/bill/status.js';
	import { onMount } from 'svelte';
	let cmpDataPage: DataPage;

	export let data;

	$: ({ filterOptions, bills } = data);

	interface Choice {
		id: string;
		text: string;
		disabled: boolean;
	}

	$: comboboxFilterList = [
		{
			key: 'filterProposerName',
			legend: 'ชื่อผู้เสนอ',
			placeholder: 'เลือกชื่อผู้เสนอ',
			choices: getProposerName()
		},
		{
			key: 'filterPartyName',
			legend: 'พรรคการเมือง',
			placeholder: 'เลือกพรรคการเมืองที่เสนอ',
			choices: getPartyName()
		}
	];

	$: getProposerName = (): Choice[] => {
		const peopleOptions = filterOptions.proposerPeople.map((name) => ({
			id: name,
			text: name,
			disabled: false
		}));

		const cabinetOptions = filterOptions.proposerCabinets.map((name) => ({
			id: name,
			text: name,
			disabled: false
		}));

		return [
			{ id: 'section2', text: 'บุคคล', disabled: true },
			...peopleOptions,
			{ id: 'section1', text: 'คณะรัฐมนตรี', disabled: true },
			...cabinetOptions
		];
	};

	$: getPartyName = (): Choice[] => {
		const partyOptions = filterOptions.proposerParties.map((party) => ({
			id: party.id as string,
			text: party.text,
			imageSrc: party.imageSrc,
			disabled: false
		}));

		return [...partyOptions];
	};

	$: checkboxFilterList = [
		{
			key: 'filterEra',
			legend: 'สมัยที่เสนอ',
			choices: filterOptions.mpAssemblies
		},
		{
			key: 'filterStatus',
			legend: 'สถานะ',
			choices: filterOptions.statuses.map((status) => ({
				label: billStatusProperty[status].label,
				value: status
			}))
		},
		// TODO: until we have a protocol to maintain bill category data
		// {
		// 	key: 'filterCategory',
		// 	legend: 'หมวดกฎหมาย (1 ฉบับ มีได้มากกว่า 1 หมวด)',
		// 	choices: filterOptions.categories.map((category) => ({
		// 		label: category,
		// 		value: category
		// 	}))
		// },
		{
			key: 'filterProposerType',
			legend: 'ประเภทผู้เสนอ',
			choices: filterOptions.proposerTypes.map((proposer) => ({
				label: proposer,
				value: proposer
			}))
		}
	];

	let searchQuery = '';
	let selectedComboboxValue: SelectedComboboxValueType;
	let selectedCheckboxValue: SelectedCheckboxValueType;

	$: filteredData =
		selectedCheckboxValue === undefined ||
		Object.values(selectedCheckboxValue).some((e) => e.length === 0)
			? []
			: bills
					.filter((bill) => {
						if (
							selectedComboboxValue.filterProposerName &&
							bill.proposer.name !== selectedComboboxValue.filterProposerName
						)
							return;

						if (
							selectedComboboxValue.filterPartyName &&
							!bill.proposerParties.has(selectedComboboxValue.filterPartyName as string)
						)
							return;

						const search = searchQuery.trim();
						if (search && !bill.title.includes(search) && !bill.nickname?.includes(search)) return;

						const { filterEra, filterStatus, filterCategory, filterProposerType } =
							selectedCheckboxValue;

						return (
							bill.purposedAtMpAssemblyId &&
							filterEra.includes(bill.purposedAtMpAssemblyId) &&
							filterStatus.includes(bill.status) &&
							// TODO: until we have a protocol to maintain bill category data
							// filterCategory.some((category) => bill.categories.includes(category as string)) &&
							filterProposerType.includes(bill.proposerType)
						);
					})
					.map((bill) => ({
						id: bill.id,
						proposedOn: bill.proposal_date,
						titleColumn: {
							id: bill.id,
							title: bill.title
						},
						status: bill.status,
						links: bill.links
					}));

	onMount(() => {
		const status = $page.url.searchParams.get('status');
		if (status && (filterOptions.statuses as string[]).includes(status)) {
			selectedCheckboxValue.filterStatus = [status];
		}

		const category = $page.url.searchParams.get('category');
		if (category && filterOptions.categories.includes(category)) {
			selectedCheckboxValue.filterCategory = [category];
		}

		const proposerType = $page.url.searchParams.get('proposertype');
		if (proposerType && (filterOptions.proposerTypes as string[]).includes(proposerType)) {
			selectedCheckboxValue.filterProposerType = [proposerType];
		}

		const proposerNameParam = $page.url.searchParams.get('proposername');
		if (proposerNameParam) {
			cmpDataPage.setCombobox('filterProposerName', proposerNameParam);
		}

		const partyParam = $page.url.searchParams.get('party');
		if (partyParam) {
			cmpDataPage.setCombobox('filterPartyName', partyParam);
		}
	});
</script>

<DataPage
	bind:this={cmpDataPage}
	unit="ร่างกฎหมาย"
	tablePageSize={50}
	breadcrumbList={[
		{ url: '/', label: 'หน้าหลัก' },
		{ url: '/bills', label: 'ร่างกฎหมายในสภา' },
		{ url: `/bills/explore`, label: 'สำรวจแบบละเอียด' }
	]}
	searchPlaceholder="ชื่อร่างกฎหมาย"
	{comboboxFilterList}
	{checkboxFilterList}
	{filteredData}
	tableHeader={[
		{ key: 'proposedOn', value: 'วันที่เสนอ' },
		{ key: 'titleColumn', value: 'ชื่อร่าง' },
		{ key: 'status', value: 'สถานะ' },
		{ key: 'links', value: 'ลิงก์' }
	]}
	downloadSize="lg"
	downloadLinks={[{ label: 'ร่างกฎหมายในสภา', url: '/files/download/bills.csv' }]}
	bind:searchQuery
	bind:selectedComboboxValue
	bind:selectedCheckboxValue
>
	<div class="flex flex-col gap-1 md:flex-row md:items-center md:gap-16">
		<div class="flex-1">
			<h1 class="fluid-heading-03">สำรวจร่างกฎหมายในสภาแบบละเอียด</h1>
			<p class="body-01">ผลลัพธ์จากเงื่อนไขการกรอง: {filteredData.length} ร่าง</p>
		</div>
	</div>
	<svelte:fragment slot="table" let:cellKey let:cellValue>
		{#if cellKey === 'proposedOn'}
			<div class="body-compact-01 whitespace-nowrap text-gray-60">
				{formatThaiDate(cellValue, { shortMonth: true, shortYear: true })}
			</div>
		{:else if cellKey === 'titleColumn'}
			<a class="text-text-01 underline hover:text-interactive-01" href="/bills/{cellValue.id}"
				>{cellValue.title}</a
			>
		{:else if cellKey === 'status'}
			<BillStatusTag class="m-0" status={cellValue} isLarge />
		{:else if cellValue}
			<LinksCell {cellValue} />
		{/if}
	</svelte:fragment>
</DataPage>
