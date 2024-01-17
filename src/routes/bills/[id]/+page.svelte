<script lang="ts">
	export let data;
	import { Breadcrumb, BreadcrumbItem } from 'carbon-components-svelte';
	import { DocumentMultiple_02, Information } from 'carbon-icons-svelte';
	import BillStatusTag from '$components/BillStatusTag/BillStatusTag.svelte';
	import BillCategoryTag from '$components/BillCategoryTag/BillCategoryTag.svelte';
	import Tooltip from '$components/Assemblies/Tooltip.svelte';
	import Share from '$components/Share/Share.svelte';
	import DownloadData from '$components/DownloadData/DownloadData.svelte';
	import { BillProposerType, BillStatus } from '$models/bill';
	import Proposer from '$components/Proposer/Proposer.svelte';
	import PoliticianProfile from '$components/PoliticianProfile/PoliticianProfile.svelte';
	import ModalLawProcess from '$components/bills/ModalLawProcess.svelte';
	import { showModalLawProcess, showModalListCoProposer } from '$components/bills/store';
	import ModalListCoProposers from '$components/bills/ModalListCoProposers.svelte';
	import CoProposer from '$components/bills/CoProposer.svelte';
	import type { Politician } from '$models/politician.js';
	import CoPartyProposer from '$components/bills/CoPartyProposer.svelte';
	import Progress from '$components/bills/Progress.svelte';

	const {
		bill,
		mergedBills,
		events,
		mergedIntoBill,
		mergedIntoBillLatestEvent,
		relatedVotingResults
	} = data;

	const tooltipText =
		'ร่างกฎหมายฉบับหนึ่งสามารถถูกผนวกกับร่างอื่นในรัฐสภา เพื่อพิจารณาออกเป็นกฎหมายบทเดียวกันได้ เมื่อร่างกฎหมายมีวัตถุประสงค์เดียวกัน ซึ่งจะถูกผนวกกับร่างอื่นในชั้นการพิจารณาโดยสภาผู้แทนฯ หรือในสภาร่วม โดยขึ้นอยู่กับว่าเป็นการพิจารณากฎหมายประเภทใด';

	const MAX_DISPLAY_COPROPOSER = 8;

	const dateTimeFormat: Intl.DateTimeFormatOptions = {
		year: '2-digit',
		month: 'short',
		day: 'numeric'
	};
	const proposedOn = bill.proposedOn.toLocaleDateString('th-TH', dateTimeFormat);

	const groupBy = <T, K extends string>(arr: T[], groupFn: (element: T) => K): Record<K, T[]> =>
		arr.reduce(
			(r, v, _i, _a, k = groupFn(v)) => ((r[k] || (r[k] = [])).push(v), r),
			{} as Record<K, T[]>
		);
	const partiescoProposed = bill.coProposedByPoliticians
		? groupBy(
				bill.coProposedByPoliticians,
				(politician) => politician.partyRoles.find((e) => !e.endedAt)!.party.name
		  )
		: null;

	function getCurrentParty(politician: Politician) {
		let partyRole = politician.partyRoles.find((e) => !e.endedAt);
		if (partyRole) {
			return 'พรรค' + partyRole.party.name;
		}
		return '';
	}

	function getCurrentRoles(politician: Politician) {
		let assemblyRole = politician.assemblyRoles.find((e) => !e.endedAt);
		if (assemblyRole) {
			let year = new Date(
				assemblyRole.assembly.startedAt.toLocaleDateString('th-TH')
			).getFullYear();
			return (
				assemblyRole.assembly.abbreviation +
				' ชุดที่ ' +
				assemblyRole.assembly.term +
				' (' +
				year +
				')'
			);
		}
		return '';
	}

	const lastestEvent = events.reduce((a, b) => {
		return new Date(a.date) > new Date(b.date) ? a : b;
	});

	function getNumberOfDays() {
		const start = bill.proposedOn;
		const end = bill.status === BillStatus.InProgress ? new Date() : new Date(lastestEvent.date);
		const timeDifference = Math.abs(end.getTime() - start.getTime());
		const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
		return daysDifference;
	}
	$: innerWidth = 0;
</script>

<svelte:window bind:innerWidth />

<Breadcrumb
	noTrailingSlash
	class="px-4 py-2 body-compact-01 [&>.bx--breadcrumb]:flex [&>.bx--breadcrumb]:flex-wrap"
>
	<BreadcrumbItem href="/">หน้าหลัก</BreadcrumbItem>
	<BreadcrumbItem href="/bills">การเสนอกฏหมาย</BreadcrumbItem>
	<BreadcrumbItem href="/bills/{bill.id}" isCurrentPage>{bill.nickname}</BreadcrumbItem>
</Breadcrumb>

<div class="flex flex-col max-w-[1200px] mx-auto w-full">
	<section class="px-4 py-8 md:px-16 md:py-12">
		<div class="flex flex-col gap-1">
			<h1 class="fluid-heading-05 text-text-primary">{bill.nickname}</h1>
			<p class="text-text-02">
				<b>ชื่อทางการ</b>
				{bill.title}
			</p>
			<div class="flex items-center gap-1 font-bold -ml-1">
				<BillStatusTag isLarge status={bill.status} />
				<b class="text-support-04">ใช้เวลา {getNumberOfDays()} วัน</b>
			</div>
		</div>
		<div class="flex flex-col gap-8 mt-7 md:flex-row md:gap-16">
			<div class="flex-1 flex flex-col gap-5">
				<div class="flex gap-4">
					<div>
						<b>วันที่เสนอ</b>
						<p>{proposedOn}</p>
					</div>
					<div>
						<b>เสนอโดย</b>
						{#if bill.proposerType === BillProposerType.Politician && bill.proposedLedByPolitician}
							<div class="flex flex-col md:flex-row gap-1">
								<img
									src={bill.proposedLedByPolitician.avatar}
									alt={bill.proposedLedByPolitician.firstname +
										' ' +
										bill.proposedLedByPolitician.lastname}
									class="w-6 h-6 rounded-full object-cover bg-cool-gray-50"
								/>
								<div>
									<div class="flex flex-wrap gap-1">
										<p>
											{bill.proposedLedByPolitician.firstname}
											{bill.proposedLedByPolitician.lastname}
										</p>
										<u>
											{getCurrentRoles(bill.proposedLedByPolitician)}
										</u>
									</div>

									<p class="text-text-02">
										{getCurrentParty(bill.proposedLedByPolitician)}
									</p>
								</div>
							</div>
						{:else if bill.proposerType === BillProposerType.Cabinet}
							<Proposer assembly={bill.proposedByAssembly} />
						{:else if bill.proposerType === BillProposerType.People && bill.proposedByPeople !== undefined}
							<Proposer
								common={{
									name: bill.proposedByPeople.ledBy,
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
				{#if mergedBills && mergedBills.length > 0}
					<div>
						<div class="flex gap-1 items-center">
							<DocumentMultiple_02 size={24} color="#2600A3" />
							<span>
								<b>ร่างกฎหมาย {mergedBills.length} ฉบับ ที่ถูกนำมารวมกับร่างนี้</b>
								<Tooltip
									class="absolute mt-0.5 ml-1"
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
											{mergedBill.proposedLedByPolitician.firstname +
												' ' +
												mergedBill.proposedLedByPolitician.lastname +
												' ' +
												getCurrentRoles(mergedBill.proposedLedByPolitician) +
												' ' +
												getCurrentParty(mergedBill.proposedLedByPolitician)}
										{:else if mergedBill.proposerType === BillProposerType.Cabinet && mergedBill.proposedByAssembly}
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
				{/if}
			</div>
			<div class="flex flex-col gap-2 md:w-56">
				{#if bill.attachment}
					<DownloadData links={[{ label: bill.attachment.label, url: bill.attachment.url }]} />
				{/if}
				<p class="label-01 text-text-02">
					อัพเดตข้อมูล : {new Date().toLocaleDateString('th-TH', {
						year: 'numeric',
						month: 'short',
						day: 'numeric'
					})}
				</p>
				<!-- TODO: add link -->
				<!-- <a href="/" class="mr-auto helper-text-01 underline"> ที่มาและข้อจำกัดข้อมูล </a> -->
				<Share label="แชร์มติ" />
			</div>
		</div>
	</section>

	{#if bill.proposerType === BillProposerType.Politician && bill.proposedLedByPolitician && bill.coProposedByPoliticians}
		<section title="List of legal proponents" class="px-4 py-8 md:px-16 md:py-12">
			<div class="flex flex-col gap-5">
				<h1 class="fluid-heading-04 text-text-primary">รายชื่อผู้เสนอกฏหมาย</h1>
				<hr class="border-gray-30" />
				<div class="flex flex-col gap-7 md:flex-row">
					<div class="flex flex-col gap-3 md:w-1/3">
						<b class="handing-02 text-text-primary">ผู้เสนอ</b>
						<PoliticianProfile
							id={bill.proposedLedByPolitician.id}
							firstname={bill.proposedLedByPolitician.firstname}
							lastname={bill.proposedLedByPolitician.lastname}
							avatar={bill.proposedLedByPolitician.avatar}
							party={bill.proposedLedByPolitician.partyRoles.find((e) => !e.endedAt)?.party}
							role={bill.proposedLedByPolitician.assemblyRoles.find((e) => !e.endedAt)?.role + ''}
						/>
					</div>
					<div class="flex flex-col gap-3 md:w-full">
						<p class="body-02 text-text-02">
							<b class="handing-02 text-text-primary">ผู้ร่วมเสนอ</b>
							{bill.coProposedByPoliticians.length} คน
						</p>
						<div class="flex flex-col flex-wrap md:flex-row gap-3 px-3">
							{#if partiescoProposed}
								{#each Object.entries(partiescoProposed) as [party, politicians] (party)}
									<CoPartyProposer {party} {politicians} />
								{/each}
							{/if}
						</div>
						<div class="flex flex-col gap-2 px-5">
							<p class="label-01 text-text-02 mr-2">เรียงตามตัวอักษร</p>
							{#if bill.coProposedByPoliticians.length > 0}
								<div class="relative flex flex-col">
									<table class="w-full">
										{#each bill.coProposedByPoliticians.slice(0, MAX_DISPLAY_COPROPOSER) as politician, i}
											<CoProposer
												index={i + 1}
												logo={politician.partyRoles.find((e) => !e.endedAt)?.party.logo}
												firstname={politician.firstname}
												lastname={politician.lastname}
											/>
										{/each}
									</table>

									{#if bill.coProposedByPoliticians.length > MAX_DISPLAY_COPROPOSER}
										<div
											class="absolute bottom-0 w-full h-12"
											style="background: linear-gradient(0deg, #FFF 0%, rgba(255, 255, 255, 0.00) 100%);"
										>
											<button
												on:click={() => {
													$showModalListCoProposer = true;
												}}
												class="absolute bottom-0 body-01 text-link-01 underline">ดูทั้งหมด</button
											>
										</div>{/if}
								</div>
							{/if}
							<ModalListCoProposers coProposedByPoliticians={bill.coProposedByPoliticians} />
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
					<BillStatusTag isLarge status={bill.status} />
				</div>
				<div>
					<button
						class="helper-text-01 text-link-01 underline"
						on:click={() => {
							$showModalLawProcess = true;
						}}
					>
						มีขั้นตอนอะไรบ้างกว่าจะผ่านกฏหมายสำเร็จ?
					</button>
					<ModalLawProcess />
				</div>
			</div>
			<div title="timeline">
				<ol
					class="relative ml-2 border border-t-[transparent] border-e-[transparent] border-b-[transparent]"
				>
					{#each events.slice(0, events.length - 1) as event}
						<Progress
							{event}
							billStatus={bill.status}
							{tooltipText}
							{relatedVotingResults}
							{mergedIntoBill}
							{mergedIntoBillLatestEvent}
						/>
					{/each}
				</ol>
				<div>
					<ol class="relative ml-2">
						<Progress
							event={events[events.length - 1]}
							billStatus={bill.status}
							{tooltipText}
							{relatedVotingResults}
							{mergedIntoBill}
							{mergedIntoBillLatestEvent}
						/>
					</ol>
				</div>
			</div>
		</div>
	</section>
</div>
