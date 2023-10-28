<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	import VotingProcessImageCircle from './VotingProcessImageCircle.svelte';
	export let Hst: Hst;

	const icon = '/images/logo/pw-icon-white.png';
</script>

<Hst.Story title="VotingProcessImageCircle" layout={{ type: 'grid', width: 200 }}>
	<Hst.Variant title="No image source">
		<VotingProcessImageCircle title="title" description="description" />
	</Hst.Variant>
	<Hst.Variant title="With image source">
		<VotingProcessImageCircle
			title="title"
			description="description"
			src={icon}
			alt={'test alt text'}
		/>
	</Hst.Variant>
</Hst.Story>
