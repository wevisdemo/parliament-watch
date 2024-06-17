<script lang="ts">
	import { onMount } from 'svelte';

	import AffiliationsResult from '$components/AffiliationResult/AffiliationsResult.svelte';
	import LinkTable from '$components/LinkTable/LinkTable.svelte';
	import Share from '$components/Share/Share.svelte';
	import DataPeriodRemark from '$components/DataPeriodRemark.svelte';
	import VoteChartTooltip from '$components/VoteChartTooltip/VoteChartTooltip.svelte';
	import VotingResultTag from '$components/VotingResultTag/VotingResultTag.svelte';
	import {
		Breadcrumb,
		BreadcrumbItem,
		Button,
		Modal,
		Search,
		Tag,
		Toggle
	} from 'carbon-components-svelte';
	import { ArrowRight } from 'carbon-icons-svelte';

	import { getWinningOption } from '$lib/datasheets/voting.js';
	import { DefaultVoteOption, DefaultVotingResult, type CustomVoteOption } from '$models/voting.js';

	export let data;

	$: ({ voting, results, resultsByAffiliation, resultsByPerson } = data);

	$: winningOption = getWinningOption(voting.result);

	enum Menu {
		Summary = 'summary',
		ByParty = 'byParty',
		ByPerson = 'byPerson'
	}

	let open = false;
	let selectedMenu = Menu.Summary;
	let isViewPercent = false;
	let searchQuery = '';

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
				return 'bg-teal-40';
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

<div class="flex flex-col">
	<Breadcrumb
		noTrailingSlash
		class="body-compact-01 w-full overflow-hidden truncate text-ellipsis px-4 py-2 [&>.bx--breadcrumb]:flex"
	>
		<BreadcrumbItem href="/">หน้าแรก</BreadcrumbItem>
		<BreadcrumbItem>การลงมติ</BreadcrumbItem>
		<BreadcrumbItem>{voting.nickname}</BreadcrumbItem>
	</Breadcrumb>
	<header
		class="flex w-full flex-col gap-y-4 md:gap-y-8 {getBillStatusColor(
			voting.result
		)} px-4 py-8 md:px-12 md:py-16"
	>
		<div class="mx-auto flex w-full max-w-[1280px] flex-col">
			<h1 class="fluid-heading-05">{voting.nickname}</h1>
			{#if voting.title}
				<div class="flex items-center gap-x-1 text-gray-60">
					<p class="heading-01 flex-none">ชื่อทางการ</p>
					<p class="body-01 flex-initial truncate">{voting.title}</p>
				</div>
			{/if}
			<div class="text-01 mt-2 flex items-center gap-x-1">
				<VotingResultTag result={voting.result} isLarge />
				{#if resultsByPerson.length > 0}
					<span class="body-02 text-gray-60"
						><span class="heading-compact-02 text-text-01"
							>{winningOption}
							{resultsByPerson.filter((v) => v.voteOption === winningOption).length}</span
						>/{resultsByPerson.length}</span
					>
				{/if}
			</div>
		</div>
		<div
			class="mx-auto flex w-full max-w-[1280px] flex-col gap-y-4 md:flex-row md:gap-x-16 md:gap-y-0"
		>
			<div class="flex flex-1 flex-col">
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
						<ul class="body-01">
							{#each voting.participatedAssemblies as { id, name, term }}
								<li><a href="/assemblies/{id}">{name} {term}</a></li>
							{/each}
						</ul>
					</div>
				</div>
				<div class="my-4 h-[1px] w-full bg-gray-20" />
				{#if voting.description}
					<p class="heading-01">สรุปเนื้อหา</p>
					<p class="body-01">{voting.description}</p>
				{/if}
				<!-- {#if relatedBill}
					<p class="heading-01 mt-4 mb-1">ดูเส้นทางของร่างกฎหมายนี้</p>
					<BillCard
						class="w-full md:w-auto"
						bill={relatedBill}
						currentState={relatedBill.status}
						daySinceProposed={getDiffDays(relatedBill.proposedOn)}
					/>
				{/if} -->
			</div>
			<div class="flex flex-col gap-2">
				<LinkTable links={voting.files} />
				<DataPeriodRemark />
				<Share label="แชร์มติ" />
			</div>
		</div>
	</header>
	<div class="px-4 py-6 md:px-12 md:py-16">
		<div class="mx-auto flex w-full max-w-[1280px] flex-col">
			<h1 class="fluid-heading-05 text-center">ผลการลงมติ</h1>
			{#if resultsByPerson.length === 0}
				<div class="body-compact-01 my-3 text-center text-gray-60 md:my-8">ไม่พบข้อมูล</div>
			{:else}
				<div
					class="voting-jumpnav sticky top-0 z-10 mt-4 flex w-full items-center gap-x-[1px] bg-white"
				>
					<button
						class="body-compact-01 flex w-1/3 cursor-pointer items-center justify-center border-b-[2px] px-4 py-[11px] {selectedMenu ===
						Menu.Summary
							? 'border-blue-60 font-bold text-gray-100'
							: 'border-gray-30 text-gray-60'}"
						on:click={() => scrollTo(Menu.Summary)}
					>
						สรุป
					</button>
					<button
						class="body-compact-01 flex w-1/3 cursor-pointer items-center justify-center border-b-[2px] px-4 py-[11px] {selectedMenu ===
						Menu.ByParty
							? 'border-blue-60 font-bold text-gray-100'
							: 'border-gray-30 text-gray-60'}"
						on:click={() => scrollTo(Menu.ByParty)}
					>
						รายสังกัด
					</button>
					<button
						class="body-compact-01 flex w-1/3 cursor-pointer items-center justify-center border-b-[2px] px-4 py-[11px] {selectedMenu ===
						Menu.ByPerson
							? 'border-blue-60 font-bold text-gray-100'
							: 'border-gray-30 text-gray-60'}"
						on:click={() => scrollTo(Menu.ByPerson)}
					>
						รายคน
					</button>
				</div>
				<h2 id={Menu.Summary} class="fluid-heading-04 mt-6 md:mt-10">สรุปผลการลงมติ</h2>
				<div class="mt-4 flex flex-col">
					<div
						class="flex items-center gap-x-1 {resultColorLookup[voting.result] ?? 'text-purple-70'}"
					>
						<span class="fluid-heading-05 ml-0 md:ml-1">
							{Math.round(
								(results.reduce(
									(max, result) => (result.total > max.total ? result : max),
									results[0]
								).total /
									resultsByPerson.length) *
									100
							)}% {getWinningOption(voting.result)}
						</span>
					</div>
					<div
						class="mt-3 flex flex-col flex-wrap items-start gap-x-4 md:mt-0 md:flex-row md:items-center"
					>
						<div class="flex items-center gap-x-1">
							<p class="heading-02">สมาชิกสภา</p>
							<p class="body-02">{resultsByPerson.length}</p>
						</div>
						{#each results as result}
							<div class="flex items-center gap-x-1">
								<div class="h-4 w-4 rounded-sm {getVoteColor(result.voteOption)}" />
								<p class="heading-02">
									{typeof result.voteOption === 'object'
										? result.voteOption.label
										: result.voteOption}
								</p>
								<p class="body-02">{result.total}</p>
							</div>
						{/each}
					</div>
				</div>
				<div class="my-2 flex h-[50px] w-full">
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
				<div class="flex flex-col items-start gap-1 md:flex-row md:items-baseline md:gap-2">
					<VotingResultTag result={voting.result} isLarge />
					{#if voting.winningCondition}
						<p class="heading-01 mt-2 text-gray-60 md:mt-0">เงื่อนไข</p>
						<p class="body-01 text-gray-60">{voting.winningCondition}</p>
					{/if}
				</div>
				<Modal passiveModal bind:open modalHeading="งดออกเสียง vs. ไม่ลงคะแนน" on:open on:close>
					<p class="body-01">
						งดออกเสียง เกิดจากการเสียบบัตรยืนยันตัวตน และลงคะแนนว่า “งดออกเสียง” <br />
						ไม่ลงคะแนน เกิดจากการเสียบบัตรยืนยันตัวตนแล้ว แต่ไม่กดลงคะแนน
					</p>
				</Modal>
				<button
					class="helper-text-01 mt-2 cursor-pointer self-start text-left text-blue-60 underline"
					on:click={() => {
						open = true;
					}}
				>
					งดออกเสียง และ ไม่ลงคะแนน ต่างกันอย่างไร?
				</button>
				<div class="mt-20 flex w-full flex-col">
					<div class="flex flex-col items-start gap-x-3 md:flex-row md:items-center">
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
				<div class="mb-10 mt-4 flex w-full flex-col gap-x-8 md:flex-row">
					<AffiliationsResult
						{resultsByAffiliation}
						{isViewPercent}
						{resultColorLookup}
						{getVoteColor}
					/>
				</div>
				<div class="mt-0 flex w-full flex-col md:mt-10">
					<p class="label-01 hidden text-right text-gray-60 md:block">
						หมายเหตุ: ข้อมูลตำแหน่งและสังกัดพรรค ยึดตามวันที่ลงมติ
					</p>
					<div id={Menu.ByPerson} class="fluid-heading-04 bg-gray-10 px-4 pb-6 pt-4">
						ผลการลงมติรายคน
					</div>
					<div class="flex">
						<div class="flex flex-1 items-center bg-gray-10">
							<Search size="xl" placeholder="ค้นด้วยชื่อ-นามสกุล" bind:value={searchQuery} />
						</div>
						<Button class="flex w-[164px] items-center px-[14px] py-[13px]"
							><a class="body-compact-01 text-white" href="/votings/{voting.id}/votes"
								>สำรวจแบบละเอียด</a
							><ArrowRight /></Button
						>
					</div>
					<div class="flex w-full border-t border-gray-30">
						<div class="heading-compact-01 w-[112px] px-4 py-[11px] md:w-1/4 md:py-[15px]">
							ชื่อ-นามสกุล
						</div>
						<div class="heading-compact-01 w-[112px] px-4 py-[11px] md:w-1/4 md:py-[15px]">
							ตำแหน่ง
						</div>
						<div class="heading-compact-01 w-[112px] px-4 py-[11px] md:w-1/4 md:py-[15px]">
							สังกัดพรรค
						</div>
						<div
							class="heading-compact-01 hidden w-[112px] px-4 py-[11px] md:block md:w-1/4 md:py-[15px]"
						>
							การลงมติ
						</div>
					</div>
					{#if voterSearchResult.length}
						{#each voterSearchResult as voter}
							<div class="flex w-full border-t border-gray-30">
								<a
									href="/politicians/{voter.id}"
									class="body-01 w-[112px] px-4 py-[11px] md:w-1/4 md:py-[15px]"
								>
									{voter.firstname}
									{voter.lastname}
								</a>
								<div
									class="body-compact-01 w-[112px] px-4 py-[11px] text-gray-60 md:w-1/4 md:py-[15px]"
								>
									{voter.role}
								</div>
								<div
									class="body-compact-01 w-[112px] px-4 py-[11px] text-gray-60 md:w-1/4 md:py-[15px]"
								>
									{voter.party ? voter.party.name : ''}
								</div>
								<div class="hidden w-[112px] px-4 py-[11px] md:block md:w-1/4 md:py-[15px]">
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
							class="body-compact-01 flex w-full border-t border-gray-30 px-4 py-[11px] text-gray-60 md:py-[15px]"
						>
							ไม่พบบุคคลที่ค้นหา
						</div>
					{/if}
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
