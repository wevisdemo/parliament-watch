<script lang="ts">
	import DirectionStraightRight from 'carbon-icons-svelte/lib/DirectionStraightRight.svelte';
	import { DefaultVotingResult } from '$models/voting';
	import dayjs from 'dayjs';
	import 'dayjs/locale/th';
	import buddhistEra from 'dayjs/plugin/buddhistEra';
	import { twMerge } from 'tailwind-merge';
	import VotingResultTag from '$components/VotingResultTag/VotingResultTag.svelte';
	import { type VotesSummary, type VotesSummaryHighlight } from '$lib/vote-summary';

	dayjs.extend(buddhistEra);
	dayjs.locale('th');

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

	export let date: string;
	export let title: string;
	export let id: string;
	export let result: string | null;
	export let votesSummary: VotesSummary | null = null;
	export let isFullWidth = false;

	let className = '';
	export { className as class };

	const EMPTY_SUMMARY: VotesSummary = {
		total: 0,
		optionOrder: [],
		winnerOption: null,
		highlight: null,
		overall: [],
		groups: []
	};

	let summary: VotesSummary = EMPTY_SUMMARY;
	let highlight: VotesSummaryHighlight | null = summary.highlight;
	let highlightOptionName: string | null = summary.highlight?.option ?? null;

	$: summary = votesSummary ?? EMPTY_SUMMARY;
	$: highlight = summary.highlight;
	$: highlightOptionName = highlight?.option ?? null;
	$: totalVotesCount = summary.total;
	$: theme = CARD_THEMES[result as DefaultVotingResult] || CANDIDATE_CARD_THEME;
</script>

<a
	href="/votings/{id}"
	class={twMerge(
		'vote-card h-64.5 relative flex w-72 flex-col gap-y-2 whitespace-break-spaces rounded-sm p-4',
		theme.bg,
		theme.hoveredBg,
		isFullWidth ? 'w-full' : '',
		className
	)}
>
	<p class="body-compact-01 text-text-02">
		{dayjs(date).format('D MMM BB')}
	</p>
	<h3 class="fluid-heading-03 text-text-01">{title}</h3>
	<div class="flex w-56 flex-1 flex-col gap-y-2">
		<VotingResultTag {result} />
		<div class="flex flex-col gap-x-1">
			{#if totalVotesCount > 0 && highlight}
				<div class="flex items-center justify-between">
					<p class="heading-01 text-text-01">
						{highlight.label}
					</p>
					<p>
						<span class="heading-01 text-text-primary">{highlight.count}</span>
						<span class="body-01 text-text-02">/{totalVotesCount}</span>
					</p>
				</div>
			{/if}
			<ul>
				{#each summary.groups as group (group.name)}
					<li class="flex flex-row justify-between">
						<p class="body-01 text-text-01">{group.name}</p>
						<p class="body-01">
							<span class="text-text-primary"
								>{highlightOptionName
									? group.options.find((o) => o.option === highlightOptionName)?.count ?? 0
									: 0}</span
							>
							<span class="text-text-02">/{group.total}</span>
						</p>
					</li>
				{/each}
			</ul>
		</div>
	</div>
	<DirectionStraightRight class="self-end" />
</a>

<style lang="scss">
	.vote-card {
		position: relative;

		&--url {
			&::after {
				content: '';
				position: absolute;
				inset: 0;
			}
		}
	}
</style>
