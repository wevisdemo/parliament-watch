<script lang="ts">
	import Breadcrumb from '$components/Breadcrumb/Breadcrumb.svelte';
	import AssemblyIdRunner, { type AvailableAssembly } from '../AssemblyIdRunner.svelte';
	import { Search } from 'carbon-components-svelte';
	import Download from 'carbon-icons-svelte/lib/Download.svelte';
	import TableSplit from 'carbon-icons-svelte/lib/TableSplit.svelte';

	interface Props {
		id: string;
		name: string;
		availableAssemblies: AvailableAssembly[];
		searchQuery?: string;
	}

	let { id, name, availableAssemblies, searchQuery = $bindable('') }: Props = $props();

	const getAssemblyPath = (assembly: AvailableAssembly) =>
		assembly ? `/assemblies/${assembly.id}/members` : '';
</script>

<Breadcrumb
	items={[
		{ label: 'หน้าหลัก', url: '/' },
		{ label: 'นักการเมือง' },
		{ label: name, url: `/assemblies/${id}` },
		{ label: 'รายชื่อสมาชิก', url: `/assemblies/${id}/members` }
	]}
/>

<header class="bg-ui-01 px-4 py-3 md:px-16 md:pb-0">
	<div class="flex flex-col gap-1 md:flex-row md:items-center md:gap-16">
		<div class="flex flex-1 flex-wrap items-center gap-x-4">
			<h1 class="fluid-heading-04" style="text-wrap:balance">รายชื่อ{name}</h1>
			<AssemblyIdRunner {id} {availableAssemblies} {getAssemblyPath} />
		</div>
		<div class="flex flex-col gap-2 rounded-sm border border-solid border-ui-03 p-3 md:self-end">
			<div class="flex items-center gap-1">
				<Download />
				<h2 class="heading-01">ดาวน์โหลดข้อมูล</h2>
			</div>
			<a
				href="/files/download/assemblies/{id}-members.csv"
				class="helper-text-01 mr-auto flex items-center gap-1"
			>
				<TableSplit />
				<span>รายชื่อสมาชิก</span>
			</a>
		</div>
	</div>
	<Search
		class="md:hidden"
		searchClass="md:hidden mt-2"
		placeholder="ค้นหาชื่อบุคคล"
		light
		bind:value={searchQuery}
	/>
</header>
