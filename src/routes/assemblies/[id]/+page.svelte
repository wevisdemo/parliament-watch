<script lang="ts">
	import Header from '$components/Assemblies/Header.svelte';
	import MainMembers from '$components/Assemblies/MainMembers.svelte';
	import Summary from '$components/Assemblies/Summary.svelte';
	import { Breadcrumb, BreadcrumbItem } from 'carbon-components-svelte';
	import LatestVotes from '$components/Assemblies/LatestVotes.svelte';
	import { AssemblyName } from '$models/assembly.js';

	export let data;

	$: ({ availableAssemblies, assembly, isCabinet, summary, mainMembers, changes, latestVotes } =
		data);

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
		<BreadcrumbItem class="hidden md:block">นักการเมือง</BreadcrumbItem>
		<BreadcrumbItem class="hidden md:block" href="/assemblies/{assembly.id}"
			>{assembly.name} ชุดที่ {assembly.term}</BreadcrumbItem
		>
	</Breadcrumb>
	<Header {assembly} {availableAssemblies} />
	<div class="flex w-full">
		<button
			class="tab {selector === 'summary' ? 'tab-active' : 'tab-inactice'}"
			on:click={() => onClickTab('summary')}
		>
			ภาพรวม
		</button>
		<button
			class="tab {selector === 'members' ? 'tab-active' : 'tab-inactice'}"
			on:click={() => onClickTab('members')}
		>
			สมาชิก
		</button>
		<button
			class="tab {selector === 'latest-votes' ? 'tab-active' : 'tab-inactice'}"
			on:click={() => onClickTab('latest-votes')}
		>
			การลงมติ
		</button>
	</div>
	<section id="summary">
		<Summary
			assemblyId={assembly.id}
			{summary}
			houseLevel={assembly.name === AssemblyName.Representatives
				? 'lower'
				: assembly.name === AssemblyName.Cabinet
					? 'cabinet'
					: 'upper'}
		/>
		{#if isCabinet}
			{JSON.stringify(mainMembers)}
		{/if}
	</section>
	{#if !isCabinet}
		<section id="members">
			<MainMembers members={mainMembers} assemblyId={assembly.id} />
		</section>
	{/if}

	{#if changes}
		<section id="members">
			{JSON.stringify(changes)}
		</section>
	{/if}

	{#if latestVotes}
		<section id="latest-votes">
			<LatestVotes votes={latestVotes} assemblyId={assembly.id} />
		</section>
	{/if}
</div>

<style lang="postcss">
	.tab {
		@apply w-full border-b-[2px] border-solid px-[16px] py-[11px] text-left text-[14px];
	}

	.tab-active {
		@apply border-blue-60 font-semibold text-black;
	}

	.tab-inactice {
		@apply border-gray-20 text-gray-60;
	}
</style>
