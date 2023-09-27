<script lang="ts">
	import { DefaultVoteOption, type CustomVoteOption } from '$models/voting';
	import { Tag } from 'carbon-components-svelte';
	import type { TagProps } from 'carbon-components-svelte/types/Tag/Tag.svelte';

	export let voteOption: DefaultVoteOption | CustomVoteOption;

	let className = '';
	export { className as class };

	let tagColor: TagProps['type'];
	let label: string;

	// FIXME: Consult Designer Tag Color
	if (typeof voteOption === 'string') {
		switch (voteOption as DefaultVoteOption) {
			case DefaultVoteOption.Agreed:
				label = DefaultVoteOption.Agreed;
				tagColor = 'teal';
				break;
			case DefaultVoteOption.Disagreed:
				label = DefaultVoteOption.Disagreed;
				tagColor = 'red';
				break;
			case DefaultVoteOption.Novote:
				label = DefaultVoteOption.Novote;
				tagColor = 'high-contrast';
				break;
			case DefaultVoteOption.Abstain:
				label = DefaultVoteOption.Abstain;
				tagColor = 'gray';
				break;
			case DefaultVoteOption.Absent:
				label = DefaultVoteOption.Absent;
				tagColor = 'outline';
				break;
		}
	} else {
		// TODO: shade the purple
		tagColor = 'purple';
		label = voteOption?.label ?? 'WOT';
	}
</script>

<Tag class="m-0 whitespace-nowrap {className}" type={tagColor}>{label}</Tag>
