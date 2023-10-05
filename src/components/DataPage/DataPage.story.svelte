<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	import DataPage, {
		type SelectedComboboxValueType,
		type CheckboxFilterGroup,
		type ComboboxFilterGroup,
		type SelectedCheckboxValueType
	} from './DataPage.svelte';

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
	let comboboxFilterList: ComboboxFilterGroup[] = [
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
	let checkboxFilterList: CheckboxFilterGroup[] = [
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
	let selectedCheckboxValue: SelectedCheckboxValueType;
	let selectedComboboxValue: SelectedComboboxValueType;
	let mounted: boolean;

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
</script>

<Hst.Story title="Data Page" layout={{ type: 'single', iframe: true }}>
	<div class="font-sans body-02 bg-white">
		<DataPage
			{breadcrumbList}
			{comboboxFilterList}
			{checkboxFilterList}
			{filteredData}
			{tableHeader}
			{tablePageSize}
			bind:searchQuery
			bind:selectedCheckboxValue
			bind:selectedComboboxValue
			bind:mounted
		>
			<h1 class="fluid-heading-03">ประวัติการลงมติ</h1>
			<svelte:fragment slot="table" let:cellKey let:cellValue>
				{#if cellKey === 'direction'}
					{#if cellValue}
						<span class="bg-teal-30 rounded-full px-2 text-black">ตามเสียงส่วนใหญ่ในพรรค</span>
					{:else}
						<span class="bg-red-30 rounded-full px-2 text-black">ต่างจากเสียงส่วนใหญ่ในพรรค</span>
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
		<Hst.Json bind:value={checkboxFilterList} title="(Prop) Filter List" />
		<Hst.Json bind:value={tableHeader} title="(Prop) Table Header" />
		<Hst.Number bind:value={tablePageSize} title="(Prop) Table Page Size" />
		<hr />
		<Hst.Text bind:value={searchQuery} title="(Reactive) Search Query" />
		<section class="border border-white border-solid p-2 mb-2">
			<strong class="block mb-2">Selected Filter?</strong>
			<pre class="border border-gray-50 border-solid p-2"><code
					>{JSON.stringify(selectedCheckboxValue, null, 2)}</code
				></pre>
		</section>
		<section class="border border-white border-solid p-2 mb-2">
			<strong class="block mb-2">Is Component Mounted?</strong>
			<pre class="border border-gray-50 border-solid p-2"><code>{mounted?.toString() ?? ''}</code
				></pre>
		</section>
	</svelte:fragment>
</Hst.Story>
