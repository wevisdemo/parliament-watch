<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	import VotingOptionTag from './VotingOptionTag.svelte';
	import { DefaultVoteOption } from '$models/voting';
	export let Hst: Hst;
</script>

<Hst.Story title="VotingOptionTag">
	<div class="flex flex-col gap-4">
		<div>
			<VotingOptionTag voteOption={DefaultVoteOption.Agreed} />
			<VotingOptionTag voteOption={DefaultVoteOption.Disagreed} />
			<VotingOptionTag voteOption={DefaultVoteOption.Novote} />
			<VotingOptionTag voteOption={DefaultVoteOption.Abstain} />
		</div>
		<div>
			<VotingOptionTag voteOption={{ label: 'ชื่อแคนดิเดต', colorIntensity: 1 }} />
			<VotingOptionTag voteOption={{ label: 'ชื่อแคนดิเดต', colorIntensity: 0.75 }} />
			<VotingOptionTag voteOption={{ label: 'ชื่อแคนดิเดต', colorIntensity: 0.5 }} />
			<VotingOptionTag voteOption={{ label: 'ชื่อแคนดิเดต', colorIntensity: 0.25 }} />
			<VotingOptionTag voteOption={{ label: 'ชื่อแคนดิเดต', colorIntensity: 0 }} />
		</div>
	</div>
</Hst.Story>
