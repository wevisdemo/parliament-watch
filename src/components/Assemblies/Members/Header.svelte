<script lang="ts">
	import { Breadcrumb, BreadcrumbItem, Search } from 'carbon-components-svelte';
	import Download from 'carbon-icons-svelte/lib/Download.svelte';
	import TableSplit from 'carbon-icons-svelte/lib/TableSplit.svelte';
	import type {
		AssemblySummary,
		GroupByTab
	} from '../../../routes/assemblies/[id]/members/[groupby]/+layout.server';
	import AssemblyIdRunner, { type AvailableAssembly } from '../AssemblyIdRunner.svelte';

	export let data: {
		assembly: AssemblySummary;
		groupByTabs: GroupByTab[];
	};
	export let availableAssemblies: AvailableAssembly[];

	$: ({ assembly } = data);

	export let searchQuery = '';
	export let mounted = false;
</script>

<Breadcrumb
	noTrailingSlash
	class="body-compact-01 px-4 py-2 [&>.bx--breadcrumb]:flex [&>.bx--breadcrumb]:flex-wrap"
>
	<BreadcrumbItem href="/">หน้าหลัก</BreadcrumbItem>
	<BreadcrumbItem>รัฐสภา</BreadcrumbItem>
	<BreadcrumbItem href="/assemblies/{assembly.id}"
		>{assembly.name} ชุดที่ {assembly.term}</BreadcrumbItem
	>
	<BreadcrumbItem href="/assemblies/{assembly.id}/members" isCurrentPage
		>รายชื่อสมาชิก</BreadcrumbItem
	>
</Breadcrumb>

<header class="bg-ui-01 px-4 py-3 md:px-16 md:pb-0">
	<div class="flex flex-col gap-1 md:flex-row md:items-center md:gap-16">
		<div class="flex flex-1 flex-wrap items-center gap-x-4">
			<h1 class="fluid-heading-04" style="text-wrap:balance">รายชื่อ{assembly.name}</h1>
			<AssemblyIdRunner
				name={assembly.name}
				term={assembly.term}
				startedYear={assembly.startedAt}
				{availableAssemblies}
				postfix="members"
			/>
		</div>
		<div class="flex flex-col gap-2 rounded-sm border border-solid border-ui-03 p-3 md:self-end">
			<div class="flex items-center gap-1">
				<Download />
				<h2 class="heading-01">ดาวน์โหลดข้อมูล</h2>
			</div>
			<a
				href="/files/download/assemblies/{assembly.id}-members.csv"
				class="helper-text-01 mr-auto flex items-center gap-1"
			>
				<TableSplit />
				<span>รายชื่อสมาชิก</span>
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
