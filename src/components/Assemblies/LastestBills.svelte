<script lang="ts">
	import BillStatusTag from '$components/BillStatusTag/BillStatusTag.svelte';
	import { DataTable } from 'carbon-components-svelte';
	export let latestBills;

	$: sortByProposedOn = latestBills.sort(
		(a: { proposedOn: string | number | Date }, b: { proposedOn: string | number | Date }) =>
			new Date(a.proposedOn).getTime() - new Date(b.proposedOn).getTime()
	);
</script>

<!-- svelte-ignore a11y-invalid-attribute -->
<DataTable
	headers={[
		{ key: 'proposedOn', value: 'วันที่เสนอ' },
		{ key: 'nickname', value: 'ชื่อร่าง' },
		{ key: 'status', value: 'สถานะ' }
	]}
	rows={sortByProposedOn}
>
	<svelte:fragment slot="cell" let:cell>
		{#if cell.key === 'proposedOn'}
			{new Date(cell.value).toLocaleString('th-TH', {
				day: 'numeric',
				month: 'short',
				year: '2-digit'
			})}
		{:else if cell.key === 'nickname'}
			<a href="#" class="body-01 font-sans text-text-primary underline hover:text-interactive-01"
				>{cell.value}</a
			>
		{:else if cell.key === 'status'}
			<BillStatusTag status={cell.value} />
		{:else}
			{cell.value}
		{/if}
	</svelte:fragment>
</DataTable>
