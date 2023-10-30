<script lang="ts">
	import VotesBody from '$components/Votes/VotesBody.svelte';
	import VotesHeader from '$components/Votes/VotesHeader.svelte';
	import { Breadcrumb, BreadcrumbItem } from 'carbon-components-svelte';

	export let data;
</script>

<div>
	<div class="px-[16px] py-[8px]">
		<Breadcrumb noTrailingSlash>
			<BreadcrumbItem href="/">หน้าหลัก</BreadcrumbItem>
			<!-- TODO: link this -->
			<BreadcrumbItem href={`/`}>รัฐสภา</BreadcrumbItem>
			<BreadcrumbItem href={`/assemblies/${data.assembly.id}`}>{data.assembly.name}</BreadcrumbItem>
			<BreadcrumbItem href={`/assemblies/${data.assembly.id}/votes`} isCurrentPage
				>ประวัติการลงมติ</BreadcrumbItem
			>
		</Breadcrumb>
	</div>
	<VotesHeader {data} />
	<VotesBody votes={data.votings} filterOptions={data.filterOptions} />
</div>

<!-- <div class="whitespace-pre">{JSON.stringify(data, undefined, 2)}</div> -->
