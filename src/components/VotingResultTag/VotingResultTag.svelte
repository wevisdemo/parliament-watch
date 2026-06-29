<script lang="ts">
	import { DefaultVotingResult, RESULT_CONFIRMATION_PENDING } from '$models/voting';
	import { twMerge } from 'tailwind-merge';

	interface Props {
		result: DefaultVotingResult | string | null;
		isLarge?: boolean;
		class?: string;
	}

	let { result, isLarge = false, class: className = '' }: Props = $props();

	let tagText = $derived(isLarge ? 'heading-compact-02' : 'label-01');
	let tagContainer = $derived(isLarge ? 'px-2 py-[5px] rounded-3xl' : 'px-2 py-1 rounded-3xl');

	let { tagColor, label } = $derived.by(() => {
		switch (result) {
			case DefaultVotingResult.Passed:
				return {
					tagColor: 'bg-teal-30 text-text-01',
					label: isLarge ? 'มติผ่าน' : DefaultVotingResult.Passed
				};
			case DefaultVotingResult.Failed:
				return {
					tagColor: 'bg-red-30 text-text-01',
					label: isLarge ? 'มติไม่ผ่าน' : DefaultVotingResult.Failed
				};
			default:
				return {
					tagColor: 'bg-purple-70 text-text-04',
					label: result ?? RESULT_CONFIRMATION_PENDING
				};
		}
	});
</script>

<div class={twMerge('w-fit whitespace-nowrap', tagColor, className, tagText, tagContainer)}>
	{label}
</div>
