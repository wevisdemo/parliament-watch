<script lang="ts">
	import NavigationBar from './NavigationBar.svelte';
	import type { Hst as HstStory } from '@histoire/plugin-svelte';

	export let Hst: HstStory;
</script>

<Hst.Story title="NavigationBar">
	<NavigationBar />
</Hst.Story>
