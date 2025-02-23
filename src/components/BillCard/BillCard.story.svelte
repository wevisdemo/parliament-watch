<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	import BillCard from './BillCard.svelte';
	import { inProgressBill } from '../../mocks/data/bill';

	export let Hst: Hst;

	let currentState = 'สส.พิจารณา วาระ 2';
	let daySinceProposed = 210;
	let isFullWidth = false;
</script>

<Hst.Story
	title="BillCard"
	layout={{
		type: 'grid',
		width: '1056'
	}}
>
	<Hst.Variant title="BillCard.Landscape">
		<BillCard
			bill={inProgressBill}
			{...inProgressBill}
			{currentState}
			{daySinceProposed}
			{isFullWidth}
		/>
	</Hst.Variant>

	<Hst.Variant title="BillCard.Portrait">
		<BillCard
			orientation="portrait"
			bill={inProgressBill}
			{...inProgressBill}
			{currentState}
			{daySinceProposed}
			{isFullWidth}
		/>
	</Hst.Variant>

	<svelte:fragment slot="controls">
		<Hst.Text bind:value={currentState} title="currentState:" />
		<Hst.Number bind:value={daySinceProposed} title="daySinceProposed:" />
		<Hst.Checkbox bind:value={isFullWidth} title="isFullWidth" />
	</svelte:fragment>
</Hst.Story>
