<script lang="ts">
	import Header from '$components/Assemblies/Header.svelte';
	import LatestVotes from '$components/Assemblies/LatestVotes.svelte';
	import MainMembers from '$components/Assemblies/MainMembers.svelte';
	import Summary from '$components/Assemblies/Summary.svelte';
	import { Breadcrumb, BreadcrumbItem, OverflowMenu } from 'carbon-components-svelte';

	export let data;
</script>

<div class="md:px-[64px] px-[16px]">
	<Breadcrumb noTrailingSlash class="[&>.bx--breadcrumb]:flex [&>.bx--breadcrumb]:flex-wrap">
		<BreadcrumbItem href="/">หน้าหลัก</BreadcrumbItem>
		<!-- TODO: link this -->
		<BreadcrumbItem class="hidden md:block" href="/">รัฐสภา</BreadcrumbItem>
		<BreadcrumbItem class="hidden md:block" href="/assemblies/{data.assembly.id}"
			>{data.assembly.name}</BreadcrumbItem
		>
	</Breadcrumb>
	<Header data={data.assembly} assemblyIds={data.assemblyIds} />
	<Summary
		summary={data.summary}
		houseLevel={data.assembly.abbreviation === 'สส.' ? 'lower' : 'upper'}
	/>
	<MainMembers members={data.mainMembers} assemblyId={data.assembly.id} />
	<LatestVotes votes={data.latestVotes} assemblyId={data.assembly.id} />
</div>
