<script lang="ts" context="module">
	export interface CheckboxFilterChoice {
		label: string;
		value: string | number | boolean;
	}

	export interface CheckboxFilterGroup {
		key: string;
		legend: string;
		choices: CheckboxFilterChoice[];
	}

	export type SelectedCheckboxValueType = Record<
		CheckboxFilterGroup['key'],
		CheckboxFilterChoice['value'][]
	>;

	export interface ComboboxFilterChoice {
		id: string | number;
		text: string;
	}

	export interface ComboboxFilterGroup {
		key: string;
		legend: string;
		placeholder: string;
		choices: ComboboxFilterChoice[];
	}

	export type SelectedComboboxValueType = Record<
		ComboboxFilterGroup['key'],
		ComboboxFilterChoice['id'] | undefined
	>;
</script>

<script lang="ts">
	import DownloadData from '$components/DownloadData/DownloadData.svelte';
	import type { Link } from '$models/link';
	import {
		Breadcrumb,
		BreadcrumbItem,
		Button,
		Checkbox,
		ComboBox,
		DataTable,
		DataTableSkeleton,
		FormGroup,
		Pagination,
		PaginationSkeleton,
		Search
	} from 'carbon-components-svelte';
	import Filter from 'carbon-icons-svelte/lib/Filter.svelte';
	import FilterEdit from 'carbon-icons-svelte/lib/FilterEdit.svelte';
	import Minimize from 'carbon-icons-svelte/lib/Minimize.svelte';
	import { onMount, tick } from 'svelte';

	function shouldFilterItem(item: { text: string }, value: undefined | string) {
		if (!value) return true;
		return item.text.toLowerCase().includes(value.toLowerCase());
	}

	// Just props
	export let breadcrumbList: {
		label: string;
		url?: string;
	}[];
	export let searchPlaceholder = 'ชื่อมติ หรือ คำที่เกี่ยวข้อง';
	export let comboboxFilterList: ComboboxFilterGroup[] = [];
	export let checkboxFilterList: CheckboxFilterGroup[];
	// Optimization Tips:
	// | On the grounds that each checkbox group can cover 100% of data,
	// | if some group of checkbox is empty, the result will be empty.
	// | This should be done to prevent unwanted calculation
	// ```
	// Object.values(selectedCheckboxValue).some(e => e.length === 0) ? [] : filteredData;
	// ```
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	export let filteredData: { id: any; [key: string]: any }[];
	export let tableHeader: { key: string; value: string }[];
	export let tablePageSize = 10;

	// For binding
	export let searchQuery = '';
	export let selectedComboboxValue: SelectedComboboxValueType = Object.fromEntries(
		comboboxFilterList.map((group) => [group.key, undefined])
	);
	export let selectedCheckboxValue: SelectedCheckboxValueType = Object.fromEntries(
		checkboxFilterList.map((group) => [group.key, group.choices.map((choice) => choice.value)])
	);
	export let mounted = false;
	export let downloadSize: 'sm' | 'lg' | 'otherPossibleValue' = 'sm';
	export let downloadLinks: Link[] = [];

	// Reactive
	let tableCurrentPage = 1;

	const filterTickAll = (value = true) => {
		selectedComboboxValue = Object.fromEntries(
			comboboxFilterList.map((group) => [group.key, undefined])
		);
		if (value) {
			selectedCheckboxValue = Object.fromEntries(
				checkboxFilterList.map((group) => [group.key, group.choices.map((choice) => choice.value)])
			);
		} else {
			selectedCheckboxValue = Object.fromEntries(
				checkboxFilterList.map((group) => [group.key, []])
			);
		}
	};

	$: checkboxFilterListCount = Object.values(checkboxFilterList).flatMap(
		({ choices }) => choices
	).length;

	$: isFilterNotDefault =
		searchQuery ||
		Object.values(selectedCheckboxValue).flat().length < checkboxFilterListCount ||
		Object.values(selectedComboboxValue).some((e) => e !== undefined);

	let comboboxInternal: Record<string, string> = {};
	let showFilter = true;
	let isMobile = false;
	onMount(() => {
		mounted = true;
		showFilter = window.matchMedia(`(min-width: 672px)`).matches;
		isMobile = !showFilter;
	});

	let previousFromTop = 0;
	let showHeader = true;
	function scrollEventHandler() {
		const currentFromTop = window.scrollY;
		showHeader = currentFromTop <= previousFromTop;
		previousFromTop = currentFromTop;
	}

	let renderCombobox = true;
	export const setCombobox = (key: string, value: string) => {
		comboboxInternal[key] = value;

		// Force combobox to evaluate internal value
		// When combobox rerendered, `select` event will auto fire
		renderCombobox = false;
		tick().then(() => {
			renderCombobox = true;
		});
	};
</script>

<svelte:window on:scroll|passive={scrollEventHandler} />

<div class="flex min-h-screen flex-col">
	<Breadcrumb
		noTrailingSlash
		class="body-compact-01 px-4 py-2 [&>.bx--breadcrumb]:flex [&>.bx--breadcrumb]:flex-wrap"
	>
		{#if isMobile}
			<BreadcrumbItem href={breadcrumbList[0].url}>{breadcrumbList[0].label}</BreadcrumbItem>
			{#if breadcrumbList.length > 2}
				<BreadcrumbItem>...</BreadcrumbItem>
			{/if}
			<BreadcrumbItem
				href={breadcrumbList[breadcrumbList.length - 1].url}
				isCurrentPage={breadcrumbList.length === 1}
			>
				{breadcrumbList[breadcrumbList.length - 1].label}
			</BreadcrumbItem>
		{:else}
			{#each breadcrumbList as breadcrumbItem, idx (breadcrumbItem.label)}
				<BreadcrumbItem href={breadcrumbItem.url} isCurrentPage={idx === breadcrumbList.length - 1}>
					{breadcrumbItem.label}
				</BreadcrumbItem>
			{/each}
		{/if}
	</Breadcrumb>
	<header class="bg-ui-01 px-4 py-3 md:px-16">
		<div class="flex flex-col gap-1 md:flex-row md:items-center md:gap-16">
			<div class="flex-1">
				<slot />
			</div>
			<div class="p-3 {downloadSize === 'lg' ? 'md:w-[224px]' : 'md:w-auto'}">
				<DownloadData links={downloadLinks} />
			</div>
			<Search
				class="md:hidden {!mounted ? '-mt-4' : ''}"
				searchClass="md:hidden mt-2"
				placeholder={searchPlaceholder}
				light
				bind:value={searchQuery}
				skeleton={!mounted}
			/>
		</div>
	</header>
	<div class="flex w-full flex-1 gap-1 bg-ui-01">
		{#if showFilter}
			<aside
				class="fixed top-0 z-50 flex h-screen w-full flex-[0_0_250px] flex-col overscroll-none bg-white md:sticky md:z-30 md:h-auto md:max-h-screen md:w-[250px]"
				class:md:flex={!mounted}
				class:hidden={!mounted}
			>
				<div
					class="sticky top-0 z-30 flex w-full bg-white pl-6 duration-300 md:top-12"
					class:md:top-12={showHeader}
				>
					<Search
						class="flex-1 {!mounted ? '-mt-6' : ''}"
						placeholder={searchPlaceholder}
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
				<div class="h-0 flex-[1_1_auto] overflow-y-scroll px-6 py-4">
					{#each comboboxFilterList as optionGroup (optionGroup.key)}
						<div class="mb-8">
							<ComboBox
								titleText={optionGroup.legend}
								placeholder={optionGroup.placeholder}
								on:select={(e) => (selectedComboboxValue[optionGroup.key] = e.detail.selectedId)}
								on:clear={() => (selectedComboboxValue[optionGroup.key] = undefined)}
								items={optionGroup.choices}
								disabled={!mounted || !renderCombobox}
								selectedId={comboboxInternal[optionGroup.key]}
								{shouldFilterItem}
							/>
						</div>
					{/each}
					{#each checkboxFilterList as optionGroup, idx (optionGroup.key)}
						<FormGroup
							legendText={optionGroup.legend}
							class={idx === checkboxFilterList.length - 1 ? 'mb-0' : ''}
						>
							{#each optionGroup.choices as choice (choice.label)}
								<Checkbox
									bind:group={selectedCheckboxValue[optionGroup.key]}
									value={choice.value}
									labelText={choice.label}
									skeleton={!mounted}
								/>
							{/each}
						</FormGroup>
					{/each}
				</div>
				<div class="body-compact-01 sticky bottom-0 flex space-x-[-1px] bg-white">
					<Button
						class="min-w-0 flex-[2_2_0%] pr-4"
						kind="tertiary"
						on:click={() => filterTickAll(false)}
						skeleton={!mounted}>ล้างตัวเลือก</Button
					>
					<Button
						class="min-w-0 flex-[2_2_0%] pr-4"
						kind={'tertiary' || 'secondary'}
						on:click={() => filterTickAll()}
						skeleton={!mounted}>เลือกทั้งหมด</Button
					>
					<Button
						class="min-w-0 flex-1 pr-4 md:hidden"
						on:click={() => {
							showFilter = false;
						}}
						skeleton={!mounted}>ดูที่เลือก</Button
					>
				</div>
			</aside>
		{/if}
		<div class="flex flex-1 flex-col bg-white">
			{#if mounted}
				<div class="overflow-x-auto overflow-y-hidden">
					<DataTable
						class="w-0 min-w-full pt-0"
						size="tall"
						headers={tableHeader}
						rows={filteredData}
						pageSize={tablePageSize}
						page={tableCurrentPage}
					>
						<svelte:fragment slot="cell-header" let:header>
							{#if header.key === 'files'}
								<span>เอก<br class="md:hidden" />สาร</span>
							{:else}
								{header.value}
							{/if}
						</svelte:fragment>
						<svelte:fragment slot="cell" let:cell let:row>
							<slot name="table" cellKey={cell.key} cellValue={cell.value} {row} />
						</svelte:fragment>
					</DataTable>
				</div>
				{#if filteredData.length === 0}
					<div
						class="body-compact-01 flex h-10 items-center border-b border-solid border-b-ui-03 px-4 text-gray-60"
					>
						ไม่พบข้อมูลที่ค้นหา
					</div>
				{/if}
				<div class="flex-1" />
				<div class="sticky bottom-0">
					{#if !showFilter}
						<Button
							class="m-4"
							tooltipAlignment="start"
							tooltipPosition="top"
							iconDescription="แสดงตัวเลือก"
							icon={isFilterNotDefault ? FilterEdit : Filter}
							kind={isFilterNotDefault ? 'secondary' : 'primary'}
							on:click={() => {
								showFilter = true;
							}}
							skeleton={!mounted}
						/>
					{/if}
					<Pagination
						class="overflow-x-hidden"
						pageSize={tablePageSize}
						bind:page={tableCurrentPage}
						totalItems={filteredData.length}
						pageSizeInputDisabled
						forwardText="หน้าถัดไป"
						backwardText="หน้าก่อนหน้า"
						itemRangeText={(min, max, total) => `${min} - ${max} จาก ${total} มติ`}
						pageRangeText={(_, total) => `จาก ${total} หน้า`}
					/>
				</div>
			{:else}
				<div class="overflow-x-auto overflow-y-hidden">
					<DataTableSkeleton
						class="w-0 min-w-full pt-0"
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
