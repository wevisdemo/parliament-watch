<script lang="ts">
	import {
		Breadcrumb,
		BreadcrumbItem,
		Button,
		Checkbox,
		DataTable,
		FormGroup,
		InlineNotification,
		Pagination,
		Search,
		Tag
	} from 'carbon-components-svelte';
	import DocumentPdf from 'carbon-icons-svelte/lib/DocumentPdf.svelte';
	import Download from 'carbon-icons-svelte/lib/Download.svelte';
	import Filter from 'carbon-icons-svelte/lib/Filter.svelte';
	import Minimize from 'carbon-icons-svelte/lib/Minimize.svelte';
	import TableSplit from 'carbon-icons-svelte/lib/TableSplit.svelte';
	import { onMount } from 'svelte';

	export let data;

	const { prefix, firstname, lastname, votings } = data;

	let pageSize = 10;
	let page = 1;

	let showFilter = true;
	let showAllCatg = false;

	let mounted = false;
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
		<BreadcrumbItem href="/">หน้าหลัก</BreadcrumbItem>
		<BreadcrumbItem href="/politicians">สส. ชุดที่ 26</BreadcrumbItem>
		<BreadcrumbItem href="/politicians/{firstname}-{lastname}">{firstname}</BreadcrumbItem>
		<BreadcrumbItem href="/politicians/{firstname}-{lastname}/votelog" isCurrentPage
			>ประวัติการลงมติ</BreadcrumbItem
		>
	</Breadcrumb>
	<header class="px-4 py-3 bg-ui-01 md:px-16">
		<p class="heading-01">ประวัติการลงมติ</p>
		<!-- FIXME: ไม่มีคำนำหน้า -->
		<h1 class="fluid-heading-03 mb-1">
			<a
				class="no-underline text-black hover:text-blue-70"
				href="/politicians/{firstname}-{lastname}">{prefix} {firstname} {lastname}</a
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
		<div class="md:hidden flex gap-2 items-center mt-2">
			<!-- <Button
				tooltipAlignment="start"
				tooltipPosition="top"
				iconDescription="แสดงตัวเลือก"
				icon={Filter}
				on:click={() => {
					showFilter = true;
				}}
			/> -->
			<Search class="flex-1 !px-12" placeholder="ชื่อมติ หรือ คำที่เกี่ยวข้อง" light />
		</div>
	</header>
	<div class="flex-1 flex gap-1 bg-ui-01">
		{#if showFilter}
			<div
				class={`${
					!mounted ? 'hidden md:flex' : ''
				} fixed w-full h-screen md:h-auto md:max-h-screen overscroll-none md:sticky top-0 flex flex-col bg-white md:w-[250px] flex-[0_0_250px] z-10`}
			>
				<div class="sticky top-0 flex w-full pl-6">
					<Search class="flex-1 !px-12" placeholder="ชื่อมติ หรือ คำที่เกี่ยวข้อง" light />
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
						<Checkbox id="era-26" labelText="สภาผู้แทนราษฎรชุดที่ 26 (2566 - ปัจจุบัน)" checked />
						<Checkbox id="era-25" labelText="สภาผู้แทนราษฎรชุดที่ 25 (2563 - 2566)" checked />
					</FormGroup>
					<FormGroup legendText="ประเภทการลงมติ">
						<Checkbox id="type-yes" labelText="เห็นด้วย (xxx)" checked />
						<Checkbox id="type-no" labelText="ไม่เห็นด้วย (xxx)" checked />
						<Checkbox id="type-abstain" labelText="งดออกเสียง (xxx)" checked />
						<Checkbox id="type-novote" labelText="ไม่ลงคะแนน (xxx)" checked />
						<Checkbox id="type-absent" labelText="ลา/ขาดประชุม (xxx)" checked />
						<Checkbox id="type-other" labelText="อื่นๆ (xxx)" checked />
					</FormGroup>
					<FormGroup legendText="เงื่อนไขพิเศษ">
						<Checkbox
							id="special-different"
							labelText="ลงมติต่างจากเสียงส่วนใหญ่ในพรรค (xxx)"
							checked
						/>
						<Checkbox
							id="special-follow"
							labelText="ลงมติเหมือนเสียงส่วนใหญ่ในพรรค (xxx)"
							checked
						/>
					</FormGroup>
					<FormGroup legendText="หมวดมติ (1&nbsp;มติ มีได้มากกว่า 1&nbsp;หมวด)" class="mb-0">
						<Checkbox id="catg-เศรษฐกิจ" labelText="เศรษฐกิจ (xxx)" checked />
						<Checkbox id="catg-ขนส่งสาธารณะ" labelText="ขนส่งสาธารณะ (xxx)" checked />
						<Checkbox id="catg-แก้รัฐธรรมนูญ" labelText="แก้รัฐธรรมนูญ (xxx)" checked />
						<Checkbox id="catg-ที่อยู่อาศัย" labelText="ที่อยู่อาศัย (xxx)" checked />
						{#if showAllCatg}
							<Checkbox id="catg-สวัสดิการ" labelText="สวัสดิการ (xxx)" checked />
							<Checkbox id="catg-การศึกษา" labelText="การศึกษา (xxx)" checked />
							<Checkbox id="catg-สิ่งแวดล้อม" labelText="สิ่งแวดล้อม (xxx)" checked />
							<Checkbox id="catg-สังคม" labelText="สังคม (xxx)" checked />
							<Button
								class="underline"
								kind="ghost"
								size="small"
								on:click={() => {
									showAllCatg = false;
								}}>แสดงน้อยลง</Button
							>
						{:else}
							<Button
								class="underline"
								kind="ghost"
								size="small"
								on:click={() => {
									showAllCatg = true;
								}}>ดูทั้งหมด (10)</Button
							>
						{/if}
					</FormGroup>
				</div>
				<div class="flex gap-[1px] sticky bottom-0 body-compact-01 bg-white">
					<Button class="flex-1 min-w-0 pr-4" kind="tertiary">ล้างตัวเลือก</Button>
					<Button class="flex-1 min-w-0 pr-4">ดูที่เลือก</Button>
				</div>
			</div>
		{:else}
			<div class="fixed left-4 bottom-14 z-20">
				<Button
					tooltipAlignment="start"
					tooltipPosition="top"
					iconDescription="แสดงตัวเลือก"
					icon={Filter}
					on:click={() => {
						showFilter = true;
					}}
				/>
			</div>
		{/if}
		<div class="flex-1 flex flex-col bg-white">
			<DataTable
				class="[&>*>.bx--data-table--sticky-header]:max-h-[calc(100vh-40px)]"
				size="tall"
				headers={[
					{ key: 'date', value: 'วันที่' },
					{ key: 'title', value: 'ชื่อมติ' },
					{ key: 'result', value: 'ผลลัพธ์' },
					{ key: 'files', value: 'เอกสาร' }
				]}
				rows={votings}
				{pageSize}
				{page}
			>
				<svelte:fragment slot="cell" let:row let:cell>
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
						<Tag class="m-0 whitespace-nowrap" type={cell.value === 'passed' ? 'teal' : 'red'}
							>{cell.value === 'passed' ? 'ผ่าน' : 'ไม่ผ่าน'}</Tag
						>
					{:else if cell.key === 'files'}
						{@const files = cell.value}
						{#if files.length > 0}
							{#each files as file}
								<a href={file} download><DocumentPdf /></a>
							{/each}
						{:else}
							-
						{/if}
					{:else}
						{cell.value}
					{/if}
				</svelte:fragment>
			</DataTable>
			<div class="flex-1" />
			<Pagination
				class="sticky bottom-0"
				bind:pageSize
				bind:page
				totalItems={votings.length}
				pageSizeInputDisabled
				forwardText="หน้าถัดไป"
				backwardText="หน้าก่อนหน้า"
				itemRangeText={(min, max, total) => `${min} – ${max} จาก ${total} มติ`}
				pageRangeText={(_, total) => `จาก ${total} หน้า`}
			/>
		</div>
		<!-- <div class="flex-1 bg-white">
			<div class="sticky top-0 w-full h-12 bg-red-40">THEAD</div>
			{#each Array(50) as _}
				<div class="h-12 bg-gray-20">TROW</div>
			{/each}
			<Pagination
				class="sticky bottom-0"
				pageSize={100}
				totalItems={102}
				pageSizeInputDisabled
				forwardText="หน้าถัดไป"
				backwardText="หน้าก่อนหน้า"
				itemRangeText={(min, max, total) => `${min} – ${max} จาก ${total} มติ`}
				pageRangeText={(_, total) => `จาก ${total} หน้า`}
			/>
		</div> -->
	</div>
</div>
