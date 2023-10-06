<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	import BackToTopButton from './BackToTopButton.svelte';
	export let Hst: Hst;
</script>

<Hst.Story title="BackToTopButton">
	<BackToTopButton />
</Hst.Story>
