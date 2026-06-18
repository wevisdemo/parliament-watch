<script lang="ts">
	import Footer from './Footer.svelte';
	import type { Hst as HstStory } from '@histoire/plugin-svelte';

	export let Hst: HstStory;
</script>

<Hst.Story title="Footer">
	<Footer />
</Hst.Story>
