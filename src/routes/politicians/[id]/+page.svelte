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
	import LinkTable from '$components/LinkTable/LinkTable.svelte';
	import PoliticianPicture from '$components/PoliticianPicture/PoliticianPicture.svelte';
	import dayjs from 'dayjs';
	import scrollama from 'scrollama';
	import { onMount } from 'svelte';
	import PoliticianVoteSummary from '$components/politicians/PoliticianVoteSummary.svelte';
	import DataPeriodRemark from '$components/DataPeriodRemark/DataPeriodRemark.svelte';
	import { groups } from 'd3';

	type PartyRole = 'หัวหน้าพรรคการเมือง' | 'สมาชิกพรรคการเมือง';

	export let data;

	$: ({ politician, agreedVoting, disagreedVoting, votingAbsentStats } = data);

	$: partyMemberships = politician.memberships.filter(
		(m) => m.posts[0].organizations[0].classification === 'POLITICAL_PARTY'
	);
	$: currentMembership = partyMemberships.find(isCurrent);
	$: currentPartyRole = currentMembership?.posts[0].role as PartyRole;
	$: currentParty = currentMembership?.posts[0].organizations[0];
	$: membershipInEachParties = groups(partyMemberships, (m) => m.posts[0].organizations[0].name);
	$: assemblyMemberships = politician.memberships.filter(
		(m) => m.posts[0].organizations[0].classification !== 'POLITICAL_PARTY'
	);
	$: currentAssemblyMemberships = assemblyMemberships.filter(isCurrent);

	const roleAliases = {
		หัวหน้าพรรคการเมือง: 'หัวหน้า',
		สมาชิกพรรคการเมือง: 'สมาชิก'
	} satisfies Record<PartyRole, string>;

	let currentNavElementIndex = 0;

	function isCurrent({ end_date }: { end_date: string | null }): boolean {
		return end_date === null;
	}

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
	class="body-compact-01 px-4 py-2 [&>.bx--breadcrumb]:flex [&>.bx--breadcrumb]:flex-wrap"
>
	<BreadcrumbItem href="/">หน้าหลัก</BreadcrumbItem>
	<BreadcrumbItem>นักการเมือง</BreadcrumbItem>
	<BreadcrumbItem href="/politicians/{politician.id}" isCurrentPage
		>{politician.name}</BreadcrumbItem
	>
</Breadcrumb>
<header>
	<div class="mx-auto w-full max-w-[1200px] px-4 py-8 md:px-16 md:py-12">
		<PoliticianPicture
			class="mb-4 w-fit"
			avatar={politician.image ?? undefined}
			size="120"
			partyLogo={currentParty?.image ?? undefined}
			partySize="32"
		/>
		<div class="flex flex-col gap-8 md:flex-row md:gap-16">
			<div class="flex flex-1 flex-col gap-2">
				<h1 class="fluid-heading-05">
					{politician.prefix}
					{politician.name}
				</h1>
				<PositionStatus
					isActive={currentAssemblyMemberships.some(
						(m) => isCurrent(m) && !m.posts[0].organizations[0].dissolution_date
					)}
				/>
				{#if currentAssemblyMemberships.length}
					<h2 class="heading-01 -mb-2">ตำแหน่งปัจจุบัน</h2>
					<ul class="body-01 ml-8 list-disc">
						{#each currentAssemblyMemberships as { posts: [post] }, idx (idx)}
							<!-- TODO: add link -->
							<li>
								{post.role} ใน
								<a class="text-black" href="/">{post.organizations[0].name}</a>
							</li>
						{/each}
						<li>
							{roleAliases[currentPartyRole]}
							พรรค{currentParty?.name}
						</li>
					</ul>
				{/if}
			</div>
			<div class="flex flex-col gap-2">
				<LinkTable
					links={[
						{
							label: 'ผลการลงมติรายคน',
							url: `/files/download/politicians/${politician.id}-votes.csv`
						}
					]}
				/>
				<DataPeriodRemark />
				<Share label="แชร์ประวัติ" />
			</div>
		</div>
	</div>
</header>

<div class="bg-[--party]" style:--party={currentParty?.color ?? '#F4F4F4'}>
	<div
		class="heading-01 mx-auto flex min-h-screen w-full max-w-[1200px] flex-col items-start gap-4 p-4 md:flex-row md:gap-8 md:px-16 md:py-8"
	>
		<SideNav
			{currentNavElementIndex}
			assemblyRolesLength={assemblyMemberships.length}
			partyCount={membershipInEachParties.length}
			agreedVoting={agreedVoting.total}
			disagreedVoting={disagreedVoting.total}
			absentTotal={votingAbsentStats.absentVoting}
		/>
		<div class="flex w-full min-w-0 flex-1 flex-col gap-6">
			<Section id="personal" title="ข้อมูลพื้นฐาน">
				<General slot="icon" size="32" />
				<div>
					<p>
						{#if politician.gender}
							<span class="heading-02">เพศ</span>
							{politician.gender === 'MALE' ? 'ชาย' : 'หญิง'}
						{/if}
						{#if politician.birth_date}
							{' '}<span class="heading-02">วันเกิด</span>
							{' '}{new Date(politician.birth_date).toLocaleDateString('th-TH', {
								dateStyle: 'long'
							})} ({dayjs().diff(politician.birth_date, 'years')} ปี)
						{/if}
					</p>

					{#if politician.educations}
						<span class="heading-02">การศึกษา</span>
						<ul class="ml-8 list-disc">
							{#each politician.educations.split('\n') as education, idx (idx)}
								<li>{education.replace('-', '').trim()}</li>
							{/each}
						</ul>
					{/if}
					{#if politician.previous_occupations}
						<span class="heading-02">อาชีพเดิม</span>
						<ul class="ml-8 list-disc">
							{#each politician.previous_occupations.split('\n') as oldjob, idx (idx)}
								<li>{oldjob.replace('-', '').trim()}</li>
							{/each}
						</ul>
					{/if}
				</div>
				<!-- TODO: debt won't be released in phase 1
					<hr class="box-border w-full m-0 border-0 border-t border-solid border-gray-20" />
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
					class="flex items-center gap-2 mr-auto helper-text-01 w-fit"
					target="_blank"
					rel="nofollow noopener noreferrer"
				>
					<span>ตรวจสอบประวัติทางธุรกิจ</span>
					<ArrowUpRight />
				</a>
			</div> -->
				{#if politician.links.length}
					<hr class="m-0 box-border w-full border-0 border-t border-solid border-gray-20" />
					<div>
						<span class="heading-02">ช่องทางติดต่อ</span>
						<ul class="helper-text-01 flex flex-wrap gap-3">
							{#each politician.links as contact (contact.note)}
								<li>
									<a href={contact.url} target="_blank" rel="nofollow noopener noreferrer">
										{contact.note}
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
					หมายเหตุ : ข้อมูลย้อนหลังถึงปี 2562
				</p>
				{#if assemblyMemberships.length}
					<div>
						<h3 class="heading-02">{assemblyMemberships.length} ตำแหน่งทางการเมือง</h3>
						<ul class="ml-8 list-disc">
							{#each assemblyMemberships as { posts: [post], start_date, end_date }, idx (idx)}
								<li>
									{post.role}
									<a class="text-black underline" href="/assemblies/{post.organizations[0].id}">
										{post.organizations[0].name}
									</a>
									<span class="body-compact-02 text-gray-60">
										({new Date(start_date).toLocaleDateString('th-TH', {
											month: 'short',
											year: '2-digit'
										})}
										- {end_date
											? new Date(end_date).toLocaleDateString('th-TH', {
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
				{#if membershipInEachParties.length}
					<hr class="m-0 box-border w-full border-0 border-t border-solid border-gray-20" />
					<div>
						<h3 class="heading-02">{membershipInEachParties.length} พรรคที่เคยสังกัด</h3>
						<ul class="ml-8 flex list-disc flex-col gap-[2px]">
							{#each membershipInEachParties as [party, memberships] (party)}
								<PartyDetail {party} {memberships} />
							{/each}
						</ul>
					</div>
				{/if}
			</Section>
			<PoliticianVoteSummary
				politicianId={politician.id}
				politicianFirstname={politician.firstname}
				{agreedVoting}
				{disagreedVoting}
				{votingAbsentStats}
			/>
		</div>
	</div>
</div>
