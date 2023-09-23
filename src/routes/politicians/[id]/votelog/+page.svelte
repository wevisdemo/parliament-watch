<script lang="ts">
	import {
		Breadcrumb,
		BreadcrumbItem,
		Button,
		ButtonSet,
		FormGroup,
		InlineNotification,
		Pagination,
		Search
	} from 'carbon-components-svelte';
	import Download from 'carbon-icons-svelte/lib/Download.svelte';
	import Minimize from 'carbon-icons-svelte/lib/Minimize.svelte';
	import TableSplit from 'carbon-icons-svelte/lib/TableSplit.svelte';
	import { DataTable } from 'carbon-components-svelte';
	import { Checkbox } from 'carbon-components-svelte';
	import Filter from 'carbon-icons-svelte/lib/Filter.svelte';

	export let data;

	const { prefix, firstname, lastname, votings } = data;

	let rows = Array.from({ length: 102 }).map((_, i) => ({
		id: i,
		name: 'Load Balancer ' + (i + 1),
		protocol: 'HTTP',
		port: 3000 + i * 10,
		rule: i % 2 ? 'Round robin' : 'DNS delegation'
	}));
	let pageSize = 10;
	let page = 1;

	let showFilter = true;

	let showAllCatg = false;
</script>

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
	<h1 class="fluid-heading-03 mb-1">{firstname} {lastname}</h1>
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
</header>

<div class="flex gap-1 bg-ui-01 min-h-screen">
	{#if showFilter}
		<div
			class="fixed w-full overscroll-none md:sticky top-0 max-h-screen flex flex-col bg-white md:w-[250px] flex-[0_0_250px] z-10"
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
			<div class="flex-1 overflow-y-auto py-4 px-6">
				<FormGroup legendText="สมัยการทำงาน">
					<Checkbox id="era-26" labelText="สภาผู้แทนราษฎรชุดที่ 26 (2566 - ปัจจุบัน)" />
					<Checkbox id="era-25" labelText="สภาผู้แทนราษฎรชุดที่ 25 (2563 - 2566)" />
				</FormGroup>
				<FormGroup legendText="ประเภทการลงมติ">
					<Checkbox id="type-yes" labelText="เห็นด้วย (xxx)" />
					<Checkbox id="type-no" labelText="ไม่เห็นด้วย (xxx)" />
					<Checkbox id="type-abstain" labelText="งดออกเสียง (xxx)" />
					<Checkbox id="type-novote" labelText="ไม่ลงคะแนน (xxx)" />
					<Checkbox id="type-absent" labelText="ลา/ขาดประชุม (xxx)" />
					<Checkbox id="type-other" labelText="อื่นๆ (xxx)" />
				</FormGroup>
				<FormGroup legendText="เงื่อนไขพิเศษ">
					<Checkbox id="special-different" labelText="ลงมติต่างจากเสียงส่วนใหญ่ในพรรค (xxx)" />
					<Checkbox id="special-follow" labelText="ลงมติเหมือนเสียงส่วนใหญ่ในพรรค (xxx)" />
				</FormGroup>
				<FormGroup legendText="หมวดมติ (1&nbsp;มติ มีได้มากกว่า 1&nbsp;หมวด)" class="mb-0">
					<Checkbox id="catg-เศรษฐกิจ" labelText="เศรษฐกิจ (xxx)" />
					<Checkbox id="catg-ขนส่งสาธารณะ" labelText="ขนส่งสาธารณะ (xxx)" />
					<Checkbox id="catg-แก้รัฐธรรมนูญ" labelText="แก้รัฐธรรมนูญ (xxx)" />
					<Checkbox id="catg-ที่อยู่อาศัย" labelText="ที่อยู่อาศัย (xxx)" />
					{#if showAllCatg}
						<Checkbox id="catg-สวัสดิการ" labelText="สวัสดิการ (xxx)" />
						<Checkbox id="catg-การศึกษา" labelText="การศึกษา (xxx)" />
						<Checkbox id="catg-สิ่งแวดล้อม" labelText="สิ่งแวดล้อม (xxx)" />
						<Checkbox id="catg-สังคม" labelText="สังคม (xxx)" />
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
	<div class="flex-1 bg-white">
		<DataTable
			class="[&>*>.bx--data-table--sticky-header]:max-h-[calc(100vh-40px)]"
			size="tall"
			headers={[
				{ key: 'name', value: 'Name' },
				{ key: 'protocol', value: 'Protocol' },
				{ key: 'port', value: 'Port' },
				{ key: 'rule', value: 'Rule' }
			]}
			{pageSize}
			{page}
			{rows}
		/>
		<Pagination
			class="sticky bottom-0"
			bind:pageSize
			bind:page
			totalItems={rows.length}
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
