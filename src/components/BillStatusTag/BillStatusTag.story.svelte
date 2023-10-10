<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	import BillStatusTag from './BillStatusTag.svelte';
	export let Hst: Hst;
</script>

<Hst.Story title="BillStatusTag">
	<BillStatusTag />
</Hst.Story>
