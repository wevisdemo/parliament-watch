<script lang="ts">
	import Header from '$components/Assemblies/Header.svelte';
	import MainMembers from '$components/Assemblies/MainMembers.svelte';
	import Summary from '$components/Assemblies/Summary.svelte';
	import { Breadcrumb, BreadcrumbItem } from 'carbon-components-svelte';
	import type { MemberGroup } from './+page.server.js';
	import { getSenateColorByTitle } from '$components/Assemblies/shared.js';
	import LatestVotes from '$components/Assemblies/LatestVotes.svelte';
	import { AssemblyName } from '$models/assembly.js';

	export let data;

	$: ({ availableAssemblies, assembly, summary, mainMembers, latestVotes, seo } = data);

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
		assembly.abbreviation == 'สว.'
			? {
					...summary,
					groupBySex: getSenateGroupWithColor(summary.groupBySex),
					groupByAgeRange: getSenateGroupWithColor(summary.groupByAgeRange),
					groupByEducation: getSenateGroupWithColor(summary.groupByEducation)
				}
			: summary;

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

<div class="px-[16px] md:px-[64px]">
	<Breadcrumb
		noTrailingSlash
		class="my-[8px] [&>.bx--breadcrumb]:flex [&>.bx--breadcrumb]:flex-wrap"
	>
		<BreadcrumbItem href="/">หน้าหลัก</BreadcrumbItem>
		<BreadcrumbItem class="hidden md:block">รัฐสภา</BreadcrumbItem>
		<BreadcrumbItem class="hidden md:block" href="/assemblies/{assembly.id}"
			>{assembly.name} ชุดที่ {assembly.term}</BreadcrumbItem
		>
	</Breadcrumb>
	<Header {assembly} {availableAssemblies} />
	<div class="flex w-full">
		<button
			class="w-full border-b-[2px] border-solid px-[16px] py-[11px] text-left text-[14px] {selector ===
			'summary'
				? 'border-blue-60 font-semibold text-black'
				: 'border-gray-20 text-gray-60'}"
			on:click={() => onClickTab('summary')}
		>
			ภาพรวม
		</button>
		<button
			class="w-full border-b-[2px] border-solid px-[16px] py-[11px] text-left text-[14px] {selector ===
			'members'
				? 'border-blue-60 font-semibold text-black'
				: 'border-gray-20 text-gray-60'}"
			on:click={() => onClickTab('members')}
		>
			สมาชิก
		</button>
		<button
			class="w-full border-b-[2px] border-solid px-[16px] py-[11px] text-left text-[14px] {selector ===
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
			assemblyId={assembly.id}
			summary={newSummary}
			houseLevel={assembly.name === AssemblyName.Representatives ? 'lower' : 'upper'}
		/>
	</section>
	<section id="members">
		<MainMembers members={mainMembers} assemblyId={assembly.id} />
	</section>
	<section id="latest-votes">
		<LatestVotes votes={latestVotes} assemblyId={assembly.id} />
	</section>
</div>
