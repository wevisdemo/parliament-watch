<script lang="ts">
	import Header from '$components/Assemblies/Header.svelte';
	import MainMembers from '$components/Assemblies/MainMembers.svelte';
	import Summary from '$components/Assemblies/Summary.svelte';
	import { Breadcrumb, BreadcrumbItem, Tab, Tabs } from 'carbon-components-svelte';
	import type { MemberGroup } from './+page.server.js';
	import { getSenateColorByTitle } from '$components/Assemblies/shared.js';
	import LatestVotes from '$components/Assemblies/LatestVotes.svelte';

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

	let selector = 'summary';

	const onClickTab = (tab: 'summary' | 'members' | 'latest-votes') => {
		const el = document.getElementById(tab);
		selector = tab;
		if (!el) return;
		el.scrollIntoView({
			behavior: 'smooth'
		});
	};
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
	<div class="flex w-full">
		<button
			class="w-full px-[16px] py-[11px] text-[14px] border-b-[2px] border-solid text-left {selector ===
			'summary'
				? 'border-blue-60 font-semibold text-black'
				: 'border-gray-20 text-gray-60'}"
			on:click={() => onClickTab('summary')}
		>
			ภาพรวม
		</button>
		<button
			class="w-full px-[16px] py-[11px] text-[14px] border-b-[2px] border-solid text-left {selector ===
			'members'
				? 'border-blue-60 font-semibold text-black'
				: 'border-gray-20 text-gray-60'}"
			on:click={() => onClickTab('members')}
		>
			สมาชิก
		</button>
		<button
			class="w-full px-[16px] py-[11px] text-[14px] border-b-[2px] border-solid text-left {selector ===
			'latest-votes'
				? 'border-blue-60 font-semibold text-black'
				: 'border-gray-20 text-gray-60'}"
			on:click={() => onClickTab('latest-votes')}
		>
			การลงมติ
		</button>
	</div>
	<section id="summary">
		<Summary
			assemblyId={data.assembly.id}
			summary={newSummary}
			houseLevel={data.assembly.abbreviation === 'สส.' ? 'lower' : 'upper'}
		/>
	</section>
	<section id="members">
		<MainMembers members={data.mainMembers} assemblyId={data.assembly.id} />
	</section>
	<section id="latest-votes">
		<LatestVotes votes={data.latestVotes} assemblyId={data.assembly.id} />
	</section>
</div>
