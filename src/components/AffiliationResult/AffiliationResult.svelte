<script lang="ts">
	import VoteChartTooltip from '$components/VoteChartTooltip/VoteChartTooltip.svelte';
	import {
		findHighestVote,
		sumVotesByOption,
		type AffiliationParty
	} from '$lib/politigraph/vote/affiliation';
	import ChevronDown from 'carbon-icons-svelte/lib/ChevronDown.svelte';
	import { onMount } from 'svelte';

	const DESKTOP_MEDIA_QUERY = '(min-width: 672px)';

	interface Props {
		name: string;
		count: number;
		parties: AffiliationParty[];
		maxComparableRowVote?: number;
		isViewPercent?: boolean;
		resultColorLookup: Record<string, string | undefined>;
		getOptionColor: (vote: string) => {
			className: string;
			style?: string;
		};
	}

	let {
		name,
		count,
		parties,
		maxComparableRowVote = 0,
		isViewPercent = false,
		resultColorLookup,
		getOptionColor
	}: Props = $props();

	let isExpanded = $state(false);
	let isDesktop = $state(false);

	function toggleExpanding() {
		if (!isDesktop) isExpanded = !isExpanded;
	}

	function formatPercent(value: number, total: number) {
		return `${((value / total) * 100).toLocaleString('th-TH', {
			maximumFractionDigits: 1
		})}%`;
	}

	let getBarWidthPercent = $derived((total: number) => {
		if (isViewPercent) return 100;
		if (maxComparableRowVote <= 0) return 0;
		return (total / maxComparableRowVote) * 100;
	});

	onMount(() => {
		const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
		const syncIsDesktop = () => {
			isDesktop = mediaQuery.matches;
		};

		syncIsDesktop();
		mediaQuery.addEventListener('change', syncIsDesktop);

		return () => mediaQuery.removeEventListener('change', syncIsDesktop);
	});

	let allVotes = $derived(sumVotesByOption(parties));
	let highestVote = $derived(findHighestVote(allVotes));
	let isContentVisible = $derived(isDesktop || isExpanded);
	let partiesPanelId = $derived('aff-' + name.replace(/\s/g, '-'));
	let hasPartiesPanel = $derived(parties.length > 1);
	let isMpNoParty = $derived(name === 'สส.ไม่ทราบฝ่าย');
</script>

<div class="flex w-full flex-col border-t border-gray-30 pb-4 md:pb-0">
	<div
		class="flex w-full flex-col md:cursor-default"
		onclick={toggleExpanding}
		onkeypress={(e) => {
			if (e.code === 'Enter' || e.code === 'Space') toggleExpanding();
		}}
		tabindex="0"
		aria-expanded={isContentVisible}
		aria-controls={hasPartiesPanel ? partiesPanelId : undefined}
		role="button"
	>
		<div class="mt-2 flex items-center gap-x-1">
			<p class="heading-02">
				{name}{#if isMpNoParty}<a href="#mp-no-party-footnote" class="text-text-primary"
						>*<span class="sr-only">รายละเอียด</span></a
					>{/if}
			</p>
			<p class="body-02 text-gray-60">{count} คน</p>
			<ChevronDown
				class="ml-auto flex self-start justify-self-start transition-transform md:hidden {isExpanded
					? 'rotate-180'
					: ''}"
			/>
		</div>
		{#if highestVote}
			<div
				class="mt-1 flex items-center gap-x-1 {resultColorLookup[highestVote.name] ??
					'text-purple-70'}"
			>
				<p class="heading-03">
					{isViewPercent ? formatPercent(highestVote.count, count) : highestVote.count + ' คน'}
				</p>
				<p class="heading-03">{highestVote.name}</p>
			</div>
		{/if}
		<div class="mt-1 flex items-center gap-x-3">
			{#each allVotes as vote (vote.name)}
				{@const { className, style } = getOptionColor(vote.name)}
				<div class="flex items-center gap-x-1">
					<div class="h-3 w-1 {className}" {style}></div>
					<p class="label-01">
						{isViewPercent ? formatPercent(vote.count, count) : vote.count}
					</p>
				</div>
			{/each}
		</div>
		<div
			class="mt-1 flex h-[30px] max-w-full flex-none"
			style={`width: ${getBarWidthPercent(count)}%;`}
		>
			{#each allVotes as vote (vote.name)}
				{#if count}
					{@const { className, style } = getOptionColor(vote.name)}
					<VoteChartTooltip
						option={vote.name}
						value={vote.count}
						total={count}
						class={className}
						{style}
					/>
				{/if}
			{/each}
		</div>
	</div>
	{#if hasPartiesPanel}
		<div
			id={partiesPanelId}
			class="{isContentVisible ? 'flex' : 'hidden'} mt-4 w-full flex-col gap-y-4 md:flex"
		>
			{#each parties as party (party.name)}
				<div class="flex items-start gap-x-1">
					<img
						class="h-8 w-8 rounded-full border border-gray-30"
						src={party.image ?? '/images/parties/_placeholder.webp'}
						alt={party.name}
						loading="lazy"
						decoding="async"
					/>
					<div class="flex w-full flex-col items-start justify-start">
						<div class="flex items-center gap-x-1">
							<p class="heading-02">{party.name ?? 'ไม่พบข้อมูล'}</p>
							<p class="body-02 text-gray-60">
								{party.count} คน
							</p>
						</div>
						<div class="mt-1 flex items-center gap-x-3">
							{#each party.options as partyVote (partyVote.name)}
								{@const { className, style } = getOptionColor(partyVote.name)}
								<div class="flex items-center gap-x-1">
									<div class="h-3 w-1 {className}" {style}></div>
									<p class="label-01">
										{isViewPercent ? formatPercent(partyVote.count, party.count) : partyVote.count}
									</p>
								</div>
							{/each}
						</div>
						<div
							class="mt-1 flex h-[20px] max-w-full flex-none"
							style={`width: ${getBarWidthPercent(party.count)}%;`}
						>
							{#each party.options as partyVote (partyVote.name)}
								{#if partyVote.count}
									{@const { className, style } = getOptionColor(partyVote.name)}
									<VoteChartTooltip
										option={partyVote.name}
										value={partyVote.count}
										total={party.count}
										class={className}
										{style}
									/>
								{/if}
							{/each}
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
	{#if isMpNoParty}
		<p id="mp-no-party-footnote" class="label-01 mt-6 text-gray-60">
			* ข้อมูลการสังกัดพรรคและฝ่ายในสภาฯ ยึดตามข้อมูล ณ วันที่ลงมติ
			ซึ่งเป็นไปได้ว่าในวันนั้นมีอาจสส.ที่ไม่มีสังกัดพรรคร่วมลงมติ
			เพราะอาจอยู่ระหว่างการย้ายพรรคการเมือง หรือเพิ่งโดนขับออกจากพรรค เป็นต้น ตามรัฐธรรมนูญ 60 สส.
			ต้องสังกัดพรรคใหม่ภายใน 30 วัน ในกรณีที่ถูกขับออก และ 60 วันในกรณียุบพรรค ไม่เช่นนั้นจะพ้นสภาพ
		</p>
	{/if}
</div>
