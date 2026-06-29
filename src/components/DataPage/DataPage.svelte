<script lang="ts" module>
	interface ComboBoxItem {
		id: string | number;
		text: string;
		disabled?: boolean;
		icon?: unknown;
	}

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

	export interface ComboboxFilterChoice extends ComboBoxItem {
		id: string | number;
		text: string;
		imageSrc?: string;
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
	import LinkTable from '$components/LinkTable/LinkTable.svelte';
	import {
		Breadcrumb,
		BreadcrumbItem,
		Button,
		Checkbox,
		ComboBox,
		DataTable,
		FormGroup,
		Pagination,
		Search
	} from 'carbon-components-svelte';
	import Filter from 'carbon-icons-svelte/lib/Filter.svelte';
	import FilterEdit from 'carbon-icons-svelte/lib/FilterEdit.svelte';
	import Minimize from 'carbon-icons-svelte/lib/Minimize.svelte';
	import { onMount, tick, type ComponentProps } from 'svelte';

	function shouldFilterItem(item: { text: string }, value: undefined | string) {
		if (!value) return true;
		return item.text.toLowerCase().includes(value.toLowerCase());
	}

	function hasImageSrc(item: ComboBoxItem): item is ComboboxFilterChoice {
		return 'imageSrc' in item;
	}

	// Optimization Tips:
	// | On the grounds that each checkbox group can cover 100% of data,
	// | if some group of checkbox is empty, the result will be empty.
	// | This should be done to prevent unwanted calculation
	// ```
	// Object.values(selectedCheckboxValue).some(e => e.length === 0) ? [] : filteredData;
	// ```

	// Reactive
	let tableCurrentPage = $state(1);

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

	let comboboxInternal: Record<string, string> = $state({});
	let showFilter = $state(true);
	let isMobile = $state(false);

	onMount(() => {
		showFilter = window.matchMedia(`(min-width: 672px)`).matches;
		isMobile = !showFilter;
	});

	let previousFromTop = 0;
	let showHeader = $state(true);
	function scrollEventHandler() {
		const currentFromTop = window.scrollY;
		showHeader = currentFromTop <= previousFromTop;
		previousFromTop = currentFromTop;
	}

	let renderCombobox = $state(true);
	export const setCombobox = (key: string, value: string) => {
		comboboxInternal[key] = value;

		// Force combobox to evaluate internal value
		// When combobox rerendered, `select` event will auto fire
		renderCombobox = false;
		tick().then(() => {
			renderCombobox = true;
		});
	};

	interface Props {
		// Just props
		breadcrumbList: {
			label: string;
			url?: string;
		}[];
		searchPlaceholder?: string;
		comboboxFilterList?: ComboboxFilterGroup[];
		checkboxFilterList: CheckboxFilterGroup[];
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		filteredData: { id: any; [key: string]: any }[];
		tableHeader: { key: string; value: string }[];
		tablePageSize?: number;
		// For binding
		searchQuery?: string;
		selectedComboboxValue?: SelectedComboboxValueType;
		selectedCheckboxValue?: SelectedCheckboxValueType;
		downloadSize?: 'sm' | 'lg' | 'otherPossibleValue';
		downloadLinks?: ComponentProps<typeof LinkTable>['links'];
		unit?: string;
		children?: import('svelte').Snippet;
		/* eslint-disable @typescript-eslint/no-explicit-any */
		table?: import('svelte').Snippet<
			[{ cellKey: string; cellValue: any; row: Record<string, any> }]
		>;
		/* eslint-enable @typescript-eslint/no-explicit-any */
	}

	let {
		breadcrumbList,
		searchPlaceholder = 'ชื่อมติ หรือ คำที่เกี่ยวข้อง',
		comboboxFilterList = [],
		checkboxFilterList,
		filteredData,
		tableHeader,
		tablePageSize = 10,
		searchQuery = $bindable(''),
		selectedComboboxValue = $bindable(
			Object.fromEntries(comboboxFilterList.map((group) => [group.key, undefined]))
		),
		selectedCheckboxValue = $bindable(
			Object.fromEntries(
				checkboxFilterList.map((group) => [group.key, group.choices.map((choice) => choice.value)])
			)
		),
		downloadSize = 'sm',
		downloadLinks = [],
		unit = 'มติ',
		children,
		table
	}: Props = $props();
	let checkboxFilterListCount = $derived(
		Object.values(checkboxFilterList).flatMap(({ choices }) => choices).length
	);
	let isFilterNotDefault = $derived(
		searchQuery ||
			Object.values(selectedCheckboxValue).flat().length < checkboxFilterListCount ||
			Object.values(selectedComboboxValue).some((e) => e !== undefined)
	);
</script>

<svelte:window onscroll={scrollEventHandler} />

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
				{@render children?.()}
			</div>
			<div class="p-3 {downloadSize === 'lg' ? 'md:w-[224px]' : 'md:w-auto'}">
				<LinkTable links={downloadLinks} />
			</div>
			<Search
				class="md:hidden"
				searchClass="md:hidden mt-2"
				placeholder={searchPlaceholder}
				light
				bind:value={searchQuery}
			/>
		</div>
	</header>
	<div class="flex w-full flex-1 gap-1 bg-ui-01">
		{#if showFilter}
			<aside
				class="fixed top-0 z-50 flex h-screen w-full flex-[0_0_250px] flex-col overscroll-none bg-white md:sticky md:z-30 md:h-auto md:max-h-screen md:w-[250px]"
			>
				<div
					class="sticky top-0 z-30 flex w-full bg-white pl-6 duration-300 md:top-12"
					class:md:top-12={showHeader}
				>
					<Search class="flex-1" placeholder={searchPlaceholder} light bind:value={searchQuery} />
					<Button
						kind="ghost"
						icon={Minimize}
						iconDescription="ซ่อนตัวเลือก"
						tooltipPosition="right"
						tooltipAlignment="end"
						on:click={() => {
							showFilter = false;
						}}
					/>
				</div>
				<div class="h-0 flex-[1_1_auto] overflow-y-scroll px-6 py-4">
					{#each comboboxFilterList as optionGroup (optionGroup.key)}
						<div class="mb-8">
							<ComboBox
								labelText={optionGroup.legend}
								placeholder={optionGroup.placeholder}
								on:select={(e) => (selectedComboboxValue[optionGroup.key] = e.detail.selectedId)}
								on:clear={() => (selectedComboboxValue[optionGroup.key] = undefined)}
								items={optionGroup.choices}
								disabled={!renderCombobox}
								selectedId={comboboxInternal[optionGroup.key]}
								{shouldFilterItem}
							>
								{#snippet children({ item })}
									<div class="flex">
										{#if hasImageSrc(item)}
											<img
												src={item.imageSrc}
												alt={item.text}
												style="width: 16px; height: 16px; border-radius: 50%; margin-right: 8px;"
											/>
										{/if}
										{item.text}
									</div>
								{/snippet}
							</ComboBox>
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
								/>
							{/each}
						</FormGroup>
					{/each}
				</div>
				<div class="body-compact-01 sticky bottom-0 flex space-x-[-1px] bg-white">
					<Button
						class="min-w-0 flex-[2_2_0%] pr-4"
						kind="tertiary"
						on:click={() => filterTickAll(false)}>ล้างตัวเลือก</Button
					>
					<Button
						class="min-w-0 flex-[2_2_0%] pr-4"
						kind="tertiary"
						on:click={() => filterTickAll()}>เลือกทั้งหมด</Button
					>
					<Button
						class="min-w-0 flex-1 pr-4 md:hidden"
						on:click={() => {
							showFilter = false;
						}}>ดูที่เลือก</Button
					>
				</div>
			</aside>
		{/if}
		<div class="flex flex-1 flex-col bg-white">
			<div class="overflow-x-auto overflow-y-hidden">
				<DataTable
					class="w-0 min-w-full pt-0"
					size="tall"
					headers={tableHeader}
					rows={filteredData}
					pageSize={tablePageSize}
					page={tableCurrentPage}
				>
					{#snippet cellHeader({ header })}
						{#if header.key === 'files'}
							<span>เอก<br class="md:hidden" />สาร</span>
						{:else}
							{header.value}
						{/if}
					{/snippet}
					{#snippet cell({ cell, row })}
						{@render table?.({ cellKey: cell.key, cellValue: cell.value, row })}
					{/snippet}
				</DataTable>
			</div>
			{#if filteredData.length === 0}
				<div
					class="body-compact-01 flex h-10 items-center border-b border-solid border-b-ui-03 px-4 text-gray-60"
				>
					ไม่พบข้อมูลที่ค้นหา
				</div>
			{/if}
			<div class="flex-1"></div>
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
					itemRangeText={(min, max, total) => `${min} - ${max} จาก ${total} ${unit}`}
					pageRangeText={(_, total) => `จาก ${total} หน้า`}
				/>
			</div>
		</div>
	</div>
</div>
