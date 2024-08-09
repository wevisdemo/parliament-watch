<script lang="ts">
	import RoleChangeLog from '$components/Assemblies/RoleChanges/RoleChanges.svelte';
	import PoliticianChangeIcon from '$components/icons/PoliticianChangeIcon.svelte';
	import Header from '$components/Assemblies/Header.svelte';
	import MainMembers from '$components/Assemblies/MainMembers.svelte';
	import Summary from '$components/Assemblies/Summary.svelte';
	import { Breadcrumb, BreadcrumbItem, Button } from 'carbon-components-svelte';
	import LatestVotes from '$components/Assemblies/LatestVotes.svelte';
	import { AssemblyName } from '$models/assembly.js';
	import CabinetMembers from '$components/CabinetMembers/CabinetMembers.svelte';
	import LatestBills from '$components/Assemblies/LatestBills.svelte';
	import ArrowRight from 'carbon-icons-svelte/lib/ArrowRight.svelte';
	import LawIcon from '$components/icons/LawIcon.svelte';
	import ModalLawProcess from '$components/bills/ModalLawProcess.svelte';
	import GeneralIcon from '$components/icons/GeneralIcon.svelte';

	export let data;

	$: ({
		availableAssemblies,
		assembly,
		isCabinet,
		summary,
		mainMembers,
		changes,
		latestVotes,
		latestBills
	} = data);

	let selector = 'summary';

	const onClickTab = (
		tab: 'summary' | 'members' | 'latest-votes' | 'role-change' | 'latest-bills'
	) => {
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
			class="tab {selector === 'role-change' ? 'tab-active' : 'tab-inactice'}"
			on:click={() => onClickTab('role-change')}
		>
			การปรับคณะรัฐมนตรี
		</button>
		<button
			class="tab {selector === 'latest-bills' ? 'tab-active' : 'tab-inactice'}"
			on:click={() => onClickTab('latest-bills')}
		>
			การเสนอร่างกฎหมาย
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
	</section>
	<section id="members">
		{#if isCabinet}
			<div class="flex items-center p-[16px]">
				<GeneralIcon class="h-[32px] w-[32px]" />
				<span class="fluid-heading-04 ml-[16px]">สมาชิกคณะรัฐมนตรี</span>
			</div>
			<div class="w-full border-b-[1px] border-solid border-gray-20" />
			<CabinetMembers members={mainMembers} />
		{/if}
		{#if !isCabinet}
			<MainMembers members={mainMembers} assemblyId={assembly.id} />
		{/if}
	</section>

	{#if changes}
		<section id="role-change" class="py-8">
			<div class="flex items-center gap-4 py-4">
				<PoliticianChangeIcon class="h-8 w-8 flex-shrink-0" />
				<div>
					<h4 class="fluid-heading-04 text-text-primary">การปรับคณะรัฐมนตรี</h4>
					<p class="body-compact-01">บันทึกการปรับเปลี่ยนตำแหน่งในคณะรัฐมนตรีชุดนี้</p>
				</div>
			</div>
			<RoleChangeLog {changes} />
			<Button
				href="/assemblies/{assembly.id}/changes"
				kind="secondary"
				icon={ArrowRight}
				class="w-full max-w-none"
			>
				ดูการปรับเปลี่ยนตำแหน่งรัฐมนตรีตั้งแต่เริ่มต้น
			</Button>
		</section>
	{/if}
	{#if latestBills}
		<section id="latest-bills" class="py-8">
			<div class="flex flex-col items-start md:flex-row md:items-center md:justify-between">
				<div class="flex items-center gap-4 py-4">
					<LawIcon class="h-8 w-8 flex-shrink-0" />
					<div>
						<h4 class="fluid-heading-04 text-text-primary">การเสนอร่างกฎหมาย</h4>
						<p class="body-compact-01">
							รายการกฎหมาย/ร่างกฎหมายที่เสนอต่อรัฐสภาโดยคณะรัฐมนตรีชุดนี้
						</p>
					</div>
				</div>
				<ModalLawProcess class="pb-4 md:pb-0 md:text-right" />
			</div>
			<LatestBills {latestBills} />
			<Button href="#" kind="secondary" icon={ArrowRight} class="w-full max-w-none">
				ดูร่างกฎหมายทั้งหมด
			</Button>
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
