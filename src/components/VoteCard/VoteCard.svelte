<script lang="ts">
	import DirectionStraightRight from 'carbon-icons-svelte/lib/DirectionStraightRight.svelte';
	import { DefaultVoteOption, DefaultVotingResult } from '$models/voting';
	import { twMerge } from 'tailwind-merge';
	import VotingResultTag from '$components/VotingResultTag/VotingResultTag.svelte';
	import VoteStackedBar from '$components/VoteStackedBar/VoteStackedBar.svelte';
	import type { VotesSummary } from '$lib/vote-summary';
	import { formatThaiDate } from '$lib/date';

	interface VoteCardTheme {
		bg: string;
		hoveredBg: string;
	}

	const CARD_THEMES: Record<DefaultVotingResult, VoteCardTheme> = {
		[DefaultVotingResult.Passed]: {
			bg: 'bg-teal-10',
			hoveredBg: 'hover:bg-teal-20'
		},
		[DefaultVotingResult.Failed]: {
			bg: 'bg-red-10',
			hoveredBg: 'hover:bg-red-20'
		}
	};

	const CANDIDATE_CARD_THEME: VoteCardTheme = {
		bg: 'bg-purple-10',
		hoveredBg: 'hover:bg-purple-20'
	};

	const percentageFormatter = new Intl.NumberFormat('th-TH', {
		maximumFractionDigits: 0
	});

	const numberFormatter = new Intl.NumberFormat('th-TH');

	const highlightColorLookup: Record<string, string> = {
		[DefaultVoteOption.Agreed]: 'text-teal-70',
		[DefaultVoteOption.Disagreed]: 'text-red-70',
		[DefaultVoteOption.Abstain]: 'text-gray-80',
		[DefaultVoteOption.Novote]: 'text-gray-60',
		[DefaultVoteOption.Absent]: 'text-gray-50'
	};

	const EMPTY_SUMMARY: VotesSummary = {
		total: 0,
		optionOrder: [],
		winnerOption: null,
		highlight: null,
		overall: [],
		groups: []
	};

	export let date: string;
	export let title: string;
	export let id: string;
	export let result: string | null;
	export let votesSummary: VotesSummary | null = EMPTY_SUMMARY;
	export let isFullWidth = false;

	let className = '';
	export { className as class };

	$: summary = votesSummary ?? EMPTY_SUMMARY;
	$: highlight = summary.highlight;
	$: highlightOptionName = highlight?.option ?? null;
	$: totalVotesCount = summary.total;
	$: theme = CARD_THEMES[result as DefaultVotingResult] || CANDIDATE_CARD_THEME;

	const formatCount = (value: number) => numberFormatter.format(value);

	const highlightGroups = () => {
		if (!summary.groups.length) return [];

		return summary.groups.map((group) => ({
			name: group.name,
			total: group.total,
			highlightCount: highlightOptionName
				? (group.options.find((option) => option.option === highlightOptionName)?.count ?? 0)
				: 0
		}));
	};
</script>

<a
	href="/votings/{id}"
	class={twMerge(
		'border-transparent relative flex min-h-[19rem] flex-col gap-y-3 whitespace-pre-wrap p-4 transition-colors',
		isFullWidth ? 'w-full' : 'w-72',
		theme.bg,
		theme.hoveredBg,
		className
	)}
>
	<div class="flex items-start justify-between gap-2">
		<p class="body-compact-01 text-text-02">
			{formatThaiDate(date, { shortMonth: true, shortYear: true })}
		</p>
		<VotingResultTag {result} />
	</div>
	<h3 class="fluid-heading-03 line-clamp-4 text-text-01">{title}</h3>
	<VoteStackedBar segments={summary.overall} total={summary.total} class="mt-2" />
	<hr class="border border-ui-03" />
	<div class="flex flex-col gap-2 text-text-01">
		{#if highlight}
			<div class="flex items-center justify-between">
				<span class="body-01">
					{highlight.label}
				</span>
				<span class="body-01 text-text-02">
					{formatCount(highlight.count)} / {formatCount(totalVotesCount)}
				</span>
			</div>
		{/if}
		{#if summary.groups.length}
			<ul class="list-disc pl-4">
				{#each highlightGroups() as group (group.name)}
					<li class="body-compact-01 leading-3">
						<div class="flex items-center justify-between gap-4">
							<span>{group.name}</span>
							<span class="text-text-02">
								{formatCount(group.highlightCount)} / {formatCount(group.total)}
							</span>
						</div>
					</li>
				{/each}
			</ul>
		{:else}
			<p class="body-01 text-text-02">ไม่มีข้อมูลการลงคะแนนแยกตามกลุ่ม</p>
		{/if}
	</div>
	<DirectionStraightRight class="mt-auto self-end" />
</a>
