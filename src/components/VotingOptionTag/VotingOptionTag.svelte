<script lang="ts">
	import { DefaultVoteOption, type CustomVoteOption } from '$models/voting';
	import { Tag } from 'carbon-components-svelte';
	import { twMerge } from 'tailwind-merge';

	interface Props {
		voteOption: DefaultVoteOption | CustomVoteOption;
		class?: string;
	}

	let { voteOption, class: className = '' }: Props = $props();

	let { tagColorClass, tagBgOpacity, label } = $derived.by(() => {
		switch (voteOption) {
			case DefaultVoteOption.Agreed:
				return { tagColorClass: 'bg-teal-50', tagBgOpacity: 1, label: DefaultVoteOption.Agreed };
			case DefaultVoteOption.Disagreed:
				return {
					tagColorClass: 'bg-red-50 text-white',
					tagBgOpacity: 1,
					label: DefaultVoteOption.Disagreed
				};
			case DefaultVoteOption.Abstain:
				return {
					tagColorClass: 'bg-gray-80 text-white',
					tagBgOpacity: 1,
					label: DefaultVoteOption.Abstain
				};
			case DefaultVoteOption.Novote:
				return {
					tagColorClass: 'bg-gray-50 text-white',
					tagBgOpacity: 1,
					label: DefaultVoteOption.Novote
				};
			case DefaultVoteOption.Absent:
				return { tagColorClass: 'bg-gray-20', tagBgOpacity: 1, label: DefaultVoteOption.Absent };
			default: {
				const opacity = voteOption?.colorIntensity ? voteOption.colorIntensity * 0.7 + 0.3 : 1;
				const colorClass = opacity > 0.45 ? 'bg-purple-70 text-white' : 'bg-purple-70';
				return { tagColorClass: colorClass, tagBgOpacity: opacity, label: voteOption?.label ?? '' };
			}
		}
	});
</script>

<Tag
	class={twMerge('m-0 whitespace-nowrap', tagColorClass, className)}
	style="--tw-bg-opacity:{tagBgOpacity}">{label}</Tag
>
