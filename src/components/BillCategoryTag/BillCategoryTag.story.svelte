<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	import BillCategoryTag from './BillCategoryTag.svelte';
	export let Hst: Hst;

	let isLarge = false;
</script>

<Hst.Story title="BillCategoryTag" layout={{ type: 'grid' }}>
	<Hst.Variant title="BillCategory">
		<BillCategoryTag {isLarge} />
	</Hst.Variant>
	<svelte:fragment slot="controls">
		<Hst.Checkbox title="isLarge" bind:value={isLarge} />
	</svelte:fragment>
</Hst.Story>
