<script lang="ts">
	import {
		Breadcrumb,
		BreadcrumbItem,
		Button,
		ButtonSet,
		InlineNotification,
		Pagination,
		Search
	} from 'carbon-components-svelte';
	import Download from 'carbon-icons-svelte/lib/Download.svelte';
	import Minimize from 'carbon-icons-svelte/lib/Minimize.svelte';
	import TableSplit from 'carbon-icons-svelte/lib/TableSplit.svelte';

	import { DataTable } from 'carbon-components-svelte';

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
	<div class="sticky top-0 max-h-screen flex flex-col bg-white w-[250px] flex-[0_0_250px]">
		<div class="sticky top-0 flex w-full pl-6">
			<Search class="flex-1 !px-12" placeholder="ชื่อมติ หรือ คำที่เกี่ยวข้อง" light />
			<Button
				kind="ghost"
				icon={Minimize}
				iconDescription="ซ่อนตัวเลือก"
				tooltipPosition="right"
				tooltipAlignment="end"
			/>
		</div>
		<div class="flex-1 overflow-y-auto">FILTERS</div>
		<div class="flex gap-[1px] sticky bottom-0 body-compact-01">
			<Button class="flex-1 min-w-0 pr-4" kind="tertiary">ล้างตัวเลือก</Button>
			<Button class="flex-1 min-w-0 pr-4">ดูที่เลือก</Button>
		</div>
	</div>
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
