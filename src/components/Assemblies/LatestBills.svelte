<script lang="ts">
	import BillStatusTag from '$components/BillStatusTag/BillStatusTag.svelte';
	import { formatThaiDate } from '$lib/date';
	import type { BillSummary } from '../../routes/assemblies/[id]/+page.server';
	import { DataTable } from 'carbon-components-svelte';

	interface Props {
		latestBills: BillSummary[];
	}

	let { latestBills }: Props = $props();

	let sortByProposedOn = $derived(
		latestBills.sort((a, b) => new Date(b.proposedOn).getTime() - new Date(a.proposedOn).getTime())
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
	{#snippet cell({ cell, row })}
		{#if cell.key === 'proposedOn'}
			<span class="text-gray-60">
				{formatThaiDate(cell.value, { shortMonth: true, shortYear: true })}
			</span>
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
	{/snippet}
</DataTable>
