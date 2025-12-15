<script lang="ts">
	import { Breadcrumb, BreadcrumbItem } from 'carbon-components-svelte';
	import { Link } from 'carbon-icons-svelte';
	import { groups } from 'd3';
	import dayjs from 'dayjs';
	import BillStatusTag from '$components/BillStatusTag/BillStatusTag.svelte';
	import BillCategoryTag from '$components/BillCategoryTag/BillCategoryTag.svelte';
	// import Tooltip from '$components/Assemblies/Tooltip.svelte';
	import Share from '$components/Share/Share.svelte';
	import LinkTable from '$components/LinkTable/LinkTable.svelte';
	import Proposer from '$components/Proposer/Proposer.svelte';
	import PoliticianProfile from '$components/PoliticianProfile/PoliticianProfile.svelte';
	import { showModalListCoProposer } from '$components/bills/store';
	import ModalListCoProposers from '$components/bills/ModalListCoProposers.svelte';
	import CoProposer from '$components/bills/CoProposer.svelte';
	import CoPartyProposer from '$components/bills/CoPartyProposer.svelte';
	import DataPeriodRemark from '$components/DataPeriodRemark/DataPeriodRemark.svelte';
	import { trimBreadcrumbTitle } from '$lib/breadcrumb.js';
	import ModalLawProcess from '$components/bills/ModalLawProcess.svelte';
	import Progress from '$components/bills/Progress.svelte';

	const NO_PARTY_FOUND_LABEL = 'ไม่พบข้อมูลพรรค';

	export let data;

	const { bill, proposer, coProposers, events } = data;

	// const tooltipText =
	// 	'ร่างกฎหมายฉบับหนึ่งสามารถถูกผนวกกับร่างอื่นในรัฐสภา เพื่อพิจารณาออกเป็นกฎหมายบทเดียวกันได้ เมื่อร่างกฎหมายมีวัตถุประสงค์เดียวกัน ซึ่งจะถูกผนวกกับร่างอื่นในชั้นการพิจารณาโดยสภาผู้แทนฯ หรือในสภาร่วม โดยขึ้นอยู่กับว่าเป็นการพิจารณากฎหมายประเภทใด';

	const MAX_DISPLAY_COPROPOSER = 8;

	const dateTimeFormat: Intl.DateTimeFormatOptions = {
		year: '2-digit',
		month: 'short',
		day: 'numeric'
	};

	$: displayName = bill.nickname || bill.title;

	$: proposedOn =
		bill.proposal_date && new Date(bill.proposal_date).toLocaleDateString('th-TH', dateTimeFormat);

	$: dayElapsed =
		bill.proposal_date &&
		dayjs(
			bill.status === 'IN_PROGRESS' ? undefined : events.find((event) => event.date)?.date
		).diff(bill.proposal_date, 'days');

	$: partiesCoProposed = groups(coProposers, ({ party }) => party?.name);

	let innerWidth = 0;
</script>

<svelte:window bind:innerWidth />

<Breadcrumb
	noTrailingSlash
	class="body-compact-01 px-4 py-2 [&>.bx--breadcrumb]:flex [&>.bx--breadcrumb]:flex-wrap"
>
	<BreadcrumbItem href="/">หน้าหลัก</BreadcrumbItem>
	<BreadcrumbItem href="/bills">ร่างกฎหมายในสภา</BreadcrumbItem>
	<BreadcrumbItem href="/bills/{bill.id}" isCurrentPage
		>{trimBreadcrumbTitle(displayName)}</BreadcrumbItem
	>
</Breadcrumb>

<div class="mx-auto flex w-full max-w-[1200px] flex-col">
	<section class="px-4 py-8 md:px-16 md:py-12">
		<div class="flex flex-col gap-1">
			<h1 class="fluid-heading-05 text-text-primary">{displayName}</h1>
			{#if bill.nickname}
				<p class="text-text-02">
					<b>ชื่อทางการ</b>
					{bill.title}
				</p>
			{/if}
			<div class="-ml-1 flex items-center gap-1 font-bold">
				<BillStatusTag isLarge status={bill.status} />
				<b class="text-support-04">ใช้เวลา {dayElapsed} วัน</b>
			</div>
		</div>
		<div class="mt-7 flex flex-col gap-8 md:flex-row md:gap-16">
			<div class="flex flex-1 flex-col gap-5">
				<div class="flex gap-4">
					<div>
						<b>วันที่เสนอ</b>
						<p>{proposedOn}</p>
					</div>
					<div>
						<b>เสนอโดย</b>
						<Proposer
							proposer={proposer && 'assemblyMembership' in proposer
								? {
										id: proposer.id,
										name: proposer.name,
										image: proposer.image,
										assemblyPost: proposer.assemblyMembership?.posts[0]?.label,
										assembly: proposer.assemblyMembership?.posts[0]?.organizations[0],
										partyName: proposer.partyMembership?.posts[0]?.organizations[0]?.name
									}
								: proposer}
						/>
					</div>
				</div>
				<hr class="border-gray-30" />
				{#if bill.text}
					<div>
						<b>สรุปเนื้อหา</b>
						<p class="whitespace-pre-wrap">{bill.text}</p>
					</div>
				{/if}
				{#if bill.categories?.length}
					<div class="flex gap-2">
						<b>หมวด</b>
						{#each bill.categories as category (category)}
							<BillCategoryTag label={category} />
						{/each}
					</div>
				{/if}
				<!-- TODO: No merged bill data yet -->
				<!-- {#if mergedBills?.length > 0}
					<div>
						<div class="flex items-center gap-1">
							<DocumentMultiple_02 size={24} color="#2600A3" />
							<span>
								<b>ร่างกฎหมาย {mergedBills.length} ฉบับ ที่ถูกนำมารวมกับร่างนี้</b>
								<Tooltip
									class="absolute ml-1 mt-0.5"
									{tooltipText}
									direction="top"
									align={innerWidth <= 500 ? (innerWidth <= 366 ? 'center' : 'end') : 'center'}
								>
									<Information color="#525252" />
								</Tooltip>
							</span>
						</div>
						<ul class="ml-8 mt-1 list-disc">
							{#each mergedBills as mergedBill}
								<li>
									<u>{mergedBill.nickname}</u>
									<br />
									<span class="text-text-02"
										>โดย
										{#if mergedBill.proposerType === BillProposerType.Politician && mergedBill.proposedLedByPolitician}
											{@const matchedParty = getMatchedParty(mergedBill.proposedLedByPolitician)}
											{mergedBill.proposedLedByPolitician.firstname +
											' ' +
											mergedBill.proposedLedByPolitician.lastname +
											' ' +
											getCurrentRoles(mergedBill.proposedLedByPolitician) +
											' ' +
											matchedParty
												? `พรรค${matchedParty?.name}`
												: ''}
										{:else if mergedBill.proposerType === BillProposerType.Assembly && mergedBill.proposedByAssembly}
											{mergedBill.proposedByAssembly.abbreviation
												? mergedBill.proposedByAssembly.name
												: mergedBill.proposedByAssembly.abbreviation} ชุดที่
											{mergedBill.proposedByAssembly.term}
										{:else if mergedBill.proposerType === BillProposerType.People && mergedBill.proposedByPeople}
											{mergedBill.proposedByPeople.ledBy +
												' และประชาชน' +
												mergedBill.proposedByPeople.signatoryCount +
												' คน'}
										{/if}
									</span>
								</li>
							{/each}
						</ul>
					</div>
				{/if} -->
			</div>
			<div class="flex flex-col gap-2 md:w-56">
				<LinkTable
					title="ลิงก์ที่เกี่ยวข้อง"
					icon={Link}
					links={bill.links.map(({ url, note }) => ({ url, label: note ?? url }))}
				/>
				<DataPeriodRemark />
				<Share label="แชร์หน้านี้" />
			</div>
		</div>
	</section>

	{#if proposer && 'assemblyMembership' in proposer && coProposers.length}
		{@const { id, name, image, assemblyMembership, partyMembership } = proposer}
		{@const party = partyMembership?.posts[0]?.organizations[0]}

		<section class="px-4 py-8 md:px-16 md:py-12">
			<div class="flex flex-col gap-5">
				<h1 class="fluid-heading-04 text-text-primary">รายชื่อผู้เสนอกฎหมาย</h1>
				<hr class="border-gray-30" />
				<div class="flex flex-col gap-7 md:flex-row">
					<div class="flex flex-col gap-3 md:w-1/3">
						<b class="handing-02 text-text-primary">ผู้เสนอ</b>
						<PoliticianProfile
							{id}
							{name}
							avatar={image ?? undefined}
							partyName={party?.name}
							partyLogo={party?.image ?? undefined}
							role={assemblyMembership?.posts?.[0]?.label}
						/>
					</div>
					<div class="flex flex-col gap-3 md:w-full">
						<p class="body-02 text-text-02">
							<b class="handing-02 text-text-primary">ผู้ร่วมเสนอ</b>
							{coProposers.length} คน
						</p>
						<div class="flex flex-col flex-wrap gap-3 px-3 md:flex-row">
							{#each partiesCoProposed as [partyName, politicians] (partyName)}
								<CoPartyProposer
									party={politicians[0].party ?? { name: NO_PARTY_FOUND_LABEL }}
									politicianCount={politicians.length}
								/>
							{/each}
						</div>
						<div class="flex flex-col gap-2 px-5">
							<p class="label-01 mr-2 text-text-02">เรียงตามตัวอักษร</p>

							<div class="relative flex flex-col">
								<table class="w-full">
									{#each coProposers.slice(0, MAX_DISPLAY_COPROPOSER) as politician, i (politician.id)}
										<CoProposer index={i + 1} {politician} partyLogo={politician.party?.image} />
									{/each}
								</table>
								{#if coProposers.length > MAX_DISPLAY_COPROPOSER}
									<div
										class="absolute bottom-0 h-12 w-full"
										style="background: linear-gradient(0deg, #FFF 0%, rgba(255, 255, 255, 0.00) 100%);"
									>
										<button
											on:click={() => {
												$showModalListCoProposer = true;
											}}
											class="body-01 absolute bottom-0 text-link-01 underline">ดูทั้งหมด</button
										>
									</div>
								{/if}
							</div>
							<ModalListCoProposers
								coProposedByPoliticians={coProposers.map(({ party: coParty, ...politician }) => ({
									politician,
									partyLogo: coParty?.image
								}))}
							/>
						</div>
						<div />
					</div>
				</div>
			</div>
		</section>
	{/if}

	<!-- TODO: Bill Events -->
	{#if events.length > 0}
		<section class="px-4 py-8 md:px-16 md:py-12">
			<div class="flex flex-col gap-5">
				<h1 class="fluid-heading-04 text-text-primary">เส้นทางกฎหมาย</h1>
				<hr class="border-gray-30" />
				<div class="flex flex-col justify-between md:flex-row">
					<div class="flex items-center gap-1">
						<b>สถานะ</b>
						<BillStatusTag isLarge status={bill.status} />
					</div>
					<div>
						<ModalLawProcess />
					</div>
				</div>
				<div>
					<ol
						class="relative ml-2 border border-b-[transparent] border-e-[transparent] border-t-[transparent]"
					>
						{#each events.slice(0, events.length - 1) as event, i (i)}
							<Progress {...event} />
						{/each}
					</ol>
					<div>
						<ol class="relative ml-2">
							<Progress {...events[events.length - 1]} />
						</ol>
					</div>
				</div>
			</div>
		</section>
	{/if}
</div>
