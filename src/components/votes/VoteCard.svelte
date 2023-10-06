<script lang="ts">
	import { DefaultVotingResult, type Voting } from '$models/voting';
	import { Tag } from 'carbon-components-svelte';
	import dayjs from 'dayjs';
	import 'dayjs/locale/th';
	import buddhistEra from 'dayjs/plugin/buddhistEra';
	import { failedVotingSummary } from '../../mocks/data/voting';
	import Icons from '$components/icons/Icons.story.svelte';

	dayjs.extend(buddhistEra);
	dayjs.locale('th');

	interface VoteCardProps {
		voting: Pick<Voting, 'id' | 'title' | 'date' | 'result' | 'sourceUrl'>;
		highlightedVoteByGroups: {
			name: string;
			count: number;
			total: number;
		}[];
	}
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

	const { totalCount, totalAmount } = failedVotingSummary.reduce(
		(acc, assembly) => {
			return {
				totalCount: acc.totalCount + assembly.count,
				totalAmount: acc.totalAmount + assembly.total
			};
		},
		{ totalCount: 0, totalAmount: 0 }
	);

	$: theme = CARD_THEMES[voting.result as DefaultVotingResult] || CANDIDATE_CARD_THEME;
	$: isCandidate = ![DefaultVotingResult.Failed, DefaultVotingResult.Passed].includes(
		voting.result as DefaultVotingResult
	);
</script>

<div
	class={`vote-card relative p-4 flex flex-col gap-y-2 w-72 h-64.5 whitespace-break-spaces ${theme.bg} ${theme.hoveredBg}`}
>
	<p class="text-02">{dayjs(voting.date).format('D MMM BB')}</p>
	<a
		class="vote-card--url after:inset text-text-01 text-xl font-[700] no-underline after:absolute w-56"
		href={voting.sourceUrl}
	>
		{voting.title}
	</a>
	<section class="vote-card__result flex flex-col gap-y-2 w-56">
		<Tag class={`${theme.tagFontColor} ${theme.tagBg} w-fit m-0`}>{voting.result}</Tag>
		<div class="flex flex-col gap-x-1">
			<div class="flex align-middle justify-between">
				<p class="text-text-01 font-[600]">{isCandidate ? voting.result : 'เห็นด้วย'}</p>
				<p>
					<span class="mr-[2px] text-text-primary font-[600]">{totalCount}</span>
					<span class="text-text-02">/{totalAmount}</span>
				</p>
			</div>
			<ul class="vote-card__result--list">
				{#each highlightedVoteByGroups as voteByGroup}
					<li class="vote-card__result--item flex flex-row align-middle justify-between">
						<p>{voteByGroup.name}</p>
						<p>
							<span class="mr-[2px] text-text-primary">{voteByGroup.count}</span>
							<span class="text-text-02">/{voteByGroup.total}</span>
						</p>
					</li>
				{/each}
			</ul>
		</div>
	</section>
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
