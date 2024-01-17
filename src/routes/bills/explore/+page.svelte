<script lang="ts">
	import BillStatusTag from '$components/BillStatusTag/BillStatusTag.svelte';
	import type {
		SelectedCheckboxValueType,
		SelectedComboboxValueType
	} from '$components/DataPage/DataPage.svelte';
	import DataPage from '$components/DataPage/DataPage.svelte';
	import DocumentPdf from 'carbon-icons-svelte/lib/DocumentPdf.svelte';

	export let data;

	const formatThaiYear = (date: Date | undefined) => {
		if (!date) return;
		return date.toLocaleString('th-TH', { year: 'numeric' });
	};

	$: ({ filterOptions, bills } = data);

	$: proposerNames = [
		...new Set(
			bills
				.filter((bill) => bill.proposedLedByPeopleName || bill.proposedLedByPoliticianName)
				.map((bill) => bill.proposedLedByPeopleName || bill.proposedLedByPoliticianName)
		)
	] as string[];

	$: comboboxFilterList = [
		{
			key: 'filterName',
			legend: 'ชื่อผู้เสนอ',
			placeholder: 'เลือกชื่อผู้เสนอ',
			choices: proposerNames.map((name) => ({
				id: name,
				text: name
			}))
		}
	];

	$: checkboxFilterList = [
		{
			key: 'filterEra',
			legend: 'สมัยที่เสนอ',
			choices: filterOptions.mpAssemblies.map((assembly) => ({
				label: `${assembly.name}ชุดที่ ${assembly.term} (${formatThaiYear(assembly.startedAt)} - ${
					formatThaiYear(assembly?.endedAt) ?? 'ปัจจุบัน'
				})`,
				value: assembly.id
			}))
		},
		{
			key: 'filterStatus',
			legend: 'สถานะ',
			choices: filterOptions.status.map((status) => ({
				label: status,
				value: status
			}))
		},
		{
			key: 'filterCategory',
			legend: 'หมวดกฎหมาย (1 ฉบับ มีได้มากกว่า 1 หมวด)',
			choices: filterOptions.categories.map((category) => ({
				label: category,
				value: category
			}))
		},
		{
			key: 'filterProposer',
			legend: 'ประเภทผู้เสนอ',
			choices: filterOptions.billProposerType.map((proposer) => ({
				label: proposer,
				value: proposer
			}))
		}
	];

	let searchQuery = '';
	let selectedComboboxValue: SelectedComboboxValueType;
	let selectedCheckboxValue: SelectedCheckboxValueType;

	// NOTE: Recheck conditions again when data is ready
	$: filteredData =
		selectedCheckboxValue === undefined ||
		Object.values(selectedCheckboxValue).some((e) => e.length === 0)
			? []
			: bills
					.filter((bill) => {
						if (
							'filterName' in selectedComboboxValue &&
							![bill.proposedLedByPeopleName, bill.proposedLedByPoliticianName].includes(
								selectedComboboxValue.filterName as string | undefined
							)
						)
							return;

						const search = searchQuery.trim();
						if (search && !bill.title.includes(search)) return;

						const { filterEra, filterStatus, filterCategory, filterProposer } =
							selectedCheckboxValue;

						return (
							filterEra.includes(bill.purposedAtMpAssemblyId) &&
							filterStatus.includes(bill.status) &&
							filterCategory.some((category) => bill.categories.includes(category as string)) &&
							filterProposer.includes(bill.proposerType)
						);
					})
					.map((bill) => ({
						...bill,
						titleColumn: {
							id: bill.id,
							title: bill.title
						}
					}));
</script>

<DataPage
	breadcrumbList={[
		{ url: '/', label: 'หน้าหลัก' },
		{ url: '/bills', label: 'สำรวจร่างกฎหมายในสภา' },
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
		{ key: 'files', value: 'เอกสาร' }
	]}
	downloadSize="lg"
	downloadLinks={[{ label: 'ร่างกฎหมายในสภา', url: `/files/download/bills/bills.csv` }]}
	bind:searchQuery
	bind:selectedComboboxValue
	bind:selectedCheckboxValue
>
	<div class="flex flex-col gap-1 md:flex-row md:gap-16 md:items-center">
		<div class="flex-1">
			<h1 class="fluid-heading-03">สำรวจร่างกฎหมายในสภา</h1>
			<p class="body-01">สำรวจแบบละเอียด</p>
		</div>
	</div>
	<svelte:fragment slot="table" let:cellKey let:cellValue>
		{#if cellKey === 'proposedOn'}
			<span class="text-gray-60 body-compact-01"
				>{new Date(cellValue).toLocaleString('th-TH', {
					day: 'numeric',
					month: 'short',
					year: '2-digit'
				})}</span
			>
		{:else if cellKey === 'titleColumn'}
			<a class="text-text-01 underline hover:text-interactive-01" href="/bills/{cellValue.id}"
				>{cellValue.title}</a
			>
		{:else if cellKey === 'status'}
			<BillStatusTag status={cellValue} isLarge />
		{:else}
			<a href="#{cellValue}">
				<DocumentPdf />
			</a>
		{/if}
	</svelte:fragment>
</DataPage>
