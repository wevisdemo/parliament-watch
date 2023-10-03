<script lang="ts">
	import '../styles/carbon/pre-compiled.css';
	import '../styles/index.css';

	import type { Hst } from '@histoire/plugin-svelte';
	import DataPage, { type FilterGroup } from './DataPage.svelte';

	export let Hst: Hst;

	let data = Array(102).fill``.map((_, i) => ({
		name: 'Alvin Kiev',
		id: i,
		direction: i % 2 === 0
	}));
	let breadcrumbList: {
		label: string;
		url: string;
	}[] = [
		{ url: '/', label: 'หน้าหลัก' },
		{ url: '/votelog', label: 'ประวัติการลงมติ' }
	];
	let filterList: FilterGroup[] = [
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
		{ key: 'direction', value: 'ทิศทางการลงมติ' }
	];
	let tablePageSize = 10;
	let searchQuery = '';
	let selectedFilter = { filterVoteDirection: [false, true] };
	let isFilterSomeFalse: boolean;
	let isFilterAllFalse: boolean;
	let mounted: boolean;

	$: filteredData = data.filter((e) => selectedFilter.filterVoteDirection.includes(e.direction));
</script>

<Hst.Story title="Data Page" layout={{ type: 'single', iframe: true }}>
	<div class="font-sans body-02 bg-white">
		<DataPage
			{breadcrumbList}
			{filterList}
			{filteredData}
			{tableHeader}
			{tablePageSize}
			bind:searchQuery
			bind:selectedFilter
			bind:isFilterSomeFalse
			bind:isFilterAllFalse
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
		<Hst.Json bind:value={filterList} title="(Prop) Filter List" />
		<Hst.Json bind:value={tableHeader} title="(Prop) Table Header" />
		<Hst.Number bind:value={tablePageSize} title="(Prop) Table Page Size" />
		<hr />
		<Hst.Text bind:value={searchQuery} title="(Reactive) Search Query" />
		<section class="border border-white border-solid p-2 mb-2">
			<strong class="block mb-2">Selected Filter?</strong>
			<pre class="border border-gray-50 border-solid p-2"><code
					>{JSON.stringify(selectedFilter, null, 2)}</code
				></pre>
		</section>
		<section class="border border-white border-solid p-2 mb-2">
			<strong class="block mb-2">Is Some Filter False?</strong>
			<pre class="border border-gray-50 border-solid p-2"><code
					>{isFilterSomeFalse?.toString() ?? ''}</code
				></pre>
		</section>
		<section class="border border-white border-solid p-2 mb-2">
			<strong class="block mb-2">Is All Filter False?</strong>
			<pre class="border border-gray-50 border-solid p-2"><code
					>{isFilterAllFalse?.toString() ?? ''}</code
				></pre>
		</section>
		<section class="border border-white border-solid p-2 mb-2">
			<strong class="block mb-2">Is Component Mounted?</strong>
			<pre class="border border-gray-50 border-solid p-2"><code>{mounted?.toString() ?? ''}</code
				></pre>
		</section>
	</svelte:fragment>
</Hst.Story>
