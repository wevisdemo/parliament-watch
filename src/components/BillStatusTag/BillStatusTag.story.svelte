<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	import BillStatusTag from './BillStatusTag.svelte';
	import { BillStatus } from '$models/bill';
	export let Hst: Hst;

	let isLarge = false;
</script>

<Hst.Story
	title="BillStatusTag"
	layout={{
		type: 'grid'
	}}
>
	<Hst.Variant title="In progress">
		<BillStatusTag {isLarge} status={BillStatus.InProgress} />
	</Hst.Variant>
	<Hst.Variant title="Success">
		<BillStatusTag {isLarge} status={BillStatus.Success} />
	</Hst.Variant>
	<Hst.Variant title="Rejected">
		<BillStatusTag {isLarge} status={BillStatus.Rejected} />
	</Hst.Variant>
	<Hst.Variant title="Merged">
		<BillStatusTag {isLarge} status={BillStatus.Merged} />
	</Hst.Variant>
	<svelte:fragment slot="controls">
		<Hst.Checkbox title="isLarge" bind:value={isLarge} />
	</svelte:fragment>
</Hst.Story>
