<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	import General from './GeneralIcon.svelte';
	import Law from './LawIcon.svelte';
	import MobileRotate from './MobileRotateIcon.svelte';
	import People from './PeopleIcon.svelte';
	import Politician from './PoliticianIcon.svelte';
	import Vote from './VoteIcon.svelte';

	export let Hst: Hst;

	let size = 16;
	let title = '';
</script>

<Hst.Story title="Icons" layout={{ type: 'grid' }}>
	<Hst.Variant title="GeneralIcon">
		<General {size} />
	</Hst.Variant>
	<Hst.Variant title="LawIcon">
		<Law {size} />
	</Hst.Variant>
	<Hst.Variant title="MobileRotateIcon">
		<MobileRotate {size} />
	</Hst.Variant>
	<Hst.Variant title="PeopleIcon">
		<People {size} />
	</Hst.Variant>
	<Hst.Variant title="PoliticianIcon">
		<Politician {size} />
	</Hst.Variant>
	<Hst.Variant title="VoteIcon">
		<Vote {size} />
	</Hst.Variant>

	<svelte:fragment slot="controls">
		<Hst.Number bind:value={size} title="Size" />
		<Hst.Text bind:value={title} title="Title" />
	</svelte:fragment>
</Hst.Story>
