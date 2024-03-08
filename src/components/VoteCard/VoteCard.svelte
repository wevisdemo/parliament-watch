<script context="module" lang="ts">
	export type VoteCardVoting = Pick<Voting, 'id' | 'title' | 'date' | 'result'>;

	export interface HighlightedVoteByGroup {
		name: string;
		count: number;
		total: number;
	}
</script>

<script lang="ts">
	import DirectionStraightRight from 'carbon-icons-svelte/lib/DirectionStraightRight.svelte';
	import { DefaultVoteOption, DefaultVotingResult, type Voting } from '$models/voting';
	import { Tag } from 'carbon-components-svelte';
	import dayjs from 'dayjs';
	import 'dayjs/locale/th';
	import buddhistEra from 'dayjs/plugin/buddhistEra';
	import { twMerge } from 'tailwind-merge';

	dayjs.extend(buddhistEra);
	dayjs.locale('th');

	interface VoteCardTheme {
		bg: string;
		hoveredBg: string;
		tagBg: string;
		tagFontColor: string;
	}
	const CARD_THEMES: Record<DefaultVotingResult, VoteCardTheme> = {
		[DefaultVotingResult.Passed]: {
			bg: 'bg-teal-10',
			hoveredBg: 'hover:bg-teal-20',
			tagBg: 'bg-teal-30',
			tagFontColor: 'text-text-01'
		},
		[DefaultVotingResult.Failed]: {
			bg: 'bg-red-10',
			hoveredBg: 'hover:bg-red-20',
			tagBg: 'bg-red-30',
			tagFontColor: 'text-text-01'
		}
	};
	const CANDIDATE_CARD_THEME: VoteCardTheme = {
		bg: 'bg-purple-10',
		hoveredBg: 'hover:bg-purple-20',
		tagBg: 'bg-purple-70',
		tagFontColor: 'text-white'
	};

	export let voting: VoteCardVoting;
	export let highlightedVoteByGroups: HighlightedVoteByGroup[] = [];
	export let isFullWidth = false;

	let className = '';
	export { className as class };

	interface HighlightedVoteSummary {
		totalCount: number;
		totalAmount: number;
	}
	$: ({ totalCount, totalAmount } = highlightedVoteByGroups.reduce<HighlightedVoteSummary>(
		reduceHighlightedVoteSummary,
		{ totalCount: 0, totalAmount: 0 }
	));
	$: theme = CARD_THEMES[voting.result as DefaultVotingResult] || CANDIDATE_CARD_THEME;
	$: isCandidate = ![DefaultVotingResult.Failed, DefaultVotingResult.Passed].includes(
		voting.result as DefaultVotingResult
	);

	function reduceHighlightedVoteSummary(
		{ totalAmount, totalCount }: HighlightedVoteSummary,
		{ count, total }: HighlightedVoteByGroup
	): HighlightedVoteSummary {
		return {
			totalCount: totalCount + count,
			totalAmount: totalAmount + total
		};
	}
</script>

<a
	href="/votings/{voting.id}"
	class={twMerge(
		'vote-card h-64.5 relative flex w-72 flex-col gap-y-2 whitespace-break-spaces rounded-sm p-4',
		theme.bg,
		theme.hoveredBg,
		isFullWidth ? 'w-full' : '',
		className
	)}
>
	<p class="body-compact-01 text-text-02">
		{dayjs(voting.date).format('D MMM BB')}
	</p>
	<h3 class="fluid-heading-03 text-text-01">{voting.title}</h3>
	<section class="vote-card__result flex w-56 flex-col gap-y-2">
		<Tag class={`label-01 ${theme.tagFontColor} ${theme.tagBg} m-0 w-fit`}>{voting.result}</Tag>
		<div class="flex flex-col gap-x-1">
			<div class="flex items-center justify-between">
				<p class="heading-01 text-text-01">
					{isCandidate
						? 'ได้รับคะแนนเสียง'
						: voting.result === DefaultVotingResult.Passed
							? DefaultVoteOption.Agreed
							: DefaultVoteOption.Disagreed}
				</p>
				<p>
					<span class="heading-01 mr-[2px] text-text-primary">{totalCount}</span>
					<span class="body-01 text-text-02">/{totalAmount}</span>
				</p>
			</div>
			<ul class="vote-card__result--list">
				{#each highlightedVoteByGroups as voteByGroup (voteByGroup.name)}
					<li class="vote-card__result--item flex flex-row justify-between align-middle">
						<p class="body-01 text-text-01">{voteByGroup.name}</p>
						<p class="body-01">
							<span class="mr-[2px] text-text-primary">{voteByGroup.count}</span>
							<span class="text-text-02">/{voteByGroup.total}</span>
						</p>
					</li>
				{/each}
			</ul>
		</div>
	</section>
	<DirectionStraightRight class="ml-auto" />
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
