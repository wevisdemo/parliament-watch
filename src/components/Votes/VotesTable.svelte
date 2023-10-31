<script lang="ts">
	import { DataTable, Tag, Pagination } from 'carbon-components-svelte';
	import type { VotingSummary } from '../../routes/assemblies/[id]/votes/+page';
	import { DefaultVotingResult } from '$models/voting';
	import DocumentPdf from 'carbon-icons-svelte/lib/DocumentPdf.svelte';

	export let votes: VotingSummary[] = [];
	let page = 1;
	const pageSize = 10;

	interface TableRow {
		id: number;
		date: string;
		title: string;
		result: string;
		file: string;
	}

	const getTableRows = (votes: VotingSummary[]): TableRow[] => {
		const result: TableRow[] = votes.map((vote) => ({
			id: vote.id,
			date: convertToThatDate(vote.date),
			title: vote.title,
			result: vote.result,
			file: vote.files.length > 0 ? vote.files[0].url : ''
		}));
		return result;
	};

	$: displayList = votes.slice((page - 1) * 10, page * 10);

	const convertToThatDate = (date: Date) =>
		new Date(date).toLocaleDateString('th-TH', {
			day: 'numeric',
			month: 'short',
			year: '2-digit'
		});
</script>

<div class="w-full max-w-[1056px]">
	<DataTable
		zebra
		headers={[
			{ key: 'date', value: 'วันที่' },
			{ key: 'title', value: 'ชื่อมติ' },
			{ key: 'result', value: 'ผลลัพท์' },
			{ key: 'file', value: 'เอกสาร' }
		]}
		rows={getTableRows(displayList)}
	>
		<svelte:fragment slot="cell-header" let:header>
			{#if header.key === 'port'}
				{header.value} (network)
			{:else}
				{header.value}
			{/if}
		</svelte:fragment>
		<svelte:fragment slot="cell" let:row let:cell>
			{#if cell.key === 'date'}
				<span class="body-01 text-gray-60">{cell.value}</span>
			{:else if cell.key === 'title'}
				<a href="/assemblies/votes/{row.id}" class="body-01 text-gray-100 underline">{cell.value}</a
				>
			{:else if cell.key === 'result'}
				{#if cell.value === DefaultVotingResult.Passed}
					<Tag type="teal">ผ่าน</Tag>
				{:else}
					<Tag type="red">ไม่ผ่าน</Tag>
				{/if}
			{:else if cell.key === 'file'}
				{#if cell.value !== ''}
					<a href={cell.value}>
						<DocumentPdf class="w-[20px] h-[20px]" />
					</a>
				{/if}
			{:else}
				{cell.value}
			{/if}
		</svelte:fragment>
	</DataTable>
	<Pagination
		totalItems={votes.length}
		{pageSize}
		bind:page
		pageSizeInputDisabled
		itemRangeText={(min, max, total) => `${min} – ${max} จาก ${total} มติ`}
		pageRangeText={(_current, total) => `จาก ${total} หน้า`}
	/>
</div>
