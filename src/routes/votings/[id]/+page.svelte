<script lang="ts">
	import AffiliationResult from '$components/AffiliationResult/AffiliationResult.svelte';
	import BillCard from '$components/BillCard/BillCard.svelte';
	import Breadcrumb from '$components/Breadcrumb/Breadcrumb.svelte';
	import DataPeriodRemark from '$components/DataPeriodRemark/DataPeriodRemark.svelte';
	import LinkTable from '$components/LinkTable/LinkTable.svelte';
	import Share from '$components/Share/Share.svelte';
	import VoteChartTooltip from '$components/VoteChartTooltip/VoteChartTooltip.svelte';
	import VotingOptionTag from '$components/VotingOptionTag/VotingOptionTag.svelte';
	import VotingResultTag from '$components/VotingResultTag/VotingResultTag.svelte';
	import { trimBreadcrumbTitle } from '$lib/breadcrumb';
	import { formatThaiDate } from '$lib/date.js';
	import { createDebouncedSync } from '$lib/query-state/sync';
	import { DefaultVoteOption, DefaultVotingResult, type CustomVoteOption } from '$models/voting';
	import { Button, Modal, Search, Toggle } from 'carbon-components-svelte';
	import ArrowRight from 'carbon-icons-svelte/lib/ArrowRight.svelte';
	import Link from 'carbon-icons-svelte/lib/Link.svelte';

	let { data } = $props();

	let { voteEvent, relatedBill, results, resultsByAffiliation, votes } = $derived(data);

	const Menu = {
		Summary: 'summary',
		ByParty: 'byParty',
		ByPerson: 'byPerson'
	} as const;
	type MenuValue = (typeof Menu)[keyof typeof Menu];

	const menuTabs = [
		{ id: Menu.Summary, label: 'สรุป' },
		{ id: Menu.ByParty, label: 'รายสังกัด' },
		{ id: Menu.ByPerson, label: 'รายคน' }
	];

	const SEARCH_DEBOUNCE_MS = 250;
	const VOTER_ROWS_STEP = 50;

	let open = $state(false);
	let selectedMenu: MenuValue = $state(Menu.Summary);
	let isViewPercent = $state(false);
	let searchQuery = $state('');
	let visibleVoterCount = $state(VOTER_ROWS_STEP);

	function getVoteColor(option: DefaultVoteOption | CustomVoteOption | string): {
		className: string;
		style?: string;
	} {
		if (typeof option === 'string') {
			switch (option) {
				case DefaultVoteOption.Agreed:
					return { className: 'bg-teal-40' };
				case DefaultVoteOption.Disagreed:
					return { className: 'bg-red-50 text-white' };
				case DefaultVoteOption.Abstain:
					return { className: 'bg-gray-80 text-white' };
				case DefaultVoteOption.Novote:
					return { className: 'bg-gray-50' };
				case DefaultVoteOption.Absent:
					return { className: 'bg-gray-20' };
				default:
					return { className: 'bg-purple-70' };
			}
		}

		return {
			className: 'bg-purple-70 text-white',
			style: `--tw-bg-opacity: ${option.colorIntensity}`
		};
	}

	function getBillStatusColor(status: string | null) {
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
		selectedMenu = id as MenuValue;
		const el = document.getElementById(id);
		if (el) el.scrollIntoView({ behavior: 'smooth' });
	}

	$effect(() => {
		if (!voteEvent.id || votes.length === 0) return;

		const anchorEls = menuTabs
			.map(({ id }) => document.getElementById(id))
			.filter((el) => el !== null);

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) selectedMenu = entry.target.id as MenuValue;
				}
			},
			{ rootMargin: '-48px 0px -80% 0px' }
		);

		anchorEls.forEach((el) => observer.observe(el));

		return () => observer.disconnect();
	});

	$effect(() => {
		if (voteEvent.id) visibleVoterCount = VOTER_ROWS_STEP;
	});

	const resultColorLookup: Record<string, string | undefined> = {
		[DefaultVotingResult.Passed]: 'text-teal-50',
		[DefaultVoteOption.Agreed]: 'text-teal-50',
		[DefaultVotingResult.Failed]: 'text-red-50',
		[DefaultVoteOption.Disagreed]: 'text-red-50',
		[DefaultVoteOption.Abstain]: 'text-gray-80',
		[DefaultVoteOption.Novote]: 'text-gray-50',
		[DefaultVoteOption.Absent]: 'text-gray-20'
	};

	let winningOption = $derived(
		(() => {
			switch (voteEvent.result) {
				case DefaultVotingResult.Passed:
					return DefaultVoteOption.Agreed;
				case DefaultVotingResult.Failed:
					return DefaultVoteOption.Disagreed;
				default:
					return voteEvent.result;
			}
		})()
	);

	let meetingType = $derived(
		(() => {
			const hasSenate = voteEvent.organizations.some((o) => o.classification === 'HOUSE_OF_SENATE');
			const hasRepresentative = voteEvent.organizations.some(
				(o) => o.classification === 'HOUSE_OF_REPRESENTATIVE'
			);

			return hasSenate && hasRepresentative
				? 'ประชุมร่วมกันของรัฐสภา'
				: hasRepresentative
					? 'ประชุมสภาผู้แทนราษฎร'
					: hasSenate
						? 'ประชุมวุฒิสภา'
						: null;
		})()
	);

	let maxComparableRowVote = $derived(
		resultsByAffiliation.reduce((max, affiliation) => {
			const partyMax = affiliation.parties.reduce(
				(maxPartyCount, party) => (party.count > maxPartyCount ? party.count : maxPartyCount),
				0
			);

			return Math.max(max, affiliation.count, partyMax);
		}, 0)
	);

	let debouncedSearchQuery = $state('');
	let pendingSearchQuery = '';
	const debouncedSearchSync = createDebouncedSync(() => {
		if (pendingSearchQuery === debouncedSearchQuery) return;

		debouncedSearchQuery = pendingSearchQuery;
		visibleVoterCount = VOTER_ROWS_STEP;
	}, SEARCH_DEBOUNCE_MS);

	$effect(() => {
		pendingSearchQuery = searchQuery.trim().toLowerCase();
		debouncedSearchSync.schedule();
		return debouncedSearchSync.cancel;
	});

	let optionByLabel = $derived(
		new Map(
			results.map(({ option }) => [typeof option === 'string' ? option : option.label, option])
		)
	);

	let voterSearchResult = $derived(
		debouncedSearchQuery
			? votes.filter((v) => v.politician.name.trim().toLowerCase().includes(debouncedSearchQuery))
			: votes
	);

	let visibleVoters = $derived(voterSearchResult.slice(0, visibleVoterCount));
</script>

<div class="flex flex-col">
	<Breadcrumb
		items={[
			{ label: 'หน้าแรก', url: '/' },
			{ label: 'การลงมติ' },
			{ label: trimBreadcrumbTitle(voteEvent.nickname || voteEvent.title) }
		]}
	/>
	<header
		class="flex w-full flex-col gap-y-4 md:gap-y-8 {getBillStatusColor(
			voteEvent.result
		)} px-4 py-8 md:px-12 md:py-16"
	>
		<div class="mx-auto flex w-full max-w-[1280px] flex-col">
			{#if voteEvent.nickname}
				<h1 class="fluid-heading-05">{voteEvent.nickname}</h1>

				<div class="flex items-center gap-x-1 text-gray-60">
					<p class="heading-01 flex-none">ชื่อทางการ</p>
					<p class="body-01 flex-initial truncate">{voteEvent.title}</p>
				</div>
			{:else}
				<h1 class="fluid-heading-05">{voteEvent.title}</h1>
			{/if}
			<div class="text-01 mt-2 flex items-center gap-x-1">
				<VotingResultTag result={voteEvent.result} isLarge />
				{#if winningOption && votes.length > 0}
					<span class="body-02 text-gray-60"
						><span class="heading-compact-02 text-text-01"
							>{winningOption !== voteEvent.result ? winningOption : 'ได้รับคะแนนเสียง'}
							{votes.filter((v) => v.option === winningOption).length}</span
						>/{votes.length}</span
					>
				{/if}
			</div>
		</div>
		<div class="mx-auto flex w-full max-w-[1280px] flex-col md:flex-row gap-4 md:gap-8">
			<div class="flex flex-1 flex-col">
				<div class="flex flex-row flex-wrap gap-4 lg:gap-12">
					{#if voteEvent.start_date}
						<div>
							<p class="heading-01">วันที่</p>
							<p class="body-01">{formatThaiDate(voteEvent.start_date)}</p>
						</div>
					{/if}
					{#if meetingType}
						<div>
							<p class="heading-01">ประเภทการประชุม</p>
							<p class="body-01">{meetingType}</p>
						</div>
					{/if}
					<div>
						<p class="heading-01">องค์ประชุม</p>
						<ul class="body-01">
							{#each voteEvent.organizations as { id, name } (id)}
								<li><a href="/assemblies/{id}">{name}</a></li>
							{/each}
						</ul>
					</div>
				</div>
				{#if voteEvent.description || relatedBill}
					<div class="mt-4 md:mt-6 h-[1px] w-full bg-gray-20"></div>
				{/if}
				{#if voteEvent.description}
					<p class="heading-01 mt-4 md:mt-6">สรุปเนื้อหา</p>
					<p class="body-01">{voteEvent.description}</p>
				{/if}
				{#if relatedBill}
					<p class="heading-01 mt-4 md:mt-6 mb-1">ดูเส้นทางของร่างกฎหมายที่เกี่ยวข้อง</p>
					<BillCard isFullWidth orientation="landscape" {...relatedBill} />
				{/if}
			</div>
			<div class="flex flex-col gap-2">
				<LinkTable
					title="ลิงก์ที่เกี่ยวข้อง"
					icon={Link}
					links={voteEvent.links.map(({ note, url }) => ({
						label: note ?? '',
						url
					}))}
				/>
				<DataPeriodRemark />
				<Share label="แชร์หน้านี้" />
			</div>
		</div>
	</header>
	<div class="px-4 py-6 md:px-12 md:py-16">
		<div class="mx-auto flex w-full max-w-[1280px] flex-col">
			<h1 class="fluid-heading-05 text-center">ผลการลงมติ</h1>
			{#if votes.length === 0}
				<div class="body-compact-01 my-3 text-center text-gray-60 md:my-8">ไม่พบข้อมูล</div>
			{:else}
				<div
					class="voting-jumpnav sticky top-0 z-10 mt-4 flex w-full items-center gap-x-[1px] bg-white transition-[top] will-change-[top]"
				>
					{#each menuTabs as { id, label } (id)}
						<button
							class="body-compact-01 flex w-1/3 cursor-pointer items-center justify-center border-b-[2px] px-4 py-[11px] {selectedMenu ===
							id
								? 'border-blue-60 font-bold text-gray-100'
								: 'border-gray-30 text-gray-60'}"
							onclick={() => scrollTo(id)}
						>
							{label}
						</button>
					{/each}
				</div>
				<h2 id={Menu.Summary} class="fluid-heading-04 mt-6 md:mt-10">สรุปผลการลงมติ</h2>
				<div class="mt-4 flex flex-col">
					<div
						class="flex items-center gap-x-1 {(voteEvent.result &&
							resultColorLookup[voteEvent.result]) ??
							'text-purple-70'}"
					>
						<span class="fluid-heading-05 ml-0 md:ml-1">
							{#if voteEvent.result && resultColorLookup[voteEvent.result]}
								{Math.round(
									((results.find((r) => r.option === winningOption)?.total ?? 0) * 100) /
										votes.length
								)}% {winningOption}
							{/if}
						</span>
					</div>
					<div
						class="mt-3 flex flex-col flex-wrap items-start gap-x-4 md:mt-0 md:flex-row md:items-center"
					>
						<div class="flex items-center gap-x-1">
							<p class="heading-02">สมาชิกสภา</p>
							<p class="body-02">{votes.length}</p>
						</div>
						{#each results as { option, total } (typeof option === 'string' ? option : option.label)}
							{@const { className, style } = getVoteColor(option)}
							<div class="flex items-center gap-x-1">
								<div class="h-4 w-4 rounded-sm {className}" {style}></div>
								<p class="heading-02">
									{typeof option === 'string' ? option : option.label}
								</p>
								<p class="body-02">{total}</p>
							</div>
						{/each}
					</div>
				</div>
				<div class="my-2 flex h-[50px] w-full">
					{#each results as { option, total } (typeof option === 'string' ? option : option.label)}
						{@const { className, style } = getVoteColor(option)}
						{#if total}
							<VoteChartTooltip
								option={typeof option === 'string' ? option : option.label}
								value={total}
								total={votes.length}
								class={className}
								{style}
							/>
						{/if}
					{/each}
				</div>
				<div class="flex flex-col items-start gap-1 md:flex-row md:items-baseline md:gap-2">
					<VotingResultTag result={voteEvent.result} isLarge />
					{#if voteEvent.pass_condition}
						<p class="heading-01 mt-2 text-gray-60 md:mt-0">เงื่อนไข</p>
						<p class="body-01 text-gray-60">{voteEvent.pass_condition}</p>
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
					onclick={() => {
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
					{#each resultsByAffiliation as result (result.name)}
						<AffiliationResult
							{...result}
							{maxComparableRowVote}
							{isViewPercent}
							{resultColorLookup}
							getOptionColor={(label) => getVoteColor(optionByLabel.get(label) ?? label)}
						/>
					{/each}
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
							><a class="body-compact-01 text-white" href="/votings/{voteEvent.id}/votes"
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
					{#if visibleVoters.length}
						{#each visibleVoters as { id, politician, role, party, option } (politician.id ?? id)}
							{@const voteOption = optionByLabel.get(option)}
							<div class="flex w-full border-t border-gray-30">
								<div class="body-01 w-[112px] px-4 py-[11px] md:w-1/4 md:py-[15px]">
									{#if politician.id}
										<a href="/politicians/{politician.id}">
											{politician.name}
										</a>
									{:else}
										{politician.name}
									{/if}
								</div>
								<div
									class="body-compact-01 w-[112px] px-4 py-[11px] text-gray-60 md:w-1/4 md:py-[15px]"
								>
									{role}
								</div>
								<div
									class="body-compact-01 w-[112px] px-4 py-[11px] text-gray-60 md:w-1/4 md:py-[15px]"
								>
									{party?.name ?? '-'}
								</div>
								<div class="hidden w-[112px] px-4 py-[11px] md:block md:w-1/4 md:py-[15px]">
									{#if voteOption}
										<VotingOptionTag {voteOption} />
									{/if}
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
					{#if voterSearchResult.length > visibleVoters.length}
						<div class="flex w-full flex-col items-center gap-1 border-t border-gray-30 py-4">
							<p class="label-01 text-gray-60">
								แสดง {visibleVoters.length} จาก {voterSearchResult.length} คน
							</p>
							<Button
								kind="tertiary"
								size="small"
								onclick={() => (visibleVoterCount += VOTER_ROWS_STEP)}
							>
								ดูเพิ่มเติม
							</Button>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>

<style lang="postcss">
	:global(html.navbar-shown) .voting-jumpnav {
		top: 48px;
	}
</style>
