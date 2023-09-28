<script lang="ts">
	import { DefaultVotingResult } from '$models/voting';
	import { Tag } from 'carbon-components-svelte';

	export let result: DefaultVotingResult | string;

	let tagColor = 'bg-purple-70';
	let label = result;

	switch (result) {
		case DefaultVotingResult.Passed:
			tagColor = 'bg-teal-30';
			label = DefaultVotingResult.Passed;
			break;
		case DefaultVotingResult.Failed:
			tagColor = 'bg-red-30';
			label = DefaultVotingResult.Failed;
			break;
	}

	let className = '';
	export { className as class };
</script>

<Tag class="{tagColor} {className}">{label}</Tag>
