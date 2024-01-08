<script lang="ts">
	import { DefaultVotingResult } from '$models/voting';
	import { Tag } from 'carbon-components-svelte';
	import { twMerge } from 'tailwind-merge';

	export let result: DefaultVotingResult | string;
	export let isLarge = false;

	let tagColor = 'bg-purple-70 text-text-04';
	let label = '';

	$: tagText = isLarge ? 'heading-compact-02' : 'label-01';
	$: tagContainer = isLarge ? 'px-2 py-[5px] rounded-3xl' : 'px-2 py-1 rounded-3xl';

	$: switch (result) {
		case DefaultVotingResult.Passed:
			tagColor = 'bg-teal-30 text-text-01';
			label = isLarge ? 'มติผ่าน' : DefaultVotingResult.Passed;
			break;
		case DefaultVotingResult.Failed:
			tagColor = 'bg-red-30 text-text-01';
			label = isLarge ? 'มติไม่ผ่าน' : DefaultVotingResult.Failed;
			break;
		default:
			// purple tag and white text
			tagColor = 'bg-purple-70 text-text-04';
			label = result;
			break;
	}

	let className = '';
	export { className as class };
</script>

<div class={twMerge(tagColor, className, tagText, tagContainer)}>{label}</div>
