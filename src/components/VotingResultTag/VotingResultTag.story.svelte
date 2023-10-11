<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	import VotingResultTag from './VotingResultTag.svelte';
	import { DefaultVotingResult } from '$models/voting';

	export let Hst: Hst;

	let isLarge = false;
	let customResult = '[ชื่อแคนดิเดต]ชนะ';
</script>

<Hst.Story title="VotingResultTag" layout={{ type: 'grid' }}>
	<Hst.Variant title="DefaultVotingResult.Passed">
		<VotingResultTag result={DefaultVotingResult.Passed} {isLarge} />
	</Hst.Variant>

	<Hst.Variant title="DefaultVotingResult.Failed">
		<VotingResultTag result={DefaultVotingResult.Failed} {isLarge} />
	</Hst.Variant>

	<Hst.Variant title="CustomVotingResult">
		<VotingResultTag result={customResult} {isLarge} />
		<svelte:fragment slot="controls">
			<Hst.Text bind:value={customResult} title="Custom result" />
		</svelte:fragment>
	</Hst.Variant>

	<svelte:fragment slot="controls">
		<Hst.Checkbox bind:value={isLarge} title="isLarge" />
	</svelte:fragment>
</Hst.Story>
