<script lang="ts">
	import { DataTable, Tag, Pagination, Button } from 'carbon-components-svelte';
	import type { VoteSummary } from '../../routes/assemblies/[id]/votes/+page';
	import { DefaultVotingResult } from '$models/voting';
	import DocumentPdf from 'carbon-icons-svelte/lib/DocumentPdf.svelte';
	import { Filter } from 'carbon-icons-svelte';

	export let votes: VoteSummary[] = [];
	export let showFilter = true;
	let page = 1;
	const pageSize = 10;

	interface TableRow {
		id: number;
		date: string;
		title: string;
		result: string;
		file: string;
	}

	const getTableRows = (votes: VoteSummary[]): TableRow[] => {
		const result: TableRow[] = votes.map((vote) => ({
			id: vote.id,
			date: convertToThatDate(vote.date),
			title: vote.title,
			result: vote.result,
			file: vote.files.length > 0 ? vote.files[0].url : ''
		}));
		if (result.length % pageSize !== 0 || result.length === 0) {
			const emptyRows = pageSize - (result.length % pageSize);
			for (let i = 0; i < emptyRows; i++) {
				result.push({
					id: 999 + i, // mock id
					date: '',
					title: '',
					result: '',
					file: ''
				});
			}
		}

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

<div class="w-full max-w-[1056px] relative">
	<div class="relative">
		{#if !showFilter}
			<button
				class="absolute left-[0px] bottom-[0px] p-[10px] z-50"
				on:click={() => {
					showFilter = true;
				}}
			>
				<Button icon={Filter} />
			</button>
		{/if}
		<DataTable
			zebra
			headers={[
				{ key: 'date', value: 'วันที่' },
				{ key: 'title', value: 'ชื่อมติ' },
				{ key: 'result', value: 'ผลลัพท์' },
				{ key: 'file', value: 'เอก สาร' }
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
					<!-- TODO: add link to vote page /assemblies/votes/{row.id} -->
					<a href="/votings/0" class="body-01 text-gray-100 underline">{cell.value}</a>
				{:else if cell.key === 'result'}
					{#if cell.value === DefaultVotingResult.Passed}
						<Tag type="teal">ผ่าน</Tag>
					{:else if cell.value === DefaultVotingResult.Failed}
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
	</div>
	<Pagination
		totalItems={votes.length}
		{pageSize}
		bind:page
		pageSizeInputDisabled
		itemRangeText={(min, max, total) => `${min} – ${max} จาก ${total} มติ`}
		pageRangeText={(_current, total) => `จาก ${total} หน้า`}
	/>
</div>
