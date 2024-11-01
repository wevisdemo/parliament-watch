<script lang="ts">
	import BillStatusTag from '$components/BillStatusTag/BillStatusTag.svelte';
	import { DataTable } from 'carbon-components-svelte';
	import type { BillSummary } from '../../routes/assemblies/[id]/+page.server';
	export let latestBills: BillSummary[];

	$: sortByProposedOn = latestBills.sort(
		(a, b) => new Date(b.proposedOn).getTime() - new Date(a.proposedOn).getTime()
	);
</script>

<DataTable
	headers={[
		{ key: 'proposedOn', value: 'วันที่เสนอ' },
		{ key: 'nickname', value: 'ชื่อร่าง' },
		{ key: 'status', value: 'สถานะ' }
	]}
	rows={sortByProposedOn}
>
	<svelte:fragment slot="cell" let:cell let:row>
		{#if cell.key === 'proposedOn'}
			<span class="text-gray-60"
				>{new Date(cell.value).toLocaleString('th-TH', {
					day: 'numeric',
					month: 'short',
					year: '2-digit'
				})}</span
			>
		{:else if cell.key === 'nickname'}
			<a
				href="/bills/{row.id}"
				class="body-01 row-hover font-sans text-text-primary underline hover:text-interactive-01"
				>{cell.value}</a
			>
		{:else if cell.key === 'status'}
			<BillStatusTag status={cell.value} />
		{:else}
			{cell.value}
		{/if}
	</svelte:fragment>
</DataTable>
