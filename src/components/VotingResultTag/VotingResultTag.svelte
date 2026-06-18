<script lang="ts">
	import { DefaultVotingResult, RESULT_CONFIRMATION_PENDING } from '$models/voting';
	import { run } from 'svelte/legacy';
	import { twMerge } from 'tailwind-merge';

	let tagColor = $state('bg-purple-70 text-text-04');
	let label = $state('');

	interface Props {
		result: DefaultVotingResult | string | null;
		isLarge?: boolean;
		class?: string;
	}

	let { result, isLarge = false, class: className = '' }: Props = $props();

	let tagText = $derived(isLarge ? 'heading-compact-02' : 'label-01');
	let tagContainer = $derived(isLarge ? 'px-2 py-[5px] rounded-3xl' : 'px-2 py-1 rounded-3xl');
	run(() => {
		switch (result) {
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
				label = result ?? RESULT_CONFIRMATION_PENDING;
				break;
		}
	});
</script>

<div class={twMerge('w-fit whitespace-nowrap', tagColor, className, tagText, tagContainer)}>
	{label}
</div>
