<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	import LinkTable from './LinkTable.svelte';
	export let Hst: Hst;

	let title = '';
	let links = [{ label: 'ผลการลงมติรายคน', url: '/' }];
</script>

<Hst.Story title="LinkTable">
	<div class="body-02 font-sans">
		<LinkTable {links} />
	</div>

	<svelte:fragment slot="controls">
		<Hst.Text bind:value={title} title="title" />
		<Hst.Json bind:value={links} title="links" />
	</svelte:fragment>
</Hst.Story>
