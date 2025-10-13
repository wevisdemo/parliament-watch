<script lang="ts">
	import DirectionStraightRight from 'carbon-icons-svelte/lib/DirectionStraightRight.svelte';
	import { DefaultVoteOption, DefaultVotingResult } from '$models/voting';
	import dayjs from 'dayjs';
	import 'dayjs/locale/th';
	import buddhistEra from 'dayjs/plugin/buddhistEra';
	import { twMerge } from 'tailwind-merge';
	import VotingResultTag from '$components/VotingResultTag/VotingResultTag.svelte';

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
	export let votesByGroup: {
		name: string;
		options: {
			name: string;
			count: number;
		}[];
	}[] = [];
	export let isFullWidth = false;

	let className = '';
	export { className as class };

	$: theme = CARD_THEMES[result as DefaultVotingResult] || CANDIDATE_CARD_THEME;

	$: highlightOption =
		!result || result === DefaultVotingResult.Passed
			? DefaultVoteOption.Agreed
			: result === DefaultVotingResult.Failed
				? DefaultVoteOption.Disagreed
				: result;

	$: totalVotesCount = votesByGroup.reduce(
		(total, { options }) => total + options.reduce((sum, { count }) => sum + count, 0),
		0
	);

	$: highlightVotesCount = votesByGroup.reduce(
		(total, { options }) =>
			total + (options.find(({ name }) => name === highlightOption)?.count ?? 0),
		0
	);
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
			{#if totalVotesCount > 0}
				<div class="flex items-center justify-between">
					<p class="heading-01 text-text-01">
						{highlightOption}
					</p>
					<p>
						<span class="heading-01 text-text-primary">{highlightVotesCount}</span>
						<span class="body-01 text-text-02">/{totalVotesCount}</span>
					</p>
				</div>
			{/if}
			<ul>
				{#each votesByGroup as group (group.name)}
					<li class="flex flex-row justify-between">
						<p class="body-01 text-text-01">{group.name}</p>
						<p class="body-01">
							<span class="text-text-primary"
								>{group.options.find((o) => o.name == highlightOption)?.count ?? 0}</span
							>
							<span class="text-text-02">/{group.options.reduce((acc, o) => acc + o.count, 0)}</span
							>
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
