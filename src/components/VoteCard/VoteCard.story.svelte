<script lang="ts">
	import { DefaultVotingResult } from '$models/voting';
	import type { ComponentProps } from 'svelte';
	import VoteCard from './VoteCard.svelte';
	import type { Hst } from '@histoire/plugin-svelte';

	export let Hst: Hst;

	const votesByGroup: ComponentProps<VoteCard>['votesByGroup'] = [
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

	const passedVoting: ComponentProps<VoteCard> = {
		id: '1',
		date: '2023-08-31',
		title: 'ร่าง พ.ร.บ.สุราก้าวหน้า (ส่งไป ครม.)',
		result: DefaultVotingResult.Passed,
		votesByGroup: votesByGroup
	};

	const failedVoting: ComponentProps<VoteCard> = {
		id: '2',
		date: '2023-09-01',
		title: 'ร่าง พ.ร.บ.สุราก้าวหน้า (ส่งไป ครม.)',
		result: DefaultVotingResult.Failed,
		votesByGroup: votesByGroup
	};

	const dictVoteCardProps: Record<DefaultVotingResult, ComponentProps<VoteCard>> = {
		[DefaultVotingResult.Passed]: passedVoting,
		[DefaultVotingResult.Failed]: failedVoting
	};

	let result: DefaultVotingResult = DefaultVotingResult.Passed;
	let candidateName = '';

	$: isCandidateResult = 'candidate' === (result as string);
	$: voting = dictVoteCardProps[result] || candidateVoteCardProps;
	$: candidateVoteCardProps = {
		id: '3',
		date: '2023-09-02T17:00:00.000Z',
		title: 'เลือกนายกรัฐมนตรีไทย คนที่ 29',
		result: candidateName || 'Mr. Candidate Krub',
		votesByGroup
	} satisfies ComponentProps<VoteCard>;
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
		<Hst.Json title="Example `highlightedVoteByGroups` Prop" bind:value={voting.votesByGroup} />
	</svelte:fragment>
</Hst.Story>
