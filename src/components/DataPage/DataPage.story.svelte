<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	import DataPage from './DataPage.svelte';

	export let Hst: Hst;

	let data = Array(102).fill``.map((_, i) => ({
		name: 'Alvin Kiev',
		id: i,
		type: ['A', 'B', 'C'][i % 3],
		direction: i % 2 === 0
	}));
	let breadcrumbList: {
		label: string;
		url: string;
	}[] = [
		{ url: '/', label: 'หน้าหลัก' },
		{ url: '/votelog', label: 'ประวัติการลงมติ' }
	];
	let searchPlaceholder = 'ชื่อ-นามสกุล';
	let comboboxFilterList = [
		{
			key: 'filterComboboxType',
			legend: 'กลุ่ม',
			placeholder: 'เลือกกลุ่ม',
			choices: [
				{ id: 'A', text: 'A' },
				{ id: 'B', text: 'B' },
				{ id: 'C', text: 'C' }
			]
		}
	];
	let checkboxFilterList = [
		{
			key: 'filterVoteDirection',
			legend: 'เงื่อนไขพิเศษ',
			choices: [
				{
					label: 'ลงมติต่างจากเสียงส่วนใหญ่ในพรรค',
					value: false
				},
				{
					label: 'ลงมติเหมือนเสียงส่วนใหญ่ในพรรค',
					value: true
				}
			]
		}
	];
	let tableHeader: { key: string; value: string }[] = [
		{ key: 'name', value: 'ชื่อ' },
		{ key: 'type', value: 'กลุ่ม' },
		{ key: 'direction', value: 'ทิศทางการลงมติ' }
	];
	let tablePageSize = 10;
	let searchQuery = '';
	let selectedCheckboxValue: { [x: string]: (string | number | boolean)[] };
	let selectedComboboxValue: { [x: string]: string | number | undefined };

	$: filteredData =
		selectedCheckboxValue === undefined ||
		selectedComboboxValue === undefined ||
		Object.values(selectedCheckboxValue).some((e) => e.length === 0)
			? []
			: data.filter(
					(e) =>
						selectedCheckboxValue.filterVoteDirection.includes(e.direction) &&
						(selectedComboboxValue.filterComboboxType
							? e.type === selectedComboboxValue.filterComboboxType
							: true)
				);
	let unit = 'มติ';
</script>

<Hst.Story title="DataPage" layout={{ type: 'single', iframe: true }}>
	<div class="body-02 bg-white font-sans">
		<DataPage
			{unit}
			{breadcrumbList}
			{searchPlaceholder}
			{comboboxFilterList}
			{checkboxFilterList}
			{filteredData}
			{tableHeader}
			{tablePageSize}
			bind:searchQuery
			bind:selectedCheckboxValue
			bind:selectedComboboxValue
		>
			<h1 class="fluid-heading-03">ประวัติการลงมติ</h1>
			<svelte:fragment slot="table" let:cellKey let:cellValue>
				{#if cellKey === 'direction'}
					{#if cellValue}
						<span class="rounded-full bg-teal-30 px-2 text-black">ตามเสียงส่วนใหญ่ในพรรค</span>
					{:else}
						<span class="rounded-full bg-red-30 px-2 text-black">ต่างจากเสียงส่วนใหญ่ในพรรค</span>
					{/if}
				{:else}
					{cellValue}
				{/if}
			</svelte:fragment>
		</DataPage>
	</div>

	<svelte:fragment slot="controls">
		<p class="p-2 font-bold">แนะนำให้กดอ่านในแท็บ Docs จะเข้าใจง่ายกว่า</p>
		<Hst.Json bind:value={data} title="(Const) Data" />
		<hr />
		<Hst.Json bind:value={breadcrumbList} title="(Prop) Breadcrumb List" />
		<Hst.Text bind:value={searchPlaceholder} title="(Prop) Search Placeholder" />
		<Hst.Json bind:value={checkboxFilterList} title="(Prop) Filter List" />
		<Hst.Json bind:value={tableHeader} title="(Prop) Table Header" />
		<Hst.Number bind:value={tablePageSize} title="(Prop) Table Page Size" />
		<hr />
		<Hst.Text bind:value={searchQuery} title="(Reactive) Search Query" />
		<Hst.Text bind:value={unit} title="(Prop) unit" />
		<section class="mb-2 border border-solid border-white p-2">
			<strong class="mb-2 block">Selected Filter?</strong>
			<pre class="border border-solid border-gray-50 p-2"><code
					>{JSON.stringify(selectedCheckboxValue, null, 2)}</code
				></pre>
		</section>
	</svelte:fragment>
</Hst.Story>
