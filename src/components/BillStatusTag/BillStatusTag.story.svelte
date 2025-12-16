<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	import BillStatusTag from './BillStatusTag.svelte';
	export let Hst: Hst;

	let isLarge = false;
</script>

<Hst.Story
	title="BillStatusTag"
	layout={{
		type: 'grid'
	}}
>
	<Hst.Variant title="IN_PROGRESS">
		<BillStatusTag {isLarge} status="IN_PROGRESS" />
	</Hst.Variant>
	<Hst.Variant title="ENACTED">
		<BillStatusTag {isLarge} status="ENACTED" />
	</Hst.Variant>
	<Hst.Variant title="REJECTED">
		<BillStatusTag {isLarge} status="REJECTED" />
	</Hst.Variant>
	<Hst.Variant title="MERGED">
		<BillStatusTag {isLarge} status="MERGED" />
	</Hst.Variant>
	<svelte:fragment slot="controls">
		<Hst.Checkbox title="isLarge" bind:value={isLarge} />
	</svelte:fragment>
</Hst.Story>
