<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	import DownloadData from './DownloadData.svelte';
	export let Hst: Hst;

	let links = [{ label: 'ผลการลงมติรายคน', url: '/' }];
</script>

<Hst.Story title="DownloadData">
	<div class="body-02 font-sans">
		<DownloadData {links} />
	</div>

	<svelte:fragment slot="controls">
		<Hst.Json bind:value={links} title="links" />
	</svelte:fragment>
</Hst.Story>
