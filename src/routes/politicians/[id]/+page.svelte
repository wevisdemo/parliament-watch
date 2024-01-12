<script lang="ts">
	import Share from '$components/Share/Share.svelte';
	import General from '$components/icons/GeneralIcon.svelte';
	import Politician from '$components/icons/PoliticianIcon.svelte';
	import PartyDetail from '$components/politicians/PartyDetail.svelte';
	import PositionStatus from '$components/politicians/PositionStatus.svelte';
	import Section from '$components/politicians/Section.svelte';
	import SideNav from '$components/politicians/SideNav.svelte';
	import { Breadcrumb, BreadcrumbItem } from 'carbon-components-svelte';
	// import ArrowUpRight from 'carbon-icons-svelte/lib/ArrowUpRight.svelte';
	import DownloadData from '$components/DownloadData/DownloadData.svelte';
	import PoliticianPicture from '$components/PoliticianPicture/PoliticianPicture.svelte';
	import dayjs from 'dayjs';
	import scrollama from 'scrollama';
	import { onMount } from 'svelte';
	import PoliticianVoteSummary from '$components/politicians/PoliticianVoteSummary.svelte';

	export let data;

	$: ({ politician, agreedVoting, disagreedVoting, votingAbsentStats } = data);

	const groupBy = <T, K extends string>(arr: T[], groupFn: (element: T) => K): Record<K, T[]> =>
		arr.reduce(
			(r, v, _i, _a, k = groupFn(v)) => ((r[k] || (r[k] = [])).push(v), r),
			{} as Record<K, T[]>
		);

	$: parties = politician?.partyRoles
		? groupBy(politician.partyRoles, (role) => role.party.name)
		: [];
	$: currentParty = politician?.partyRoles.find((e) => !e.endedAt);
	$: partyCount = Object.keys(parties).length;
	$: currentRoles = politician?.assemblyRoles.filter((e) => !e.endedAt);

	let currentNavElementIndex = 0;
	onMount(() => {
		if (window.matchMedia('(min-width: 672px)').matches) {
			const scroller = scrollama();

			scroller
				.setup({
					step: '.politician-section',
					// @ts-expect-error Documentation บอกว่าใช้ string ที่มี px ได้ https://github.com/russellsamora/scrollama#:~:text=number%20(0%20%2D%201%2C%20or%20string%20with%20%22px%22)
					offset: '33px'
				})
				.onStepEnter((response) => {
					currentNavElementIndex = response.index;
				});

			return scroller.destroy;
		}
	});
</script>

<Breadcrumb
	noTrailingSlash
	class="px-4 py-2 body-compact-01 [&>.bx--breadcrumb]:flex [&>.bx--breadcrumb]:flex-wrap"
>
	<BreadcrumbItem href="/">หน้าหลัก</BreadcrumbItem>
	<BreadcrumbItem>นักการเมือง</BreadcrumbItem>
	<BreadcrumbItem href="/politicians/{politician.id}" isCurrentPage
		>{politician.firstname} {politician.lastname}</BreadcrumbItem
	>
</Breadcrumb>
<header>
	<div class="max-w-[1200px] w-full mx-auto px-4 py-8 md:px-16 md:py-12">
		<PoliticianPicture
			class="mb-4 w-fit"
			avatar={politician.avatar}
			size="120"
			party={currentParty?.party}
			partySize="32"
		/>
		<div class="flex flex-col gap-8 md:flex-row md:gap-16">
			<div class="flex-1 flex flex-col gap-2">
				<h1 class="fluid-heading-05">
					{politician.prefix}
					{politician.firstname}
					{politician.lastname}
				</h1>
				<PositionStatus isActive={politician.isActive} />
				{#if currentRoles?.length > 0}
					<h2 class="heading-01 -mb-2">ตำแหน่งปัจจุบัน</h2>
					<ul class="body-01 list-disc ml-8">
						{#each currentRoles as role, idx (idx)}
							<!-- TODO: add link -->
							<li>
								{role.role} ใน
								<a class="text-black" href="/">{role.assembly.name} ชุดที่ {role.assembly.term}</a>
							</li>
						{/each}
					</ul>
				{/if}
			</div>
			<div class="flex flex-col gap-2">
				<DownloadData links={[{ label: 'ผลการลงมติรายคน', url: '/' }]} />
				<p class="label-01 text-gray-60">
					อัปเดตข้อมูล: {new Date().toLocaleDateString('th-TH', {
						year: 'numeric',
						month: 'short',
						day: 'numeric'
					})}
				</p>
				<!-- TODO: add link -->
				<!-- <a href="/" class="mr-auto helper-text-01"> ที่มาและข้อจำกัดข้อมูล </a> -->
				<Share label="แชร์ประวัติ" />
			</div>
		</div>
	</div>
</header>

<div class="bg-[--party]" style:--party={currentParty?.party.color ?? '#F4F4F4'}>
	<div
		class="max-w-[1200px] w-full mx-auto flex flex-col items-start gap-4 p-4 min-h-screen md:flex-row md:gap-8 md:py-8 md:px-16 heading-01"
	>
		<SideNav
			{currentNavElementIndex}
			assemblyRolesLength={politician.assemblyRoles.length}
			{partyCount}
			agreedVoting={agreedVoting.total}
			disagreedVoting={disagreedVoting.total}
			absentTotal={votingAbsentStats.absentVoting}
		/>
		<div class="flex-1 flex flex-col gap-6 w-full min-w-0">
			<Section id="personal" title="ข้อมูลพื้นฐาน">
				<General slot="icon" size="32" />
				<div>
					<p>
						<span class="heading-02">เพศ</span>
						{politician.sex}
						{#if politician.birthdate}
							{' '}<span class="heading-02">วันเกิด</span>
							{' '}{politician.birthdate.toLocaleDateString('th-TH', { dateStyle: 'long' })} ({dayjs().diff(
								politician.birthdate,
								'years'
							)} ปี)
						{/if}
					</p>

					{#if politician.educations.length > 0}
						<span class="heading-02">การศึกษา</span>
						<ul class="ml-8 list-disc">
							{#each politician.educations as education, idx (idx)}
								<li>{education}</li>
							{/each}
						</ul>
					{/if}
					{#if politician.previousOccupations.length > 0}
						<span class="heading-02">อาชีพเดิม</span>
						<ul class="ml-8 list-disc">
							{#each politician.previousOccupations as oldjob, idx (idx)}
								<li>{oldjob}</li>
							{/each}
						</ul>
					{/if}
				</div>
				<!-- TODO: debt won't be released in phase 1
					<hr class="border-0 border-solid border-gray-20 border-t w-full m-0 box-border" />
			<div>
				<ul class="mb-1">
					<li>
						<span class="heading-02">ทรัพย์สิน</span>
						{politician.assetValue.toLocaleString('th-TH')} บาท
					</li>
					<li>
						<span class="heading-02">หนี้สิน</span>
						{politician.debtValue.toLocaleString('th-TH')} บาท
					</li>
				</ul>
				<span class="label-01 text-gray-60">
					หมายเหตุ: ข้อมูลจากการยื่นบัญชีทรัพย์สินครั้งล่าสุด
				</span> -->
				<!-- TODO: Add link -->
				<!-- <a
					href="/"
					class="mr-auto helper-text-01 flex gap-2 items-center w-fit"
					target="_blank"
					rel="nofollow noopener noreferrer"
				>
					<span>ตรวจสอบประวัติทางธุรกิจ</span>
					<ArrowUpRight />
				</a>
			</div> -->
				{#if politician.contacts.length > 0}
					<hr class="border-0 border-solid border-gray-20 border-t w-full m-0 box-border" />
					<div>
						<span class="heading-02">ช่องทางติดต่อ</span>
						<ul class="flex flex-wrap gap-3 helper-text-01">
							{#each politician.contacts as contact (contact.label)}
								<li>
									<a href={contact.url} target="_blank" rel="nofollow noopener noreferrer">
										{contact.label}
									</a>
								</li>
							{/each}
						</ul>
					</div>
				{/if}
			</Section>
			<Section id="politics" title="ประวัติทางการเมือง">
				<Politician slot="icon" size="32" />
				<p slot="header-extension" class="label-01 text-gray-60">
					หมายเหตุ: ข้อมูลย้อนหลังถึงปี 2562
				</p>
				{#if politician.assemblyRoles.length > 0}
					<div>
						<h3 class="heading-02">{politician.assemblyRoles.length} ตำแหน่งทางการเมือง</h3>
						<ul class="ml-8 list-disc">
							{#each politician.assemblyRoles as role, idx (idx)}
								<li>
									{role.role}
									<!-- TODO: add links -->
									<a class="text-black" href="/">
										{role.assembly.abbreviation} ชุดที่ {role.assembly.term}
									</a>
									<span class="body-compact-02 text-gray-60">
										({role.startedAt.toLocaleDateString('th-TH', {
											month: 'short',
											year: '2-digit'
										})}
										- {role.endedAt
											? role.endedAt.toLocaleDateString('th-TH', {
													month: 'short',
													year: '2-digit'
											  })
											: 'ปัจจุบัน'})
									</span>
								</li>
							{/each}
						</ul>
					</div>
				{/if}
				{#if partyCount > 0}
					<hr class="border-0 border-solid border-gray-20 border-t w-full m-0 box-border" />
					<div>
						<h3 class="heading-02">{partyCount} พรรคที่เคยสังกัด</h3>
						<ul class="flex flex-col gap-[2px] ml-8 list-disc">
							{#each Object.entries(parties) as [party, partyData] (party)}
								<PartyDetail {party} data={partyData} />
							{/each}
						</ul>
					</div>
				{/if}
			</Section>
			<PoliticianVoteSummary {politician} {agreedVoting} {disagreedVoting} {votingAbsentStats} />
		</div>
	</div>
</div>
