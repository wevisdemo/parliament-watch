<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	import NavigationBar from './NavigationBar.svelte';

	export let Hst: Hst;
</script>

<Hst.Story title="NavigationBar">
	<NavigationBar />
</Hst.Story>
