<script lang="ts">
	import BillCategoryTag from '$components/BillCategoryTag/BillCategoryTag.svelte';
	import DownloadData from '$components/DownloadData/DownloadData.svelte';
	import Share from '$components/Share/Share.svelte';
	import VoteChartTooltip from '$components/VoteChartTooltip/VoteChartTooltip.svelte';
	import VotingResultTag from '$components/VotingResultTag/VotingResultTag.svelte';
	import { getWinningOption } from '$lib/datasheets/voting.js';
	import { DefaultVoteOption, DefaultVotingResult, type CustomVoteOption } from '$models/voting.js';
	import {
		Breadcrumb,
		BreadcrumbItem,
		Button,
		Modal,
		Search,
		Tag,
		Toggle
	} from 'carbon-components-svelte';
	import { Add, ArrowRight } from 'carbon-icons-svelte';
	import { onMount } from 'svelte';

	export let data;

	$: ({ voting, results, resultsByAffiliation, resultsByPerson } = data);

	$: winningOption = getWinningOption(voting.result);

	enum Menu {
		Summary = 'summary',
		ByParty = 'byParty',
		ByPerson = 'byPerson'
	}

	let open = false;
	let selectedTab: string[] = [];
	let selectedMenu = Menu.Summary;
	let isViewPercent = false;
	let searchQuery = '';

	const toggleSelectedTab = (name: string) => {
		if (selectedTab.includes(name)) {
			selectedTab = selectedTab.filter((tab) => tab !== name);
		} else {
			selectedTab = [...selectedTab, name];
		}
	};

	interface AnchorElement extends HTMLElement {
		offsetTop: number;
		offsetHeight: number;
	}

	function formatDate(date: Date) {
		return Intl.DateTimeFormat('th', {
			dateStyle: 'medium',
			calendar: 'buddhist'
		}).format(date);
	}

	function getVoteColor(vote: DefaultVoteOption | CustomVoteOption | string) {
		switch (vote) {
			case DefaultVoteOption.Agreed:
				return 'bg-teal-50';
			case DefaultVoteOption.Disagreed:
				return 'bg-red-50 text-white';
			case DefaultVoteOption.Novote:
				return 'bg-gray-80 text-white';
			case DefaultVoteOption.Abstain:
				return 'bg-gray-50';
			case DefaultVoteOption.Absent:
				return 'bg-gray-20';
			default:
				if (typeof vote === 'string') {
					return 'bg-purple-70';
				} else {
					return `bg-purple-70 opacity-${vote.colorIntensity * 100} text-white`;
				}
		}
	}

	function getBillStatusColor(status: DefaultVotingResult | string) {
		switch (status) {
			case DefaultVotingResult.Passed:
				return 'bg-teal-10';
			case DefaultVotingResult.Failed:
				return 'bg-red-10';
			default:
				return 'bg-purple-10';
		}
	}

	function scrollTo(id: string) {
		selectedMenu = id as Menu;
		const el = document.getElementById(id);
		if (el) el.scrollIntoView({ behavior: 'smooth' });
	}

	function onScroll() {
		const scrollY = window.scrollY;
		const anchorEls = document.querySelectorAll<AnchorElement>(
			`#${Menu.Summary}, #${Menu.ByParty}, #${Menu.ByPerson}`
		);

		for (const el of anchorEls) {
			const top = el.offsetTop;
			const bottom = top + el.offsetHeight;

			if (scrollY >= top && scrollY <= bottom) {
				selectedMenu = el.id.replace('#', '') as Menu;
				break;
			}
		}
	}

	onMount(() => {
		window.addEventListener('scroll', onScroll, { passive: true });

		return () => window.removeEventListener('scroll', onScroll);
	});

	const resultColorLookup: Record<string, string | undefined> = {
		[DefaultVotingResult.Passed]: 'text-teal-50',
		[DefaultVoteOption.Agreed]: 'text-teal-50',
		[DefaultVotingResult.Failed]: 'text-red-50',
		[DefaultVoteOption.Disagreed]: 'text-red-50'
	};

	$: voterSearchResult = searchQuery.trim()
		? resultsByPerson.filter((v) =>
				(v.firstname + v.lastname).trim().toLowerCase().includes(searchQuery.trim().toLowerCase())
		  )
		: resultsByPerson;
</script>

<div class="flex flex-col min-h-screen">
	<Breadcrumb
		noTrailingSlash
		class="w-full px-4 py-2 body-compact-01 [&>.bx--breadcrumb]:flex text-ellipsis overflow-hidden truncate"
	>
		<BreadcrumbItem href="/">หน้าแรก</BreadcrumbItem>
		<BreadcrumbItem>การลงมติ</BreadcrumbItem>
		<BreadcrumbItem>{voting.title}</BreadcrumbItem>
	</Breadcrumb>
	<div
		class="flex flex-col gap-y-4 md:gap-y-8 w-full {getBillStatusColor(
			voting.result
		)} px-4 md:px-12 py-8 md:py-16"
	>
		<div class="flex flex-col">
			<h1 class="fluid-heading-05">{voting.title}</h1>
			<div class="flex items-center text-gray-60 gap-x-1">
				<p class="flex-none heading-01">ชื่อทางการ</p>
				<p class="flex-initial body-01 truncate">{voting.officialTitle}</p>
			</div>
			<div class="flex items-center text-01 gap-x-1">
				<VotingResultTag result={voting.result} isLarge />
				<p class="heading-compact-02">
					{winningOption}
					{resultsByPerson.filter((v) => v.voteOption === winningOption).length}/<span
						class="text-gray-60">{resultsByPerson.length}</span
					>
				</p>
			</div>
		</div>
		<div class="flex flex-col gap-y-4 md:gap-y-0 md:flex-row md:gap-x-16">
			<div class="flex flex-col flex-1">
				<div class="flex justify-between">
					<div>
						<p class="heading-01">วันที่</p>
						<p class="body-01">{formatDate(voting.date)}</p>
					</div>
					<div>
						<p class="heading-01">ประเภทการประชุม</p>
						<p class="body-01">{voting.meetingType}</p>
					</div>
					<div>
						<p class="heading-01">องค์ประชุม</p>
						<p class="body-01">
							{#each voting.participatedAssemblies as { id, name, term }}
								<a href="/assemblies/{id}">{name} {term}</a>
							{/each}
						</p>
					</div>
				</div>
				<div class="w-full my-4 h-[1px] bg-gray-20" />
				<p class="heading-01">สรุปเนื้อหา</p>
				<p class="body-01">{voting.description}</p>
				{#if voting.categories.length > 0}
					<div class="flex items-center gap-x-1 mt-4">
						<p class="heading-01">หมวด</p>
						{#each voting.categories as category}
							<BillCategoryTag isLarge label={category} />
						{/each}
					</div>
				{/if}
				<!-- {#if relatedBill}
					<p class="heading-01 mt-4 mb-1">ดูเส้นทางของร่างกฏหมายนี้</p>
					<BillCard
						class="w-full md:w-auto"
						title={relatedBill.title}
						nickname={relatedBill.nickname}
						proposedOn={relatedBill.proposedOn}
						status={relatedBill.status}
						currentState={relatedBill.status}
						daySinceProposed={getDiffDays(relatedBill.proposedOn)}
						billUrl={relatedBill.title}
						proposedBy={relatedBill.proposedLedByPolitician ||
							relatedBill.proposedByAssembly ||
							relatedBill.proposedByPeople}
					/>
				{/if} -->
			</div>
			<div class="flex flex-col gap-2">
				<DownloadData links={voting.files} />
				<p class="label-01 text-gray-60">
					อัปเดตข้อมูล: {new Date().toLocaleDateString('th-TH', {
						year: 'numeric',
						month: 'short',
						day: 'numeric'
					})}
				</p>
				<!-- TODO: add link -->
				<!-- <a href="/" class="mr-auto helper-text-01"> ที่มาและข้อจำกัดข้อมูล </a> -->
				<Share label="แชร์มติ" />
			</div>
		</div>
	</div>
	<div class="flex flex-col w-full py-6 px-4 md:px-12 md:py-16">
		<h1 class="fluid-heading-05 text-center">ผลการลงมติ</h1>
		<div
			class="w-full flex items-center gap-x-[1px] mt-4 sticky top-0 bg-white z-10 voting-jumpnav"
		>
			<button
				class="flex items-center justify-center w-1/3 px-4 py-[11px] border-b-[2px] cursor-pointer body-compact-01 {selectedMenu ===
				Menu.Summary
					? 'text-gray-100 font-bold border-blue-60'
					: 'text-gray-60 border-gray-30'}"
				on:click={() => scrollTo(Menu.Summary)}
			>
				สรุป
			</button>
			<button
				class="flex items-center justify-center w-1/3 px-4 py-[11px] border-b-[2px] cursor-pointer body-compact-01 {selectedMenu ===
				Menu.ByParty
					? 'text-gray-100 font-bold border-blue-60'
					: 'text-gray-60 border-gray-30'}"
				on:click={() => scrollTo(Menu.ByParty)}
			>
				รายสังกัด
			</button>
			<button
				class="flex items-center justify-center w-1/3 px-4 py-[11px] border-b-[2px] cursor-pointer body-compact-01 {selectedMenu ===
				Menu.ByPerson
					? 'text-gray-100 font-bold border-blue-60'
					: 'text-gray-60 border-gray-30'}"
				on:click={() => scrollTo(Menu.ByPerson)}
			>
				รายคน
			</button>
		</div>
		<h2 id={Menu.Summary} class="fluid-heading-04 mt-6 md:mt-10">สรุปผลการลงมติ</h2>
		<div class="flex flex-col mt-4">
			<div class="flex items-center gap-x-1 {resultColorLookup[voting.result] ?? 'text-purple-70'}">
				<span class="fluid-heading-05 ml-0 md:ml-1">
					{Math.round(
						(results.reduce((max, result) => (result.total > max.total ? result : max), results[0])
							.total /
							resultsByPerson.length) *
							100
					)}% {getWinningOption(voting.result)}
				</span>
			</div>
			<div
				class="mt-3 md:mt-0 flex flex-col md:flex-row items-start md:items-center gap-x-4 flex-wrap"
			>
				<div class="flex items-center gap-x-1">
					<p class="heading-02">สมาชิกสภา</p>
					<p class="body-02">{resultsByPerson.length}</p>
				</div>
				{#each results as result}
					<div class="flex items-center gap-x-1">
						<div class="w-4 h-4 rounded-sm {getVoteColor(result.voteOption)}" />
						<p class="heading-02">
							{typeof result.voteOption === 'object' ? result.voteOption.label : result.voteOption}
						</p>
						<p class="body-02">{result.total}</p>
					</div>
				{/each}
			</div>
		</div>
		<div class="flex w-full h-[50px] my-2">
			{#each results as result}
				{@const resultLen = resultsByPerson.length}
				{#if result.total}
					<VoteChartTooltip
						value={result.total}
						total={resultLen}
						color={getVoteColor(result.voteOption)}
					/>
				{/if}
			{/each}
		</div>
		<div class="flex flex-col md:flex-row items-start md:items-baseline gap-1 md:gap-2">
			<VotingResultTag result={voting.result} isLarge />
			<p class="heading-01 mt-2 md:mt-0 text-gray-60">เงื่อนไข</p>
			<!-- TODO: this has to be reactive somehow -->
			<ol
				class="body-01 flex flex-col md:flex-row gap-1 md:gap-2 text-gray-60 marker:font-bold list-decimal list-inside"
			>
				<li>ได้เสียงเกินกึ่งหนึ่งของสภา</li>
				<li>ได้เสียงฝ่ายค้านอย่างน้อย 20%</li>
				<li>ได้เสียง สว. อย่างน้อย 1 ใน 3</li>
			</ol>
		</div>
		<Modal passiveModal bind:open modalHeading="งดออกเสียง vs. ไม่ลงคะแนน" on:open on:close>
			<p class="body-01">
				งดออกเสียง เกิดจากการเสียบบัตรยืนยันตัวตน และลงคะแนนว่า “งดออกเสียง” <br />
				ไม่ลงคะแนน เกิดจากการเสียบบัตรยืนยันตัวตนแล้ว แต่ไม่กดลงคะแนน
			</p>
		</Modal>
		<button
			class="cursor-pointer helper-text-01 mt-2 text-blue-60 underline text-left w-[260px]"
			on:click={() => {
				open = true;
			}}
		>
			งดออกเสียง และ ไม่ลงคะแนน ต่างกันอย่างไร?
		</button>
		<div class="flex flex-col w-full mt-20">
			<div class="flex flex-col md:flex-row items-start md:items-center gap-x-3">
				<h1 id={Menu.ByParty} class="fluid-heading-04">ผลการลงมติรายสังกัด</h1>
				<div class="flex items-center">
					<Toggle
						class="outline-none"
						bind:toggled={isViewPercent}
						hideLabel
						labelA="ดูร้อยละ"
						labelB="ดูร้อยละ"
					/>
				</div>
			</div>
			<p class="label-01 mt-1">*หมายเหตุ: ข้อมูลสังกัด ยึดตามวันที่ลงมติ</p>
		</div>
		<div class="flex flex-col md:flex-row w-full mt-4 mb-10 gap-x-8">
			{#each resultsByAffiliation as { affiliationName, resultSummary, byParties }}
				{@const totalAffVote = resultSummary.reduce((acc, vote) => acc + vote.total, 0)}
				{@const highestVote = resultSummary.reduce(
					(max, current) => (current.total > max.total ? current : max),
					resultSummary[0]
				)}
				<div
					class="flex flex-col w-full border-t border-gray-30 pb-4 md:pb-0"
					style="--width:{100 / resultsByAffiliation.length}%"
				>
					<div class="mt-2 flex items-center gap-x-1">
						<p class="heading-02">{affiliationName}</p>
						<p class="body-02 text-gray-60">{totalAffVote} คน</p>
						<div class="flex md:hidden flex-1" />
						<button
							type="button"
							class="justify-self-start self-start flex md:hidden"
							on:click={() => toggleSelectedTab(affiliationName)}
						>
							<Add />
						</button>
					</div>
					<div
						class="mt-1 flex items-center gap-x-1 {resultColorLookup[
							highestVote.voteOption.toString()
						] ?? 'text-purple-70'}"
					>
						<p class="heading-03">
							{isViewPercent
								? Math.round((highestVote.total / totalAffVote) * 100) + '%'
								: highestVote.total + ' คน'}
						</p>
						<p class="heading-03">{highestVote.voteOption}</p>
					</div>
					<div class="mt-1 flex items-center gap-x-3">
						{#each resultSummary as vote}
							<div class="flex items-center gap-x-1">
								<div class="w-1 h-3 {getVoteColor(vote.voteOption)}" />
								<p class="label-01">{vote.total}</p>
							</div>
						{/each}
					</div>
					<div class="flex w-full h-[30px] mt-1">
						{#each resultSummary as vote}
							{#if vote.total}
								<VoteChartTooltip
									value={vote.total}
									total={totalAffVote}
									color={getVoteColor(vote.voteOption)}
								/>
							{/if}
						{/each}
					</div>
					{#if byParties}
						<div
							class="{selectedTab.includes(affiliationName)
								? 'flex'
								: 'hidden'} md:flex flex-col w-full mt-4 gap-y-4"
						>
							{#each byParties as partyDetails}
								{@const totalPartyVote = partyDetails.resultSummary.reduce(
									(acc, vote) => acc + vote.total,
									0
								)}
								<div class="flex items-start gap-x-1">
									<img
										class="rounded-full border border-gray-30 w-8 h-8"
										src={partyDetails.party.logo}
										alt={partyDetails.party.name}
										loading="lazy"
										decoding="async"
									/>
									<div class="flex justify-start items-start flex-col w-full">
										<div class="flex items-center gap-x-1">
											<p class="heading-02">{partyDetails.party.name}</p>
											<p class="body-02 text-gray-60">
												{totalPartyVote} คน
											</p>
										</div>
										<div class="mt-1 flex items-center gap-x-3">
											{#each partyDetails.resultSummary as partyVote}
												<div class="flex items-center gap-x-1">
													<div class="w-1 h-3 {getVoteColor(partyVote.voteOption)}" />
													<p class="label-01">
														{isViewPercent
															? ((partyVote.total / totalPartyVote) * 100).toLocaleString('th-TH', {
																	maximumFractionDigits: 2
															  }) + '%'
															: partyVote.total}
													</p>
												</div>
											{/each}
										</div>
										<div class="flex w-full h-[20px] mt-1">
											{#each partyDetails.resultSummary as partyVote}
												{#if partyVote.total}
													<VoteChartTooltip
														value={partyVote.total}
														total={totalAffVote}
														color={getVoteColor(partyVote.voteOption)}
													/>
												{/if}
											{/each}
										</div>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			{/each}
		</div>
		<div class="flex flex-col w-full mt-0 md:mt-10">
			<p class="hidden md:block text-right label-01 text-gray-60">
				หมายเหตุ: ข้อมูลตำแหน่งและสังกัดพรรค ยึดตามวันที่ลงมติ
			</p>
			<div id={Menu.ByPerson} class="px-4 pt-4 pb-6 fluid-heading-04 bg-gray-10">
				ผลการลงมติรายคน
			</div>
			<div class="flex">
				<div class="flex items-center flex-1 bg-gray-10">
					<Search size="xl" placeholder="ค้นด้วยชื่อ-นามสกุล" bind:value={searchQuery} />
				</div>
				<Button class="flex items-center w-[164px] px-[14px] py-[13px]"
					><a class="text-white body-compact-01" href="/votings/{voting.id}/votes"
						>สำรวจแบบละเอียด</a
					><ArrowRight /></Button
				>
			</div>
			<div class="flex w-full border-t border-gray-30">
				<div class="w-[112px] md:w-1/4 heading-compact-01 py-[11px] md:py-[15px] px-4">
					ชื่อ-นามสกุล
				</div>
				<div class="w-[112px] md:w-1/4 heading-compact-01 py-[11px] md:py-[15px] px-4">ตำแหน่ง</div>
				<div class="w-[112px] md:w-1/4 heading-compact-01 py-[11px] md:py-[15px] px-4">
					สังกัดพรรค
				</div>
				<div
					class="hidden md:block w-[112px] md:w-1/4 heading-compact-01 py-[11px] md:py-[15px] px-4"
				>
					การลงมติ
				</div>
			</div>
			{#if voterSearchResult.length}
				{#each voterSearchResult as voter (voter.id)}
					<div class="flex w-full border-t border-gray-30">
						<a
							href="/politicians/{voter.id}"
							class="w-[112px] md:w-1/4 body-01 py-[11px] md:py-[15px] px-4"
						>
							{voter.firstname}
							{voter.lastname}
						</a>
						<div
							class="w-[112px] md:w-1/4 text-gray-60 body-compact-01 py-[11px] md:py-[15px] px-4"
						>
							{voter.role}
						</div>
						<div
							class="w-[112px] md:w-1/4 text-gray-60 body-compact-01 py-[11px] md:py-[15px] px-4"
						>
							{voter.party ? voter.party.name : ''}
						</div>
						<div class="hidden md:block w-[112px] md:w-1/4 py-[11px] md:py-[15px] px-4">
							<Tag class={getVoteColor(voter.voteOption)}
								>{typeof voter.voteOption === 'object'
									? voter.voteOption.label
									: voter.voteOption}</Tag
							>
						</div>
					</div>
				{/each}
			{:else}
				<div
					class="flex w-full border-t border-gray-30 body-compact-01 text-gray-60 py-[11px] md:py-[15px] px-4"
				>
					ไม่พบบุคคลที่ค้นหา
				</div>
			{/if}
		</div>
	</div>
</div>

<style lang="postcss">
	.voting-jumpnav {
		@apply transition-[top];
		will-change: top;
	}

	:global(html.navbar-shown) .voting-jumpnav {
		top: 48px;
	}
</style>
