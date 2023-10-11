<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	import VotingResultTag from './VotingResultTag.svelte';
	import { DefaultVotingResult } from '$models/voting';
	export let Hst: Hst;
	let selectedResult = DefaultVotingResult.Passed as DefaultVotingResult | 'custom';
	let customResult = '[ชื่อแคนดิเดต]ชนะ';
	let result: DefaultVotingResult | string;

	$: result = selectedResult === 'custom' ? customResult : selectedResult;
</script>

<Hst.Story title="VotingResultTag" layout={{ type: 'grid' }}>
	<Hst.Variant title="Small (Default)">
		<VotingResultTag {result} />
	</Hst.Variant>
	<Hst.Variant title="Large">
		<VotingResultTag {result} isLarge />
	</Hst.Variant>

	<svelte:fragment slot="controls">
		<Hst.Select
			bind:value={selectedResult}
			title="Result"
			options={[
				{ label: 'Passed', value: DefaultVotingResult.Passed },
				{ label: 'Failed', value: DefaultVotingResult.Failed },
				{ label: 'Custom', value: 'custom' }
			]}
		/>
		{#if selectedResult === 'custom'}
			<Hst.Text bind:value={customResult} title="Custom result" />
		{/if}</svelte:fragment
	>
</Hst.Story>
