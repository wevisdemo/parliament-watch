<script lang="ts">
	import VoteChartTooltip from '$components/VoteChartTooltip/VoteChartTooltip.svelte';
	import ChevronDown from 'carbon-icons-svelte/lib/ChevronDown.svelte';
	import { groups } from 'd3-array';
	import { onMount } from 'svelte';

	interface Props {
		name: string;
		count: number;
		parties: {
			name?: string;
			image?: string;
			count: number;
			options: {
				name: string;
				count: number;
			}[];
		}[];
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

	function toggleExpanding() {
		isExpanded = !isExpanded;
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
		if (window.matchMedia(`(min-width: 672px)`).matches) {
			isExpanded = true;
		}
	});

	let allVotes = $derived(
		groups(
			parties.flatMap((p) => p.options),
			(v) => v.name
		).map(([optionName, votes]) => ({
			name: optionName,
			count: votes.reduce((sum, { count: optionCount }) => sum + optionCount, 0)
		}))
	);

	let highestVote = $derived(
		allVotes.reduce((max, current) => (current.count > max.count ? current : max), allVotes[0])
	);

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
		aria-expanded={isExpanded}
		aria-controls="aff-{name.replace(/\s/g, '-')}"
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
		<div
			class="mt-1 flex items-center gap-x-1 {resultColorLookup[highestVote.name] ??
				'text-purple-70'}"
		>
			<p class="heading-03">
				{isViewPercent ? formatPercent(highestVote.count, count) : highestVote.count + ' คน'}
			</p>
			<p class="heading-03">{highestVote.name}</p>
		</div>
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
	{#if parties.length > 1}
		<div
			id={'aff-' + name.replace(/\s/g, '-')}
			class="{isExpanded ? 'flex' : 'hidden'} mt-4 w-full flex-col gap-y-4 md:flex"
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
