<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	import BillCategoryTag from './BillCategoryTag.svelte';
	export let Hst: Hst;

	let label = 'ขนส่งสาธารณะ';
	let isLarge = false;
</script>

<Hst.Story title="BillCategoryTag">
	<BillCategoryTag {isLarge} {label} />
	<svelte:fragment slot="controls">
		<Hst.Text title="Label" bind:value={label} />
		<Hst.Checkbox title="isLarge" bind:value={isLarge} />
	</svelte:fragment>
</Hst.Story>
