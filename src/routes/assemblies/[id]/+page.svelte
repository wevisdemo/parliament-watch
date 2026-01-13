<script lang="ts">
	import RoleChangeLog from '$components/Assemblies/RoleChanges/RoleChanges.svelte';
	import PoliticianChangeIcon from '$components/icons/PoliticianChangeIcon.svelte';
	import Header from '$components/Assemblies/Header.svelte';
	import MainMembers from '$components/Assemblies/MainMembers.svelte';
	import Summary from '$components/Assemblies/Summary.svelte';
	import { Breadcrumb, BreadcrumbItem, Button } from 'carbon-components-svelte';
	import LatestVotes from '$components/Assemblies/LatestVotes.svelte';
	import CabinetMembers from '$components/CabinetMembers/CabinetMembers.svelte';
	import LatestBills from '$components/Assemblies/LatestBills.svelte';
	import ArrowRight from 'carbon-icons-svelte/lib/ArrowRight.svelte';
	import LawIcon from '$components/icons/LawIcon.svelte';
	import ModalLawProcess from '$components/bills/ModalLawProcess.svelte';
	import GeneralIcon from '$components/icons/GeneralIcon.svelte';
	import NavigationTab from '$components/NavigationTab/NavigationTab.svelte';

	export let data;

	$: ({
		availableAssemblies,
		assembly,
		isCabinet,
		summary,
		mainPositions,
		changes,
		latestVoteEvents,
		latestBills
	} = data);
</script>

<div class="px-[16px] md:px-[64px]">
	<Breadcrumb
		noTrailingSlash
		class="my-[8px] [&>.bx--breadcrumb]:flex [&>.bx--breadcrumb]:flex-wrap"
	>
		<BreadcrumbItem href="/">หน้าหลัก</BreadcrumbItem>
		<BreadcrumbItem class="hidden md:block">นักการเมือง</BreadcrumbItem>
		<BreadcrumbItem class="hidden md:block" href="/assemblies/{assembly.id}"
			>{assembly.name}</BreadcrumbItem
		>
	</Breadcrumb>
	<Header
		id={assembly.id}
		name={assembly.name.split(' ')[0]}
		startedAt={assembly.founding_date ? new Date(assembly.founding_date) : new Date()}
		endedAt={assembly.dissolution_date ? new Date(assembly.dissolution_date) : undefined}
		description={assembly.description}
		{availableAssemblies}
	/>

	<NavigationTab
		tabs={[
			{ id: 'summary', label: 'ภาพรวม', show: summary.totalMembers },
			{ id: 'members', label: 'สมาชิก', show: summary.totalMembers },
			{ id: 'role-change', label: 'การปรับคณะรัฐมนตรี', show: changes?.length },
			{ id: 'latest-bills', label: 'การเสนอร่างกฎหมาย', show: latestBills?.length },
			{ id: 'latest-votes', label: 'ผลการลงมติล่าสุด', show: latestVoteEvents?.length }
		]}
	/>

	{#if summary.totalMembers}
		<section id="summary">
			<Summary
				assemblyId={assembly.id}
				{summary}
				houseLevel={assembly.classification === 'HOUSE_OF_REPRESENTATIVE'
					? 'lower'
					: assembly.classification === 'CABINET'
						? 'cabinet'
						: 'upper'}
			/>
		</section>
		<section id="members">
			{#if isCabinet}
				<div class="flex items-center p-[16px]">
					<GeneralIcon class="h-[32px] w-[32px]" />
					<span class="fluid-heading-04 ml-[16px]">สมาชิก</span>
				</div>
				<div class="w-full border-b-[1px] border-solid border-gray-20" />
				<CabinetMembers members={mainPositions} />
			{/if}
			{#if !isCabinet}
				<MainMembers members={mainPositions} assemblyId={assembly.id} />
			{/if}
		</section>
	{/if}
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
	{#if latestBills.length}
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
			<Button
				href="/bills/explore?proposername={assembly.id}"
				kind="secondary"
				icon={ArrowRight}
				class="w-full max-w-none"
			>
				ดูร่างกฎหมายทั้งหมด
			</Button>
		</section>
	{/if}

	{#if latestVoteEvents.length}
		<section id="latest-votes">
			<LatestVotes votes={latestVoteEvents} assemblyId={assembly.id} />
		</section>
	{/if}
</div>
