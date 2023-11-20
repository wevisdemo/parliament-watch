<script lang="ts">
	export let data;
	import { Breadcrumb, BreadcrumbItem } from 'carbon-components-svelte';
	import { DocumentMultiple_02, Information, ArrowRight, Undefined } from 'carbon-icons-svelte';
	import BillStatusTag from '$components/BillStatusTag/BillStatusTag.svelte';
	import BillCategoryTag from '$components/BillCategoryTag/BillCategoryTag.svelte';
	import Tooltip from '$components/Assemblies/Tooltip.svelte';
	import Share from '$components/Share/Share.svelte';
	import DownloadData from '$components/DownloadData/DownloadData.svelte';
	import { BillProposerType } from '$models/bill';
	import Proposer from '$components/Proposer/Proposer.svelte';
	import PoliticianProfile from '$components/PoliticianProfile/PoliticianProfile.svelte';
	import CheckmarkFilled from 'carbon-icons-svelte/lib/CheckmarkFilled.svelte';
	import CircleDash from 'carbon-icons-svelte/lib/CircleDash.svelte';
	import Misuse from 'carbon-icons-svelte/lib/Misuse.svelte';
	import { range } from 'd3';
	import { EventActionType, EventStatus } from '$models/event';
	import VoteCard from '$components/VoteCard/VoteCard.svelte';
	import type { VoteCardProps } from '../../assemblies/[id]/+page.js';

	const toolrtip = 'การรวมร่างกฎหมาย คือ xxxxxxxxxxxxxxx';

	const { bill, mergedBills, events, mergedIntoBill, relatedVotingResults } = data;
	const dateTimeFormat: Intl.DateTimeFormatOptions = {
		year: '2-digit',
		month: 'short',
		day: 'numeric'
	};
	const proposedOn = bill.proposedOn.toLocaleDateString('th-TH', dateTimeFormat);

	const eventDescription = {
		hearing: {
			title: 'รับฟังความเห็น',
			description: ''
		},
		mp1: {
			title: 'สส. พิจารณา วาระ 1',
			description: 'รับหลักการและตั้งกรรมาธิการ'
		},
		mp2: {
			title: 'สส. พิจารณา วาระ 2',
			description: 'ขั้นกรรมาธิการ และ สส. ลงมติรับรายมาตรา'
		},
		mp3: {
			title: 'สส. พิจารณา วาระ 3',
			description: 'ขั้นลงมติเห็นชอบ'
		},
		senate1: {
			title: 'สว. พิจารณา วาระ 1',
			description: 'รับหลักการและตั้งกรรมาธิการ'
		},
		senate2: {
			title: 'สว. พิจารณา วาระ 2',
			description: 'ขั้นกรรมาธิการ และ สส. ลงมติรับรายมาตรา'
		},
		senate3: {
			title: 'สว. พิจารณา วาระ 3',
			description: 'ขั้นลงมติเห็นชอบ'
		},
		royalAssent: {
			title: 'พระมหากษัตริย์ลงปรมาภิไธย',
			description: ''
		},
		enforcement: {
			title: 'ออกเป็นกฎหมาย',
			description: ''
		},
		other: {
			title: 'รับฟังความเห็น',
			description: ''
		}
	};

	function getVoting(id: number | undefined) {
		if (id === undefined) return undefined;
		let voting: VoteCardProps['voting'] = {
			id: Number(events[id].votedInVotingId),
			date: relatedVotingResults[Number(events[id].votedInVotingId)].voting.date,
			title: relatedVotingResults[Number(events[id].votedInVotingId)].voting.title,
			result: relatedVotingResults[Number(events[id].votedInVotingId)].voting.result
		};
		return voting;
	}

	function getHighlightedVoteByGroups(id: number | undefined) {
		if (id === undefined) return undefined;
		return relatedVotingResults[id].resultSummary.subResults?.map((subResult) => {
			return {
				name: subResult.affiliationName,
				count: Number(subResult.agreed),
				total: Number(subResult.total)
			};
		});
	}

	const lastestEvent = events[events.length - 1];
</script>

<Breadcrumb
	noTrailingSlash
	class="px-4 py-2 body-compact-01 [&>.bx--breadcrumb]:flex [&>.bx--breadcrumb]:flex-wrap"
>
	<BreadcrumbItem href="/">หน้าหลัก</BreadcrumbItem>
	<BreadcrumbItem href="/bills/{bill.id}">การเสนอกฏหมาย</BreadcrumbItem>
	<BreadcrumbItem href="/bills/{bill.id}" isCurrentPage>{bill.nickname}</BreadcrumbItem>
</Breadcrumb>

<div class="flex flex-col w-full">
	<section class="px-4 py-8 md:px-16 md:py-12">
		<div class="flex flex-col gap-1">
			<h1 class="fluid-heading-05 text-text-primary">{bill.nickname}</h1>
			<p class="text-text-02">
				<b>ชื่อทางการ</b>
				{bill.title}
			</p>
			<div class="flex items-center gap-1 font-bold">
				<BillStatusTag isLarge={true} status={bill.status} />
				<b class="text-support-04">ใช้เวลา x วัน</b>
			</div>
		</div>
		<div class="flex flex-col gap-8 md:flex-row md:gap-16">
			<div class="flex-1 flex flex-col gap-5">
				<div class="flex gap-4">
					<div>
						<b>วันที่เสนอ</b>
						<p>{proposedOn}</p>
					</div>
					<div>
						<b>เสนอโดย</b>
						{#if bill.proposerType === BillProposerType.Politician}
							<div class="flex flex-col md:flex-row gap-1">
								<img
									src={bill.proposedLedByPolitician?.avatar}
									alt={bill.proposedLedByPolitician?.firstname +
										' ' +
										bill.proposedLedByPolitician?.lastname}
									class="w-8 h-8 rounded-full object-cover bg-cool-gray-50"
								/>
								<div>
									<p>
										{bill.proposedLedByPolitician?.firstname}
										{bill.proposedLedByPolitician?.lastname}
									</p>
									<p class="text-text-02">
										พรรค{bill.proposedLedByPolitician?.partyRoles[0].party.name}
									</p>
								</div>
							</div>
							<!-- <Proposer
								partyPolitician={{
									politician: bill.proposedLedByPolitician
								}}
							/> -->
						{:else if bill.proposerType === BillProposerType.Cabinet}
							<Proposer />
						{:else if bill.proposerType === BillProposerType.People && bill.proposedByPeople !== undefined}
							<Proposer
								common={{
									name: bill.proposedByPeople.leadBy,
									description: 'และประชาชน ' + bill.proposedByPeople.signatoryCount + ' คน'
								}}
							/>
						{/if}
					</div>
				</div>
				<hr class="border-gray-30" />
				<div>
					<b>สรุปเนื้อหา</b>
					<p>{bill.description}</p>
				</div>
				<div class="flex gap-2">
					<b>หมวด</b>
					{#each bill.categories as category}
						<BillCategoryTag label={category} />
					{/each}
				</div>
				<div>
					<b>นโยบายที่เกี่ยวข้อง</b>
					<div class="flex justify-between gap-6 p-5 bg-gray-10">
						<div class="flex flex-col">
							<h2 class="luid-heading-03">xxxxxxxxx</h2>
							<p class="text-text-02">หาเสียงโดย</p>
							<div class="flex gap-1 items-center">
								<img src="" alt="" class="w-5 h-5 rounded-full object-cover bg-cool-gray-50" />
								<b>xxx</b>
								<p>ปี xxx</p>
							</div>
						</div>
						<ArrowRight size={24} />
					</div>
				</div>
				{#if mergedBills !== undefined && mergedBills.length > 0}
					<div>
						<div class="flex gap-1 items-center">
							<DocumentMultiple_02 size={24} color="#2600A3" />
							<b>ร่างกฎหมาย x ฉบับ ที่ถูกนำมารวมกับร่างนี้</b>
							<Tooltip tooltipText={toolrtip} direction="top">
								<Information color="#525252" data-tool />
							</Tooltip>
						</div>
						<ul class="ml-8 mt-1 list-disc">
							{#each mergedBills as mergedBill, idx}
								<li>
									<u>{mergedBill.nickname}</u>
									<br />
									<span class="text-text-02"
										>โดย
										{#if mergedBill.proposerType === BillProposerType.Politician && mergedBill.proposedLedByPolitician !== undefined}
											{mergedBill.proposedLedByPolitician.firstname +
												' ' +
												mergedBill.proposedLedByPolitician.lastname +
												' xxx'}
										{:else if mergedBill.proposerType === BillProposerType.Cabinet && mergedBill.proposedByCabinetId !== undefined}
											{'ครม. ชุดที่ xx'}
										{:else if mergedBill.proposerType === BillProposerType.People && mergedBill.proposedByPeople !== undefined}
											{mergedBill.proposedByPeople.leadBy +
												' และประชาชน' +
												mergedBill.proposedByPeople.signatoryCount +
												' คน'}
										{/if}
									</span>
								</li>
							{/each}
						</ul>
					</div>
				{/if}
			</div>
			<div class="flex flex-col gap-2 md:w-56">
				<DownloadData links={[{ label: 'เอกสารxxxx', url: '/' }]} />
				<p class="label-01 text-text-02">อัปเดตข้อมูล: 18 ส.ค. 2566</p>
				<!-- TODO: add link -->
				<a href="/" class="mr-auto helper-text-01 underline"> ที่มาและข้อจำกัดข้อมูล </a>
				<Share label="แชร์มติ" />
			</div>
		</div>
	</section>

	{#if bill.proposerType === BillProposerType.Politician && bill.proposedLedByPolitician !== undefined && bill.coProposedByPoliticians !== undefined}
		<section title="List of legal proponents" class="px-4 py-8 md:px-16 md:py-12">
			<div class="flex flex-col gap-5">
				<h1 class="fluid-heading-04 text-text-primary">รายชื่อผู้เสนอกฏหมาย</h1>
				<hr class="border-gray-30" />
				<div class="flex flex-col gap-7 md:flex-row">
					<div class="flex flex-col gap-3">
						<b class="handing-02 text-text-primary">ผู้เสนอ</b>
						<PoliticianProfile
							id={bill.proposedLedByPolitician.id}
							firstname={bill.proposedLedByPolitician.firstname}
							lastname={bill.proposedLedByPolitician.lastname}
							avatar={bill.proposedLedByPolitician.avatar}
							party={bill.proposedLedByPolitician.partyRoles[0].party}
							role="xxxxxxxxxxxxxx"
						/>
					</div>
					<div class="flex flex-col gap-3">
						<p class="body-02 text-text-02">
							<b class="handing-02 text-text-primary">ผู้ร่วมเสนอ</b> xx คน
						</p>
						<div>
							<p class="body-01 text-text-02 mr-2">เรียงตามตัวอักษร</p>
							TO DO Popup
							{#each bill.coProposedByPoliticians as coProposed, i}
								<div class="flex gap-1 items-center">
									<p class="body-01 text-text-02 mr-2">{i}</p>
									<div
										class="w-5 h-5 rounded-full object-cover border border-gray-30 items-center justify-center overflow-hidden"
									>
										<img src={coProposed.partyRoles[0].party.logo} alt="" />
									</div>
									<p class="underline">{coProposed.firstname + ' ' + coProposed.lastname}</p>
								</div>
							{/each}
						</div>
						<div />
					</div>
				</div>
			</div>
		</section>
	{/if}

	<section title="legal path" class="px-4 py-8 md:px-16 md:py-12">
		<div class="flex flex-col gap-5">
			<h1 class="fluid-heading-04 text-text-primary">เส้นทางกฏหมาย</h1>
			<hr class="border-gray-30" />
			<div class="flex flex-col md:flex-row justify-between">
				<div class="flex items-center gap-1">
					<b>สถานะ</b>
					<BillStatusTag isLarge={true} status={bill.status} />
				</div>
				<div>
					TO DO Popup
					<p class="helper-text-01 text-link-01 underline">
						มีขั้นตอนอะไรบ้างกว่าจะผ่านกฏหมายสำเร็จ?
					</p>
				</div>
			</div>
			<div title="timeline">
				<ol
					class="relative ml-2 border border-t-[transparent] border-e-[transparent] border-b-[transparent]"
				>
					{#each range(events.length - 1) as i}
						<li class="mb-10 ms-4">
							<CheckmarkFilled size={24} class="absolute -start-3 bg-ui-background" />
							<div class="flex flex-col md:flex-row">
								<div class="flex flex-col ml-1 md:basis-1/3">
									<p>
										{events[i].date.toLocaleDateString('th-TH', dateTimeFormat)}
									</p>
									<b>{eventDescription[events[i].type].title}</b>
									<p>{eventDescription[events[i].type].description}</p>
								</div>
								{#if events[i].actionType !== undefined && events[i].actionType === EventActionType.Voted && events[i].votedInVotingId !== undefined}
									<VoteCard
										voting={getVoting(events[i].votedInVotingId)}
										highlightedVoteByGroups={getHighlightedVoteByGroups(events[i].votedInVotingId)}
									/>
								{/if}
							</div>
						</li>
					{/each}
				</ol>
				<div title="End timeline">
					<ol class="relative ml-2">
						<li class="mb-10 ms-4">
							{#if lastestEvent.status === EventStatus.Succeed}
								<CheckmarkFilled size={24} class="absolute -start-3 bg-ui-background" />
							{:else if lastestEvent.status === EventStatus.InProgress}
								<CircleDash size={24} class="absolute -start-3 " color="#8D8D8D" />
							{:else if lastestEvent.status === EventStatus.Failed}
								<Misuse size={24} class="absolute -start-3" color="#981B00" />
							{/if}
							<div class="flex flex-col md:flex-row">
								<div class="flex flex-col ml-1 md:basis-1/3">
									{#if lastestEvent.status !== 'in-progress'}
										<p>
											{lastestEvent.date.toLocaleDateString('th-TH', dateTimeFormat)}
										</p>
									{/if}
									<div
										class={lastestEvent.status === 'in-progress'
											? 'text-text-02'
											: 'text-text-primary'}
									>
										<b>{eventDescription[lastestEvent.type].title}</b>
										<p>{eventDescription[lastestEvent.type].description}</p>
									</div>
								</div>
								{#if lastestEvent.actionType !== undefined && lastestEvent.actionType === EventActionType.Voted}
									<div class="w-full mr-0">
										<VoteCard
											voting={getVoting(lastestEvent.votedInVotingId)}
											highlightedVoteByGroups={getHighlightedVoteByGroups(
												lastestEvent.votedInVotingId
											)}
										/>
									</div>
								{/if}
							</div>
						</li>
					</ol>
				</div>
			</div>
		</div>
	</section>
</div>
