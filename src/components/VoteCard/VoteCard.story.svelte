<script lang="ts">
	import { buildVotesSummary, optionsArrayToResultSummary } from '$lib/vote-summary';
	import { DefaultVotingResult } from '$models/voting';
	import VoteCard, { type VoteCardProps } from './VoteCard.svelte';
	import type { Hst as HstStory } from '@histoire/plugin-svelte';

	let { Hst }: { Hst: HstStory } = $props();

	const sampleGroups = [
		{
			name: 'สส.ฝ่ายรัฐบาล',
			options: [
				{
					name: 'เห็นด้วย',
					count: 160
				},
				{
					name: 'ไม่เห็นด้วย',
					count: 40
				}
			]
		},
		{
			name: 'สส.ฝ่ายค้าน',
			options: [
				{
					name: 'เห็นด้วย',
					count: 100
				},
				{
					name: 'ไม่เห็นด้วย',
					count: 80
				}
			]
		},
		{
			name: 'สว.',
			options: [
				{
					name: 'เห็นด้วย',
					count: 100
				},
				{
					name: 'ไม่เห็นด้วย',
					count: 120
				}
			]
		}
	];

	const resultSummaries = sampleGroups.map((group) => ({
		name: group.name,
		resultSummary: optionsArrayToResultSummary(group.options)
	}));

	const createVoteCardProps = (props: VoteCardProps) => ({
		...props,
		votesSummary: buildVotesSummary({ groups: resultSummaries, result: props.result })
	});

	const passedVoting = createVoteCardProps({
		id: '1',
		date: '2023-08-31',
		title: 'ร่าง พ.ร.บ.สุราก้าวหน้า (ส่งไป ครม.)',
		result: DefaultVotingResult.Passed
	});

	const failedVoting = createVoteCardProps({
		id: '2',
		date: '2023-09-01',
		title: 'ร่าง พ.ร.บ.สุราก้าวหน้า (ส่งไป ครม.)',
		result: DefaultVotingResult.Failed
	});

	const dictVoteCardProps: Record<DefaultVotingResult, VoteCardProps> = {
		[DefaultVotingResult.Passed]: passedVoting,
		[DefaultVotingResult.Failed]: failedVoting
	};

	let result: DefaultVotingResult = $state(DefaultVotingResult.Passed);
	let candidateName = $state('');

	let isCandidateResult = $derived('candidate' === (result as string));
	let candidateVoteCardProps = $derived(
		createVoteCardProps({
			id: '3',
			date: '2023-09-02T17:00:00.000Z',
			title: 'เลือกนายกรัฐมนตรีไทย คนที่ 29',
			result: candidateName || 'Mr. Candidate Krub'
		})
	);
	let voting = $derived(dictVoteCardProps[result] || candidateVoteCardProps);
</script>

<Hst.Story title="VoteCard">
	<VoteCard {...voting} />

	<svelte:fragment slot="controls">
		<p>Card Result:</p>
		<Hst.Select
			title="Voting Result"
			bind:value={result}
			options={[
				{ label: 'DefaultVotingResult.Passed', value: DefaultVotingResult.Passed },
				{ label: 'DefaultVotingResult.Failed', value: DefaultVotingResult.Failed },
				{ label: 'Any String (Candidate Name)', value: 'candidate' }
			]}
		/>
		{#if isCandidateResult}
			<Hst.Text title="Candidate Name" bind:value={candidateName} />
		{/if}

		<p>Example Props:</p>
		<Hst.Json title="Example `voting` Prop" bind:value={voting} />
		<Hst.Json title="Example `votesSummary` Prop" bind:value={voting.votesSummary} />
	</svelte:fragment>
</Hst.Story>
