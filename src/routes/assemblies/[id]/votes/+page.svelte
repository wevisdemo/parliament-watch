<script lang="ts">
	import VotesMain from '$components/Assemblies/Votes/VotesMain.svelte';
	import { Breadcrumb, BreadcrumbItem } from 'carbon-components-svelte';

	export let data;

	$: ({ assemblyIds, assembly, votes, filterOptions } = data);
</script>

<div>
	<div class="px-[16px] py-[8px]">
		<Breadcrumb noTrailingSlash class="[&>.bx--breadcrumb]:flex [&>.bx--breadcrumb]:flex-wrap">
			<BreadcrumbItem href="/">หน้าหลัก</BreadcrumbItem>
			<BreadcrumbItem>รัฐสภา</BreadcrumbItem>
			<BreadcrumbItem href="/assemblies/{assembly.id}"
				>{assembly.name} ชุดที่ {assembly.term}</BreadcrumbItem
			>
			<BreadcrumbItem href="/assemblies/{assembly.id}/votes" isCurrentPage
				>ประวัติการลงมติ</BreadcrumbItem
			>
		</Breadcrumb>
	</div>
	<VotesMain {votes} {assembly} {assemblyIds} {filterOptions} />
</div>
