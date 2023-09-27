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
	import { DefaultVoteOption } from '$models/voting.js';

	export let data;
	const { politician, filterOptions, votings } = data;

	const VOTEOPTIONS = [
		DefaultVoteOption.Agreed,
		DefaultVoteOption.Disagreed,
		DefaultVoteOption.Novote,
		DefaultVoteOption.Abstain,
		DefaultVoteOption.Absent,
		'อื่นๆ'
	];
	const VOTEDIRECTIONS = ['ลงมติต่างจากเสียงส่วนใหญ่ในพรรค', 'ลงมติเหมือนเสียงส่วนใหญ่ในพรรค'];

	const FILTER_ASSEMBLY_DEFAULT = filterOptions.assemblies.map((e) => e.id);
	const FILTER_VOTETYPE_DEFAULT = [...VOTEOPTIONS];
	const FILTER_VOTEDIRECTION_DEFAULT = [...VOTEDIRECTIONS];
	const FILTER_CATEGORY_DEFAULT = filterOptions.categories;
	$: ALL_FILTER_COUNT =
		FILTER_ASSEMBLY_DEFAULT.length +
		FILTER_VOTETYPE_DEFAULT.length +
		FILTER_VOTEDIRECTION_DEFAULT.length +
		FILTER_CATEGORY_DEFAULT.length;

	let tablePageSize = 10;
	let tableCurrentPage = 1;

	let searchQuery = '';
	let showFilter = true;
	let filterAssembly: string[] = [...FILTER_ASSEMBLY_DEFAULT];
	let filterVoteType: string[] = [...FILTER_VOTETYPE_DEFAULT];
	let filterVoteDirection: string[] = [...FILTER_VOTEDIRECTION_DEFAULT];
	let filterCatg: string[] = [...FILTER_CATEGORY_DEFAULT];
	$: tickedFilterCount =
		filterAssembly.length + filterVoteType.length + filterVoteDirection.length + filterCatg.length;

	const filterTickAll = (value = true) => {
		if (value) {
			filterAssembly = [...FILTER_ASSEMBLY_DEFAULT];
			filterVoteType = [...FILTER_VOTETYPE_DEFAULT];
			filterVoteDirection = [...FILTER_VOTEDIRECTION_DEFAULT];
			filterCatg = [...FILTER_CATEGORY_DEFAULT];
		} else {
			filterAssembly = [];
			filterVoteType = [];
			filterVoteDirection = [];
			filterCatg = [];
		}
	};

	$: isFilterSomeFalse = tickedFilterCount < ALL_FILTER_COUNT;
	$: isFilterAllFalse = tickedFilterCount === 0;

	let mounted = false;
	onMount(() => {
		mounted = true;
		showFilter = window.matchMedia(`(min-width: 672px)`).matches;
		switch ($page.url.searchParams.get('votetype')) {
			case 'agreed':
				filterVoteType = [DefaultVoteOption.Agreed];
				break;
			case 'disagreed':
				filterVoteType = [DefaultVoteOption.Disagreed];
				break;
			case 'absent':
				filterVoteType = [DefaultVoteOption.Absent];
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
						{#each filterOptions.assemblies as assembly (assembly.id)}
							<Checkbox
								bind:group={filterAssembly}
								value={assembly.id}
								labelText="{assembly.name}ชุดที่ {assembly.term} ({assembly.startedAt.toLocaleString(
									'th-TH',
									{ year: 'numeric' }
								)} - {assembly?.endedAt?.toLocaleString('th-TH', { year: 'numeric' }) ??
									'ปัจจุบัน'})"
							/>
						{/each}
					</FormGroup>
					<FormGroup legendText="ประเภทการลงมติ">
						{#each FILTER_VOTETYPE_DEFAULT as votetype (votetype)}
							<Checkbox bind:group={filterVoteType} value={votetype} labelText="{votetype} (xxx)" />
						{/each}
					</FormGroup>
					<FormGroup legendText="เงื่อนไขพิเศษ">
						{#each FILTER_VOTEDIRECTION_DEFAULT as votedirection (votedirection)}
							<Checkbox
								bind:group={filterVoteDirection}
								value={votedirection}
								labelText="{votedirection} (xxx)"
							/>
						{/each}
					</FormGroup>
					<FormGroup legendText="หมวดมติ (1&nbsp;มติ มีได้มากกว่า 1&nbsp;หมวด)" class="mb-0">
						{#each filterOptions.categories as catg (catg)}
							<Checkbox bind:group={filterCatg} value={catg} labelText="{catg} (xxx)" />
						{/each}
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
