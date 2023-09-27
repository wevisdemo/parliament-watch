<script lang="ts">
	import { page } from '$app/stores';
	import VotingResultTag from '$components/politicians/VotingResultTag.svelte';
	import VotingOptionTag from '$components/politicians/VotingOptionTag.svelte';
	import {
		Breadcrumb,
		BreadcrumbItem,
		Button,
		Checkbox,
		DataTable,
		FormGroup,
		InlineNotification,
		Pagination,
		Search
	} from 'carbon-components-svelte';
	import DocumentPdf from 'carbon-icons-svelte/lib/DocumentPdf.svelte';
	import Download from 'carbon-icons-svelte/lib/Download.svelte';
	import Filter from 'carbon-icons-svelte/lib/Filter.svelte';
	import FilterEdit from 'carbon-icons-svelte/lib/FilterEdit.svelte';
	import Minimize from 'carbon-icons-svelte/lib/Minimize.svelte';
	import TableSplit from 'carbon-icons-svelte/lib/TableSplit.svelte';
	import { onMount } from 'svelte';

	export let data;
	const { politician, votings } = data;

	let tablePageSize = 10;
	let tableCurrentPage = 1;

	let searchQuery = '';
	let showFilter = true;
	let filterCheckbox: Record<string, boolean> = {
		'era-25': true,
		'era-26': true,
		'votetype-agreed': true,
		'votetype-disagreed': true,
		'votetype-novote': true,
		'votetype-abstain': true,
		'votetype-absent': true,
		'votetype-other': true,
		'votedirection-different': true,
		'votedirection-follow': true,
		'category-เศรษฐกิจ': true,
		'category-ขนส่งสาธารณะ': true,
		'category-แก้รัฐธรรมนูญ': true,
		'category-ที่อยู่อาศัย': true,
		'category-สวัสดิการ': true,
		'category-การศึกษา': true,
		'category-สิ่งแวดล้อม': true,
		'category-สังคม': true
	};

	const filterTickAll = (value = true) => {
		for (let k in filterCheckbox) {
			filterCheckbox[k] = value;
		}
	};

	$: isFilterSomeFalse = Object.values(filterCheckbox).some((e) => e === false);
	$: isFilterAllFalse = Object.values(filterCheckbox).every((e) => e === false);

	let mounted = false;
	onMount(() => {
		mounted = true;
		showFilter = window.matchMedia(`(min-width: 672px)`).matches;
		switch ($page.url.searchParams.get('votetype')) {
			case 'agreed':
				filterCheckbox['votetype-disagreed'] = false;
				filterCheckbox['votetype-novote'] = false;
				filterCheckbox['votetype-abstain'] = false;
				filterCheckbox['votetype-absent'] = false;
				filterCheckbox['votetype-other'] = false;
				break;
			case 'disagreed':
				filterCheckbox['votetype-agreed'] = false;
				filterCheckbox['votetype-novote'] = false;
				filterCheckbox['votetype-abstain'] = false;
				filterCheckbox['votetype-absent'] = false;
				filterCheckbox['votetype-other'] = false;
				break;
			case 'absent':
				filterCheckbox['votetype-agreed'] = false;
				filterCheckbox['votetype-disagreed'] = false;
				filterCheckbox['votetype-novote'] = false;
				filterCheckbox['votetype-abstain'] = false;
				filterCheckbox['votetype-other'] = false;
				break;
		}
	});
</script>

<div class="flex flex-col min-h-screen">
	<Breadcrumb
		noTrailingSlash
		class="px-4 py-2 body-compact-01 [&>.bx--breadcrumb]:flex [&>.bx--breadcrumb]:flex-wrap"
	>
		<BreadcrumbItem href="/">หน้าหลัก</BreadcrumbItem>
		<BreadcrumbItem href="/politicians/{politician.id}">{politician.firstname}</BreadcrumbItem>
		<BreadcrumbItem href="/politicians/{politician.id}/votelog" isCurrentPage
			>ประวัติการลงมติ</BreadcrumbItem
		>
	</Breadcrumb>
	<header class="px-4 py-3 bg-ui-01 md:px-16">
		<p class="heading-01">ประวัติการลงมติ</p>
		<h1 class="fluid-heading-03 mb-1">
			<a class="no-underline text-black hover:text-blue-70" href="/politicians/{politician.id}"
				>{politician.prefix} {politician.firstname} {politician.lastname}</a
			>
		</h1>
		<div class="flex flex-col gap-1 md:flex-row md:gap-16">
			<div class="flex-1">
				<InlineNotification
					slot="header-extension"
					class="h-full m-0 min-w-0 max-w-none"
					lowContrast
					kind="info"
					subtitle="การประเมินพฤติกรรมการลงมติ จะพิจารณาเพียงชื่อมติไม่ได้ ควรศึกษาเนื้อหาของมตินั้นๆ ประกอบด้วย"
				/>
			</div>
			<div class="flex flex-col gap-2 border border-solid border-ui-03 rounded-sm p-3">
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
			searchClass="md:hidden mt-2"
			placeholder="ชื่อมติ หรือ คำที่เกี่ยวข้อง"
			light
			bind:value={searchQuery}
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
						class="flex-1"
						placeholder="ชื่อมติ หรือ คำที่เกี่ยวข้อง"
						light
						bind:value={searchQuery}
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
					/>
				</div>
				<div class="flex-[1_1_auto] h-0 overflow-y-scroll py-4 px-6">
					<FormGroup legendText="สมัยการทำงาน">
						<Checkbox
							bind:checked={filterCheckbox['era-26']}
							labelText="สภาผู้แทนราษฎรชุดที่ 26 (2566 - ปัจจุบัน)"
						/>
						<Checkbox
							bind:checked={filterCheckbox['era-25']}
							labelText="สภาผู้แทนราษฎรชุดที่ 25 (2563 - 2566)"
						/>
					</FormGroup>
					<FormGroup legendText="ประเภทการลงมติ">
						<Checkbox bind:checked={filterCheckbox['votetype-agreed']} labelText="เห็นด้วย (xxx)" />
						<Checkbox
							bind:checked={filterCheckbox['votetype-disagreed']}
							labelText="ไม่เห็นด้วย (xxx)"
						/>
						<Checkbox
							bind:checked={filterCheckbox['votetype-novote']}
							labelText="งดออกเสียง (xxx)"
						/>
						<Checkbox
							bind:checked={filterCheckbox['votetype-abstain']}
							labelText="ไม่ลงคะแนน (xxx)"
						/>
						<Checkbox
							bind:checked={filterCheckbox['votetype-absent']}
							labelText="ลา/ขาดประชุม (xxx)"
						/>
						<Checkbox bind:checked={filterCheckbox['votetype-other']} labelText="อื่นๆ (xxx)" />
					</FormGroup>
					<FormGroup legendText="เงื่อนไขพิเศษ">
						<Checkbox
							bind:checked={filterCheckbox['votedirection-different']}
							labelText="ลงมติต่างจากเสียงส่วนใหญ่ในพรรค (xxx)"
						/>
						<Checkbox
							bind:checked={filterCheckbox['votedirection-follow']}
							labelText="ลงมติเหมือนเสียงส่วนใหญ่ในพรรค (xxx)"
						/>
					</FormGroup>
					<FormGroup legendText="หมวดมติ (1&nbsp;มติ มีได้มากกว่า 1&nbsp;หมวด)" class="mb-0">
						<Checkbox
							labelText="เศรษฐกิจ (xxx)"
							bind:checked={filterCheckbox['category-เศรษฐกิจ']}
						/>
						<Checkbox
							labelText="ขนส่งสาธารณะ (xxx)"
							bind:checked={filterCheckbox['category-ขนส่งสาธารณะ']}
						/>
						<Checkbox
							labelText="แก้รัฐธรรมนูญ (xxx)"
							bind:checked={filterCheckbox['category-แก้รัฐธรรมนูญ']}
						/>
						<Checkbox
							labelText="ที่อยู่อาศัย (xxx)"
							bind:checked={filterCheckbox['category-ที่อยู่อาศัย']}
						/>
						<Checkbox
							labelText="สวัสดิการ (xxx)"
							bind:checked={filterCheckbox['category-สวัสดิการ']}
						/>
						<Checkbox
							labelText="การศึกษา (xxx)"
							bind:checked={filterCheckbox['category-การศึกษา']}
						/>
						<Checkbox
							labelText="สิ่งแวดล้อม (xxx)"
							bind:checked={filterCheckbox['category-สิ่งแวดล้อม']}
						/>
						<Checkbox labelText="สังคม (xxx)" bind:checked={filterCheckbox['category-สังคม']} />
					</FormGroup>
				</div>
				<div class="flex gap-[1px] sticky bottom-0 body-compact-01 bg-white">
					{#if isFilterAllFalse}
						<Button class="flex-1 min-w-0 pr-4" kind="secondary" on:click={() => filterTickAll()}
							>เลือกทั้งหมด</Button
						>
					{:else}
						<Button
							class="flex-1 min-w-0 pr-4"
							kind="tertiary"
							on:click={() => filterTickAll(false)}>ล้างตัวเลือก</Button
						>
					{/if}
					<Button
						class="flex-1 min-w-0 pr-4 md:hidden"
						on:click={() => {
							showFilter = false;
						}}>ดูที่เลือก</Button
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
				/>
			</div>
		{/if}
		<div class="flex-1 flex flex-col bg-white">
			<div class="overflow-x-auto overflow-y-hidden">
				<DataTable
					class="pt-0 w-0 min-w-full"
					size="tall"
					headers={[
						{ key: 'date', value: 'วันที่' },
						{ key: 'title', value: 'ชื่อมติ' },
						{ key: 'voteOption', value: 'การลงมติ' },
						{ key: 'result', value: 'ผลลัพธ์' },
						{ key: 'files', value: 'เอกสาร' }
					]}
					rows={votings}
					pageSize={tablePageSize}
					page={tableCurrentPage}
				>
					<svelte:fragment slot="cell" let:cell>
						{#if cell.key === 'date'}
							{cell.value.toLocaleDateString('th-TH', {
								day: 'numeric',
								month: 'short',
								year: '2-digit'
							})}
						{:else if cell.key === 'title'}
							<!-- TODO: Add link -->
							<a class="text-text-01" href="/">{cell.value}</a>
						{:else if cell.key === 'result'}
							<VotingResultTag class="m-0 whitespace-nowrap" result={cell.value} />
						{:else if cell.key === 'voteOption'}
							<VotingOptionTag voteOption={cell.value} />
						{:else if cell.key === 'files'}
							{@const files = cell.value}
							{#if files.length > 0}
								{#each files as file (file)}
									<a href={file.url} download title={file.label}
										><DocumentPdf /><span class="sr-only">{file.label}</span></a
									>
								{/each}
							{:else}
								-
							{/if}
						{:else}
							{cell.value}
						{/if}
					</svelte:fragment>
				</DataTable>
			</div>
			{#if votings.length === 0}
				<div
					class="h-10 body-compact-01 text-gray-60 px-4 flex items-center border-solid border-b border-b-ui-03"
				>
					ไม่พบข้อมูลที่ค้นหา
				</div>
			{/if}
			<div class="flex-1" />
			<Pagination
				class="sticky bottom-0 overflow-x-hidden"
				bind:pageSize={tablePageSize}
				bind:page={tableCurrentPage}
				totalItems={votings.length}
				pageSizeInputDisabled
				forwardText="หน้าถัดไป"
				backwardText="หน้าก่อนหน้า"
				itemRangeText={(min, max, total) => `${min} – ${max} จาก ${total} มติ`}
				pageRangeText={(_, total) => `จาก ${total} หน้า`}
			/>
		</div>
	</div>
</div>
