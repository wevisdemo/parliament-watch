<script lang="ts">
	import '../../styles/carbon/pre-compiled.css';
	import '../../styles/index.css';
	import type { Hst } from '@histoire/plugin-svelte';
	import DownloadData from './DownloadData.svelte';
	export let Hst: Hst;

	let links = [{ label: 'ผลการลงมติรายคน', url: '/' }];
</script>

<Hst.Story title="DownloadData">
	<DownloadData {links} />
	<svelte:fragment slot="controls">
		<Hst.Json bind:value={links} title="links" />
	</svelte:fragment>
</Hst.Story>
