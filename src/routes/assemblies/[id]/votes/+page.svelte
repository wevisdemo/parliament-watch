<script lang="ts">
	import DataPage from '$components/DataPage/DataPage.svelte';
	import VotingResultTag from '$components/VotingResultTag/VotingResultTag.svelte';
	import DocumentPdf from 'carbon-icons-svelte/lib/DocumentPdf.svelte';
	import type { SelectedCheckboxValueType } from '$components/DataPage/DataPage.svelte';
	import VotesHeader from '$components/Assemblies/Votes/VotesHeader.svelte';

	export let data;

	$: ({ availableAssemblies, assembly, votes, filterOptions } = data);

	$: checkboxFilterList = [
		{
			key: 'filterResult',
			legend: 'ผลลัพท์',
			choices: filterOptions.result.map((result) => ({
				label: result,
				value: result
			}))
		}
	];

	let searchQuery = '';
	let selectedCheckboxValue: SelectedCheckboxValueType;

	$: filteredData =
		selectedCheckboxValue === undefined ||
		Object.values(selectedCheckboxValue).some((e) => e.length === 0)
			? []
			: votes.filter((vote) => {
					const search = searchQuery.trim();
					if (search && !vote.nickname.includes(search)) return;
					const { filterResult } = selectedCheckboxValue;
					return filterResult.includes(vote.result);
				});
</script>

<DataPage
	breadcrumbList={[
		{ url: '/', label: 'หน้าหลัก' },
		{ label: 'นักการเมือง' },
		{ url: `/assemblies/${assembly.id}`, label: `${assembly.name} ชุดที่ ${assembly.term}` },
		{ label: 'ประวัติการลงมติ' }
	]}
	{checkboxFilterList}
	{filteredData}
	tableHeader={[
		{ key: 'date', value: 'วันที่' },
		{ key: 'title', value: 'ชื่อมติ' },
		{ key: 'result', value: 'ผลลัพท์' },
		{ key: 'files', value: 'เอกสาร' }
	]}
	downloadLinks={[
		{ label: 'ประวัติการลงมติ', url: `/files/download/assemblies/${assembly.id}-votings.csv` }
	]}
	bind:searchQuery
	bind:selectedCheckboxValue
>
	<VotesHeader {assembly} {availableAssemblies} />

	<svelte:fragment slot="table" let:cellKey let:cellValue let:row>
		{#if cellKey === 'date'}
			<span class="body-01 text-gray-60"
				>{cellValue.toLocaleDateString('th-TH', {
					day: 'numeric',
					month: 'short',
					year: '2-digit'
				})}</span
			>
		{:else if cellKey === 'title'}
			<a href="/votings/{row.id}" class="body-01 text-gray-100 underline">{cellValue}</a>
		{:else if cellKey === 'result'}
			<VotingResultTag class="m-0 whitespace-nowrap" result={cellValue} />
		{:else if cellKey === 'files'}
			{@const files = cellValue}
			{#if files.length > 0}
				<div class="flex flex-wrap gap-2">
					{#each files as file (file)}
						<a href={file.url} title={file.label} target="_blank" rel="noopener noreferrer"
							><DocumentPdf /><span class="sr-only">{file.label}</span></a
						>
					{/each}
				</div>
			{:else}
				-
			{/if}
		{:else}
			{cellValue}
		{/if}
	</svelte:fragment>
</DataPage>
