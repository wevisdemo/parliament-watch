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
	<Hst.Variant title="BillStatus.InProgress">
		<BillStatusTag {isLarge} status={BillStatus.InProgress} />
	</Hst.Variant>
	<Hst.Variant title="BillStatus.Enacted">
		<BillStatusTag {isLarge} status={BillStatus.Enacted} />
	</Hst.Variant>
	<Hst.Variant title="BillStatus.Rejected">
		<BillStatusTag {isLarge} status={BillStatus.Rejected} />
	</Hst.Variant>
	<Hst.Variant title="BillStatus.Merged">
		<BillStatusTag {isLarge} status={BillStatus.Merged} />
	</Hst.Variant>
	<svelte:fragment slot="controls">
		<Hst.Checkbox title="isLarge" bind:value={isLarge} />
	</svelte:fragment>
</Hst.Story>
