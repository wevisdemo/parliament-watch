<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	import BillCard from './BillCard.svelte';
	import { inProgressBill, enactedBill } from '../../mocks/data/bill';

	export let Hst: Hst;

	let orientation: 'landscape' | 'portrait' = 'portrait';
	let isFullWidth = false;
</script>

<Hst.Story title="BillCard">
	<Hst.Variant title="IN_PROGRESS">
		<BillCard {orientation} {...inProgressBill} {isFullWidth} />
	</Hst.Variant>

	<Hst.Variant title="ENACTED">
		<BillCard {orientation} {...enactedBill} {isFullWidth} />
	</Hst.Variant>

	<svelte:fragment slot="controls">
		<Hst.Select bind:value={orientation} title="orientation:" options={['landscape', 'portrait']} />
		<Hst.Checkbox bind:value={isFullWidth} title="isFullWidth" />
	</svelte:fragment>
</Hst.Story>
