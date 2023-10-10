<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	import VotingOptionTag from './VotingOptionTag.svelte';
	import { DefaultVoteOption } from '$models/voting';
	export let Hst: Hst;

	let label = 'ชื่อแคนดิเดต';
	let colorIntensity = 1;
</script>

<Hst.Story title="VotingOptionTag" layout={{ type: 'grid', width: 240 }}>
	<Hst.Variant title={'DefaultVoteOption.Agreed'}>
		<VotingOptionTag voteOption={DefaultVoteOption.Agreed} />
	</Hst.Variant>
	<Hst.Variant title={'DefaultVoteOption.Disagreed'}>
		<VotingOptionTag voteOption={DefaultVoteOption.Disagreed} />
	</Hst.Variant>
	<Hst.Variant title={'DefaultVoteOption.Novote'}>
		<VotingOptionTag voteOption={DefaultVoteOption.Novote} />
	</Hst.Variant>
	<Hst.Variant title={'DefaultVoteOption.Abstain'}>
		<VotingOptionTag voteOption={DefaultVoteOption.Abstain} />
	</Hst.Variant>
	<Hst.Variant title={'DefaultVoteOption.Absent'}>
		<VotingOptionTag voteOption={DefaultVoteOption.Absent} />
	</Hst.Variant>
	<Hst.Variant title={'CustomVoteOption'}>
		<VotingOptionTag voteOption={{ label, colorIntensity }} />
		<svelte:fragment slot="controls">
			<Hst.Text bind:value={label} title="Label" />
			<Hst.Slider bind:value={colorIntensity} title="Color Intensity" step={0.05} min={0} max={1} />
		</svelte:fragment>
	</Hst.Variant>
</Hst.Story>
