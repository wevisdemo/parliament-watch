<script lang="ts">
	import DirectionStraightRight from 'carbon-icons-svelte/lib/DirectionStraightRight.svelte';
	import { DefaultVotingResult, type Voting } from '$models/voting';
	import { Tag } from 'carbon-components-svelte';
	import dayjs from 'dayjs';
	import 'dayjs/locale/th';
	import buddhistEra from 'dayjs/plugin/buddhistEra';
	import type { VoteCardProps } from '../../routes/assemblies/[id]/+page.server';
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

	export let voting: VoteCardProps['voting'] = {} as Voting;
	export let highlightedVoteByGroups: VoteCardProps['highlightedVoteByGroups'] = [];
	export let isFullWidth = false;
	export let link = '/';

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
		{ count, total }: VoteCardProps['highlightedVoteByGroups'][number]
	): HighlightedVoteSummary {
		return {
			totalCount: totalCount + count,
			totalAmount: totalAmount + total
		};
	}
</script>

<div
	class={twMerge(
		'vote-card rounded-sm relative p-4 flex flex-col gap-y-2 w-72 h-64.5 whitespace-break-spaces',
		theme.bg,
		theme.hoveredBg,
		isFullWidth ? 'w-full' : ''
	)}
>
	<p class="body-compact-01 text-text-02">
		{dayjs(voting.date).format('D MMM BB')}
	</p>
	<a class="vote-card--url after:inset no-underline after:absolute w-56" href={link}>
		<h3 class="fluid-heading-03 text-text-01">{voting.title}</h3>
	</a>
	<section class="vote-card__result flex flex-col gap-y-2 w-56">
		<Tag class={`label-01 ${theme.tagFontColor} ${theme.tagBg} w-fit m-0`}>{voting.result}</Tag>
		<div class="flex flex-col gap-x-1">
			<div class="flex items-center justify-between">
				<p class="text-text-01 heading-01">{isCandidate ? 'ได้รับคะแนนเสียง' : 'เห็นด้วย'}</p>
				<p>
					<span class="mr-[2px] text-text-primary heading-01">{totalCount}</span>
					<span class="text-text-02 body-01">/{totalAmount}</span>
				</p>
			</div>
			<ul class="vote-card__result--list">
				{#each highlightedVoteByGroups as voteByGroup (voteByGroup.name)}
					<li class="vote-card__result--item flex flex-row align-middle justify-between">
						<p class="text-text-01 body-01">{voteByGroup.name}</p>
						<p class="body-01">
							<span class="text-text-primary mr-[2px]">{voteByGroup.count}</span>
							<span class="text-text-02">/{voteByGroup.total}</span>
						</p>
					</li>
				{/each}
			</ul>
		</div>
	</section>
	<DirectionStraightRight class="ml-auto" />
</div>

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
