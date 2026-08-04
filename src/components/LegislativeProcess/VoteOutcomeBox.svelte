<script lang="ts">
	import VotingResultTag from '$components/VotingResultTag/VotingResultTag.svelte';
	import { DefaultVotingResult } from '$models/voting';
	import GrayBox from './GrayBox.svelte';
	import VerticalGrayLine from './VerticalGrayLine.svelte';

	interface Props {
		passedDescription: string;
		failedDescription: string;
	}

	let { passedDescription, failedDescription }: Props = $props();
</script>

<GrayBox title="ผลลัพธ์">
	<div class="flex w-full flex-row justify-between">
		<div class="w-full">
			<VotingResultTag class="m-0" result={DefaultVotingResult.Passed} />
			<p class="body-02">{passedDescription}</p>
		</div>
		<VerticalGrayLine />
		<div class="w-full pl-2">
			<VotingResultTag class="m-0" result={DefaultVotingResult.Failed} />
			<p class="body-02">{failedDescription}</p>
		</div>
	</div>
</GrayBox>
