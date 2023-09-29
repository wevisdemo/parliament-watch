<script lang="ts">
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
					extension: 50,
					value: false
				},
				{
					label: 'ลงมติเหมือนเสียงส่วนใหญ่ในพรรค',
					extension: 50,
					value: true
				}
			]
		}
	];
	let tableHeader: { key: string; value: string }[] = [
		{ key: 'name', value: 'ชื่อ' },
		{ key: 'direction', value: 'ทิศทางการลงมติ' }
	];
	let searchQuery = '';
	let selectedFilter = { filterVoteDirection: [false, true] };
	let isFilterSomeFalse: boolean;
	let isFilterAllFalse: boolean;
	let mounted: boolean;

	$: filteredData = data.filter((e) => selectedFilter.filterVoteDirection.includes(e.direction));
</script>

<Hst.Story title="Data Page" layout={{ type: 'single', iframe: true }}>
	<DataPage
		{breadcrumbList}
		{filterList}
		{filteredData}
		{tableHeader}
		bind:searchQuery
		bind:selectedFilter
		bind:isFilterSomeFalse
		bind:isFilterAllFalse
		bind:mounted
	>
		<p class="heading-01">ประวัติการลงมติ</p>
		<svelte:fragment slot="table" let:cellKey let:cellValue>
			{#if cellKey === 'direction'}
				{#if cellValue}
					<span class="bg-teal-30">ตามเสียงส่วนใหญ่ในพรรค</span>
				{:else}
					<span class="bg-red-30">ต่างจากเสียงส่วนใหญ่ในพรรค</span>
				{/if}
			{:else}
				{cellValue}
			{/if}
		</svelte:fragment>
	</DataPage>

	<svelte:fragment slot="controls">
		<Hst.Json bind:value={data} title="(Const) Data" />
		<Hst.Json bind:value={breadcrumbList} title="(Prop) Breadcrumb List" />
		<Hst.Json bind:value={filterList} title="(Prop) Filter List" />
		<Hst.Json bind:value={tableHeader} title="(Prop) Table Header" />
		<Hst.Text bind:value={searchQuery} title="(Reactive) Search Query" />
		<section>
			<strong>Selected Filter</strong><br />
			<pre><code>{JSON.stringify(selectedFilter, null, 2)}</code></pre>
		</section>
		<section>
			<strong>Is Some Filter False</strong><br />
			<pre><code>{isFilterSomeFalse?.toString() ?? ''}</code></pre>
		</section>
		<section>
			<strong>Is All Filter False</strong><br />
			<pre><code>{isFilterAllFalse?.toString() ?? ''}</code></pre>
		</section>
		<section>
			<strong>Is Component Mounted</strong><br />
			<pre><code>{mounted?.toString() ?? ''}</code></pre>
		</section>
	</svelte:fragment>
</Hst.Story>
