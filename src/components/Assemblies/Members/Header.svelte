<script lang="ts">
	import { Breadcrumb, BreadcrumbItem, Search } from 'carbon-components-svelte';
	import Download from 'carbon-icons-svelte/lib/Download.svelte';
	import TableSplit from 'carbon-icons-svelte/lib/TableSplit.svelte';
	import type {
		AssemblySummary,
		GroupByTab
	} from '../../../routes/assemblies/[id]/members/[groupby]/+layout';

	export let data: {
		assembly: AssemblySummary;
		groupByTabs: GroupByTab[];
	};

	$: ({ assembly } = data);

	export let searchQuery = '';
	export let mounted = false;
	$: startedYear = assembly?.startedAt ? assembly.startedAt.getFullYear() + 543 : null;
</script>

<Breadcrumb
	noTrailingSlash
	class="px-4 py-2 body-compact-01 [&>.bx--breadcrumb]:flex [&>.bx--breadcrumb]:flex-wrap"
>
	<BreadcrumbItem href="/">หน้าหลัก</BreadcrumbItem>
	<BreadcrumbItem href="/assemblies/{assembly.id}">{assembly.name} {assembly.term}</BreadcrumbItem>
	<BreadcrumbItem href="/assemblies/{assembly.id}/members/party" isCurrentPage
		>รายชื่อสมาชิก</BreadcrumbItem
	>
</Breadcrumb>

<header class="px-4 py-3 bg-ui-01 md:px-16 md:pb-0">
	<div class="flex flex-col gap-1 md:flex-row md:gap-16 md:items-center">
		<div class="flex-1 flex items-center flex-wrap gap-x-4">
			<h1 class="fluid-heading-04" style="text-wrap:balance">รายชื่อ{assembly.name}</h1>
			<div class="flex items-center gap-4">
				<!-- TODO: handler buttom next and prev-->
				<img
					src="/icons/angle-right.svg"
					alt="angle-left"
					class="rotate-180 w-[20px] fill-gray-300"
				/>
				<h2 class="fluid-heading-03">ชุดที่ {assembly.term} | {startedYear}</h2>
				<img src="/icons/angle-right.svg" alt="angle-right" class="w-[20px]" />
			</div>
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
		placeholder="ค้นหาชื่อบุคคล"
		light
		bind:value={searchQuery}
		skeleton={!mounted}
	/>
</header>
