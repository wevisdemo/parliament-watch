<script lang="ts" context="module">
	export interface FilterChoice {
		label: string;
		value: string | number | boolean;
	}

	export interface FilterGroup {
		key: string;
		legend: string;
		choices: FilterChoice[];
	}

	export type SelectedFilterType = Record<FilterGroup['key'], FilterChoice['value'][]>;
</script>

<script lang="ts">
	import {
		Breadcrumb,
		BreadcrumbItem,
		Button,
		Checkbox,
		DataTable,
		DataTableSkeleton,
		FormGroup,
		Pagination,
		PaginationSkeleton,
		Search
	} from 'carbon-components-svelte';
	import Download from 'carbon-icons-svelte/lib/Download.svelte';
	import Filter from 'carbon-icons-svelte/lib/Filter.svelte';
	import FilterEdit from 'carbon-icons-svelte/lib/FilterEdit.svelte';
	import Minimize from 'carbon-icons-svelte/lib/Minimize.svelte';
	import TableSplit from 'carbon-icons-svelte/lib/TableSplit.svelte';
	import { onMount } from 'svelte';

	// Just props
	export let breadcrumbList: {
		label: string;
		url: string;
	}[];
	export let filterList: FilterGroup[];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	export let filteredData: { id: any; [key: string]: any }[];
	export let tableHeader: { key: string; value: string }[];
	export let tablePageSize = 10;

	// For binding
	export let searchQuery = '';
	export let selectedFilter: SelectedFilterType = Object.fromEntries(
		filterList.map((group) => [group.key, group.choices.map((choice) => choice.value)])
	);
	export let isFilterSomeFalse = false;
	export let isFilterAllFalse = false;
	export let mounted = false;

	// Reactive
	let tableCurrentPage = 1;

	const ALL_FILTER_COUNT = Object.values(filterList)
		.map((e) => e.choices.length)
		.reduce((a, c) => a + c);

	const filterTickAll = (value = true) => {
		if (value) {
			selectedFilter = Object.fromEntries(
				filterList.map((group) => [group.key, group.choices.map((choice) => choice.value)])
			);
		} else {
			selectedFilter = Object.fromEntries(filterList.map((group) => [group.key, []]));
		}
	};

	$: tickedFilterCount = Object.values(selectedFilter)
		.map((e) => e.length)
		.reduce((a, c) => a + c);
	$: isFilterSomeFalse = tickedFilterCount < ALL_FILTER_COUNT;
	$: isFilterAllFalse = tickedFilterCount === 0;

	let showFilter = true;
	onMount(() => {
		mounted = true;
		showFilter = window.matchMedia(`(min-width: 672px)`).matches;
	});
</script>

<div class="flex flex-col min-h-screen">
	<Breadcrumb
		noTrailingSlash
		class="px-4 py-2 body-compact-01 [&>.bx--breadcrumb]:flex [&>.bx--breadcrumb]:flex-wrap"
	>
		{#each breadcrumbList as breadcrumbItem, idx (breadcrumbItem.url)}
			<BreadcrumbItem href={breadcrumbItem.url} isCurrentPage={idx === breadcrumbList.length - 1}
				>{breadcrumbItem.label}</BreadcrumbItem
			>
		{/each}
	</Breadcrumb>
	<header class="px-4 py-3 bg-ui-01 md:px-16">
		<div class="flex flex-col gap-1 md:flex-row md:gap-16 md:items-center">
			<div class="flex-1">
				<slot />
			</div>
			<div class="flex flex-col gap-2 border border-solid border-ui-03 rounded-sm p-3 md:self-end">
				<div class="flex items-center gap-1">
					<Download />
					<h2 class="heading-01">ดาวน์โหลดข้อมูล</h2>
				</div>
				<!-- TODO: add link -->
				<a href="/" class="flex items-center gap-1 mr-auto helper-text-01">
					<TableSplit />
					<span>ผลการลงมติรายคน</span>
				</a>
			</div>
		</div>
		<Search
			class="md:hidden {!mounted ? '-mt-4' : ''}"
			searchClass="md:hidden mt-2"
			placeholder="ชื่อมติ หรือ คำที่เกี่ยวข้อง"
			light
			bind:value={searchQuery}
			skeleton={!mounted}
		/>
	</header>
	<div class="flex-1 flex gap-1 bg-ui-01 w-full">
		{#if showFilter}
			<div
				class="fixed w-full h-screen md:h-auto md:max-h-screen overscroll-none md:sticky top-0 flex flex-col bg-white md:w-[250px] flex-[0_0_250px] z-10"
				class:md:flex={!mounted}
				class:hidden={!mounted}
			>
				<div class="sticky top-0 flex w-full pl-6">
					<Search
						class="flex-1 {!mounted ? '-mt-6' : ''}"
						placeholder="ชื่อมติ หรือ คำที่เกี่ยวข้อง"
						light
						bind:value={searchQuery}
						skeleton={!mounted}
					/>
					<Button
						kind="ghost"
						icon={Minimize}
						iconDescription="ซ่อนตัวเลือก"
						tooltipPosition="right"
						tooltipAlignment="end"
						on:click={() => {
							showFilter = false;
						}}
						skeleton={!mounted}
					/>
				</div>
				<div class="flex-[1_1_auto] h-0 overflow-y-scroll py-4 px-6">
					{#each filterList as optionGroup, idx (optionGroup.key)}
						<FormGroup
							legendText={optionGroup.legend}
							class={idx === filterList.length - 1 ? 'mb-0' : ''}
						>
							{#each optionGroup.choices as choice (choice.label)}
								<Checkbox
									bind:group={selectedFilter[optionGroup.key]}
									value={choice.value}
									labelText={choice.label}
									skeleton={!mounted}
								/>
							{/each}
						</FormGroup>
					{/each}
				</div>
				<div class="flex gap-[1px] sticky bottom-0 body-compact-01 bg-white">
					<Button
						class="flex-[2_2_0%] min-w-0 pr-4"
						kind="tertiary"
						on:click={() => filterTickAll(false)}
						skeleton={!mounted}>ล้างตัวเลือก</Button
					>
					<Button
						class="flex-[2_2_0%] min-w-0 pr-4"
						kind={'tertiary' || 'secondary'}
						on:click={() => filterTickAll()}
						skeleton={!mounted}>เลือกทั้งหมด</Button
					>
					<Button
						class="flex-1 min-w-0 pr-4 md:hidden"
						on:click={() => {
							showFilter = false;
						}}
						skeleton={!mounted}>ดูที่เลือก</Button
					>
				</div>
			</div>
		{:else}
			<div class="fixed left-4 bottom-14 z-20">
				<Button
					tooltipAlignment="start"
					tooltipPosition="top"
					iconDescription="แสดงตัวเลือก"
					icon={isFilterSomeFalse ? FilterEdit : Filter}
					kind={isFilterSomeFalse ? 'secondary' : 'primary'}
					on:click={() => {
						showFilter = true;
					}}
					skeleton={!mounted}
				/>
			</div>
		{/if}
		<div class="flex-1 flex flex-col bg-white">
			{#if mounted}
				<div class="overflow-x-auto overflow-y-hidden">
					<DataTable
						class="pt-0 w-0 min-w-full"
						size="tall"
						headers={tableHeader}
						rows={filteredData}
						pageSize={tablePageSize}
						page={tableCurrentPage}
					>
						<svelte:fragment slot="cell" let:cell>
							<slot name="table" cellKey={cell.key} cellValue={cell.value} />
						</svelte:fragment>
					</DataTable>
				</div>
				{#if filteredData.length === 0}
					<div
						class="h-10 body-compact-01 text-gray-60 px-4 flex items-center border-solid border-b border-b-ui-03"
					>
						ไม่พบข้อมูลที่ค้นหา
					</div>
				{/if}
				<div class="flex-1" />
				<Pagination
					class="sticky bottom-0 overflow-x-hidden"
					pageSize={tablePageSize}
					bind:page={tableCurrentPage}
					totalItems={filteredData.length}
					pageSizeInputDisabled
					forwardText="หน้าถัดไป"
					backwardText="หน้าก่อนหน้า"
					itemRangeText={(min, max, total) => `${min} – ${max} จาก ${total} มติ`}
					pageRangeText={(_, total) => `จาก ${total} หน้า`}
				/>
			{:else}
				<div class="overflow-x-auto overflow-y-hidden">
					<DataTableSkeleton
						class="pt-0 w-0 min-w-full"
						size="tall"
						headers={tableHeader}
						rows={10}
						showHeader={false}
						showToolbar={false}
					/>
				</div>
				<div class="flex-1" />
				<PaginationSkeleton />
			{/if}
		</div>
	</div>
</div>
