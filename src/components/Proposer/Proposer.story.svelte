<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	import Proposer from './Proposer.svelte';
	export let Hst: Hst;
</script>

<Hst.Story title="Proposer">
	<Proposer />
</Hst.Story>
