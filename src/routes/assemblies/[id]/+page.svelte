<script lang="ts">
	import Header from '$components/Assemblies/Header.svelte';
	import MainMembers from '$components/Assemblies/MainMembers.svelte';
	import Summary from '$components/Assemblies/Summary.svelte';
	import { Breadcrumb, BreadcrumbItem } from 'carbon-components-svelte';
	import type { MemberGroup } from './+page.server.js';
	import { getSenateColorByTitle } from '$components/Assemblies/shared.js';

	export let data;

	const getSenateGroupWithColor = (memberGroup: MemberGroup[]): MemberGroup[] => {
		return memberGroup.map((group) => {
			const parties = group.parties?.map((party) => {
				return {
					...party,
					color: getSenateColorByTitle(party.name)
				};
			});
			return { ...group, parties };
		});
	};

	$: newSummary =
		data.assembly.abbreviation == 'สว.'
			? {
					...data.summary,
					groupBySex: getSenateGroupWithColor(data.summary.groupBySex),
					groupByAgeRange: getSenateGroupWithColor(data.summary.groupByAgeRange),
					groupByEducation: getSenateGroupWithColor(data.summary.groupByEducation)
			  }
			: data.summary;
</script>

<div class="md:px-[64px] px-[16px]">
	<Breadcrumb
		noTrailingSlash
		class="[&>.bx--breadcrumb]:flex [&>.bx--breadcrumb]:flex-wrap my-[8px]"
	>
		<BreadcrumbItem href="/">หน้าหลัก</BreadcrumbItem>
		<!-- TODO: link this -->
		<BreadcrumbItem class="hidden md:block">รัฐสภา</BreadcrumbItem>
		<BreadcrumbItem class="hidden md:block" href="/assemblies/{data.assembly.id}"
			>{data.assembly.name}</BreadcrumbItem
		>
	</Breadcrumb>
	<Header data={data.assembly} assemblyIds={data.assemblyIds} />
	<Summary
		assemblyId={data.assembly.id}
		summary={newSummary}
		houseLevel={data.assembly.abbreviation === 'สส.' ? 'lower' : 'upper'}
	/>
	<MainMembers members={data.mainMembers} assemblyId={data.assembly.id} />
	<!-- <LatestVotes votes={data.latestVotes} assemblyId={data.assembly.id} /> -->
</div>
