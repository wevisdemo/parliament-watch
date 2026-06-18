<script lang="ts">
	import Share from './Share.svelte';
	import type { Hst as HstStory } from '@histoire/plugin-svelte';

	export let Hst: HstStory;

	let url = '';
	let label = 'แชร์';
</script>

<Hst.Story title="Share">
	<div class="body-02 font-sans">
		<Share {url} {label} />
	</div>

	<svelte:fragment slot="controls">
		<Hst.Text bind:value={url} title="URL" />
		<Hst.Text bind:value={label} title="Label" />
	</svelte:fragment>
</Hst.Story>
