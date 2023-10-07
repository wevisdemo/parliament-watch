<script lang="ts">
	import { DefaultVotingResult } from '$models/voting';
	import type { VoteCardProps } from '../../routes/assemblies/[id]/+page';
	import VoteCard from './VoteCard.svelte';
	import type { Hst } from '@histoire/plugin-svelte';

	export let Hst: Hst;

	const passedVoting: VoteCardProps['voting'] = {
		id: 1,
		date: new Date('2023-08-31T17:00:00.000Z'),
		title: 'ร่าง พ.ร.บ. สุราก้าวหน้า (ส่งไป ครม.)',
		result: DefaultVotingResult.Passed,
		sourceUrl: '/politicians/1/votelog'
	};

	const failedVoting: VoteCardProps['voting'] = {
		id: 2,
		date: new Date('2023-09-01T17:00:00.000Z'),
		title: 'ร่าง พ.ร.บ. สุราก้าวหน้า (ส่งไป ครม.)',
		result: 'ไม่ผ่าน',
		sourceUrl: '/politicians/1/votelog'
	};

	const candidateVoting: VoteCardProps['voting'] = {
		id: 3,
		date: new Date('2023-09-02T17:00:00.000Z'),
		title: 'เลือกนายกรัฐมนตรีไทย คนที่ 29',
		result: 'Mr. Candidate Krub',
		sourceUrl: '/politicians/1/votelog'
	};

	const passedHighlightedVoteByGroups: VoteCardProps['highlightedVoteByGroups'] = [
		{
			name: 'สส. ฝ่ายรัฐบาล',
			count: 160,
			total: 315
		},
		{
			name: 'สส. ฝ่ายค้าน',
			count: 164,
			total: 185
		},
		{
			name: 'สว.',
			count: 200,
			total: 250
		}
	];

	const failedHighlightedVoteByGroups: VoteCardProps['highlightedVoteByGroups'] = [
		{
			name: 'สส. ฝ่ายรัฐบาล',
			count: 16,
			total: 315
		},
		{
			name: 'สส. ฝ่ายค้าน',
			count: 4,
			total: 185
		},
		{
			name: 'สว.',
			count: 20,
			total: 250
		}
	];

	const dictVoteCardProps: Record<DefaultVotingResult, VoteCardProps> = {
		[DefaultVotingResult.Passed]: {
			voting: passedVoting,
			highlightedVoteByGroups: passedHighlightedVoteByGroups
		},
		[DefaultVotingResult.Failed]: {
			voting: failedVoting,
			highlightedVoteByGroups: failedHighlightedVoteByGroups
		}
	};
	const candidateVoteCardProps: VoteCardProps = {
		voting: candidateVoting,
		highlightedVoteByGroups: passedHighlightedVoteByGroups
	};

	let result = DefaultVotingResult.Passed;

	$: ({ voting, highlightedVoteByGroups } = dictVoteCardProps[result] || candidateVoteCardProps);
</script>

<Hst.Story title="VoteCard">
	<VoteCard {voting} {highlightedVoteByGroups} />

	<svelte:fragment slot="controls">
		<Hst.Select
			title="Voting Result"
			bind:value={result}
			options={[
				{ label: 'DefaultVotingResult.Passed', value: DefaultVotingResult.Passed },
				{ label: 'DefaultVotingResult.Failed', value: DefaultVotingResult.Failed },
				{ label: 'Any String (Candidate Name)', value: 'candidate' }
			]}
		/>

		<Hst.Json title="Example `voting` Prop" bind:value={voting} />
		<Hst.Json title="Example `highlightedVoteByGroups` Prop" bind:value={highlightedVoteByGroups} />
	</svelte:fragment>
</Hst.Story>
