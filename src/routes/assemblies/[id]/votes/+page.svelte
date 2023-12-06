<script lang="ts">
	import VotesBody from '$components/Votes/VotesBody.svelte';
	import VotesHeader from '$components/Votes/VotesHeader.svelte';
	import {
		Breadcrumb,
		BreadcrumbItem,
		OverflowMenu,
		OverflowMenuItem
	} from 'carbon-components-svelte';

	export let data;

	const { assemblyIds, assembly, votes, filterOptions } = data;
</script>

<div>
	<div class="px-[16px] py-[8px]">
		<Breadcrumb noTrailingSlash class="[&>.bx--breadcrumb]:flex [&>.bx--breadcrumb]:flex-wrap">
			<BreadcrumbItem href="/">หน้าหลัก</BreadcrumbItem>
			<!-- TODO: link this -->
			<BreadcrumbItem class="md:hidden">
				<OverflowMenu>
					<OverflowMenuItem href="/" text="รัฐสภา" />
					<OverflowMenuItem href="assemblies/{assembly.id}" text={assembly.name} />
				</OverflowMenu>
			</BreadcrumbItem>

			<BreadcrumbItem class="hidden md:block" href="/">รัฐสภา</BreadcrumbItem>
			<BreadcrumbItem class="hidden md:block" href="/assemblies/{assembly.id}"
				>{assembly.name}</BreadcrumbItem
			>
			<BreadcrumbItem href="/assemblies/{assembly.id}/votes" isCurrentPage
				>ประวัติการลงมติ</BreadcrumbItem
			>
		</Breadcrumb>
	</div>
	<VotesHeader {assembly} {assemblyIds} />
	<VotesBody {votes} {filterOptions} />
</div>

<!-- <div class="whitespace-pre">{JSON.stringify(data, undefined, 2)}</div> -->
