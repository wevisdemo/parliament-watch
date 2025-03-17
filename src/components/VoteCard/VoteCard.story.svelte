<script lang="ts">
	import { DefaultVotingResult } from '$models/voting';
	import type { ComponentProps } from 'svelte';
	import VoteCard, { type HighlightedVoteByGroup } from './VoteCard.svelte';
	import type { Hst } from '@histoire/plugin-svelte';

	export let Hst: Hst;

	const passedHighlightedVoteByGroups: HighlightedVoteByGroup[] = [
		{
			name: 'สส.ฝ่ายรัฐบาล',
			count: 160,
			total: 315
		},
		{
			name: 'สส.ฝ่ายค้าน',
			count: 164,
			total: 185
		},
		{
			name: 'สว.',
			count: 200,
			total: 250
		}
	];

	const passedVoting: ComponentProps<VoteCard> = {
		id: '1',
		date: new Date('2023-08-31T17:00:00.000Z'),
		nickname: 'ร่าง พ.ร.บ.สุราก้าวหน้า (ส่งไป ครม.)',
		result: DefaultVotingResult.Passed,
		votesByGroup: passedHighlightedVoteByGroups
	};

	const failedVoting: ComponentProps<VoteCard> = {
		id: '2',
		date: new Date('2023-09-01T17:00:00.000Z'),
		nickname: 'ร่าง พ.ร.บ.สุราก้าวหน้า (ส่งไป ครม.)',
		result: DefaultVotingResult.Failed,
		votesByGroup: [
			{
				name: 'สส.ฝ่ายรัฐบาล',
				count: 16,
				total: 315
			},
			{
				name: 'สส.ฝ่ายค้าน',
				count: 4,
				total: 185
			},
			{
				name: 'สว.',
				count: 20,
				total: 250
			}
		]
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
		/**
		 * @author fResult <Styxmaz@gmail.com>
		 * FIXME: Actually, it should be new Date('2023-09-02T17:00:00.000Z'), but I can't get Date object from Reactivity (Proxie)
		 */
		date: '2023-09-02T17:00:00.000Z' as unknown as Date,
		nickname: 'เลือกนายกรัฐมนตรีไทย คนที่ 29',
		result: candidateName || 'Mr. Candidate Krub',
		votesByGroup: passedHighlightedVoteByGroups
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
