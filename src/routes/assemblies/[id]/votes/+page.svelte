<script lang="ts">
	import DataPage from '$components/DataPage/DataPage.svelte';
	import VotingResultTag from '$components/VotingResultTag/VotingResultTag.svelte';
	import DocumentPdf from 'carbon-icons-svelte/lib/DocumentPdf.svelte';
	import type { SelectedCheckboxValueType } from '$components/DataPage/DataPage.svelte';
	import VotesHeader from '$components/Assemblies/Votes/VotesHeader.svelte';

	export let data;

	$: ({ assemblyIds, assembly, votes, filterOptions } = data);

	$: checkboxFilterList = [
		{
			key: 'filterResult',
			legend: 'ผลลัพท์',
			choices: filterOptions.result.map((result) => ({
				label: result,
				value: result
			}))
		},
		{
			key: 'filterCategory',
			legend: 'หมวดมติ',
			choices: filterOptions.categories.map((type) => ({
				label: type,
				value: type
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
					if (search && !vote.title.includes(search)) return;
					const { filterResult, filterCategory } = selectedCheckboxValue;
					return (
						filterResult.includes(vote.result) &&
						filterCategory.some((category) => vote.categories.includes(String(category)))
					);
				});
</script>

<DataPage
	breadcrumbList={[
		{ url: '/', label: 'หน้าหลัก' },
		{ label: 'รัฐสภา' },
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
	<VotesHeader {assembly} {assemblyIds} />

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
						<a href={file.url} download title={file.label}
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
