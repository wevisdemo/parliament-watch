<script lang="ts">
	import VoteChartTooltip from '$components/VoteChartTooltip/VoteChartTooltip.svelte';
	import type { CustomVoteOption, DefaultVoteOption } from '$models/voting.js';
	import { Add } from 'carbon-icons-svelte';
	import { groups } from 'd3';
	import { onMount } from 'svelte';

	export let name: string;
	export let count: number;
	export let parties: {
		name?: string;
		image?: string;
		count: number;
		options: {
			name: string;
			count: number;
		}[];
	}[];

	export let affiliationPercent = 100;
	export let isViewPercent: boolean;
	export let resultColorLookup: Record<string, string | undefined>;
	export let getOptionColor: (vote: string) => {
		className: string;
		style?: string;
	};

	let isExpanded = false;
	let selectedTab: string[] = [];

	function toggleExpanding() {
		isExpanded = !isExpanded;
	}

	function formatPercent(value: number, total: number) {
		return `${((value / total) * 100).toLocaleString('th-TH', {
			maximumFractionDigits: 1
		})}%`;
	}

	onMount(() => {
		if (window.matchMedia(`(min-width: 672px)`).matches) {
			isExpanded = true;
		}
	});

	$: allVotes = groups(
		parties.flatMap((p) => p.options),
		(v) => v.name
	).map(([name, votes]) => ({
		name,
		count: votes.reduce((sum, { count }) => sum + count, 0)
	}));

	$: highestVote = allVotes.reduce(
		(max, current) => (current.count > max.count ? current : max),
		allVotes[0]
	);

	$: isMpNoParty = name === 'สส.ไม่ทราบฝ่าย';
</script>

<div class="flex w-full flex-col border-t border-gray-30 pb-4 md:pb-0">
	<div
		class="flex w-full flex-col md:cursor-default"
		on:click={toggleExpanding}
		on:keypress={(e) => {
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
			<Add class="ml-auto flex self-start justify-self-start md:hidden" />
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
			{#each allVotes as vote}
				{@const { className, style } = getOptionColor(vote.name)}
				<div class="flex items-center gap-x-1">
					<div class="h-3 w-1 {className}" {style} />
					<p class="label-01">
						{isViewPercent ? formatPercent(vote.count, count) : vote.count}
					</p>
				</div>
			{/each}
		</div>
		<div class="mt-1 flex h-[30px]" style:width="{affiliationPercent}%">
			{#each allVotes as vote}
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
			class="{selectedTab.includes(name) ? 'flex' : 'hidden'} mt-4 w-full flex-col gap-y-4 md:flex"
		>
			{#each parties as party}
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
							{#each party.options as partyVote}
								<div class="flex items-center gap-x-1">
									<div class="h-3 w-1 {getOptionColor(partyVote.name)}" />
									<p class="label-01">
										{isViewPercent ? formatPercent(partyVote.count, party.count) : partyVote.count}
									</p>
								</div>
							{/each}
						</div>
						<div class="mt-1 flex h-[20px] w-full">
							{#each party.options as partyVote}
								{#if partyVote.count}
									{@const { className, style } = getOptionColor(partyVote.name)}
									<VoteChartTooltip
										option={partyVote.name}
										value={partyVote.count}
										total={count}
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
