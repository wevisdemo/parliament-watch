<script lang="ts">
	import '../../styles/carbon/pre-compiled.css';
	import '../../styles/index.css';
	import type { Hst } from '@histoire/plugin-svelte';
	import Share from './Share.svelte';
	export let Hst: Hst;

	let url = '';
	let label = 'แชร์';
</script>

<Hst.Story title="Share">
	<Share {url} {label} />
	<svelte:fragment slot="controls">
		<Hst.Text bind:value={url} title="URL" />
		<Hst.Text bind:value={label} title="Label" />
	</svelte:fragment>
</Hst.Story>
