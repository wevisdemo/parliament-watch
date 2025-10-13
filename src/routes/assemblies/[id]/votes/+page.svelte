<script lang="ts">
	import DataPage from '$components/DataPage/DataPage.svelte';
	import VotingResultTag from '$components/VotingResultTag/VotingResultTag.svelte';
	import DocumentPdf from 'carbon-icons-svelte/lib/DocumentPdf.svelte';
	import type { SelectedCheckboxValueType } from '$components/DataPage/DataPage.svelte';
	import VotesHeader from '$components/Assemblies/Votes/VotesHeader.svelte';
	import { NotebookReference } from 'carbon-icons-svelte';

	export let data;

	$: ({ availableAssemblies, assembly, voteEvents, filterOptions } = data);

	$: checkboxFilterList = [
		{
			key: 'filterResult',
			legend: 'ผลลัพธ์',
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
			: voteEvents
					.filter(({ nickname, title, result }) => {
						const search = searchQuery.trim();
						if (search && !title.includes(search) && !(nickname && nickname.includes(search)))
							return false;
						return selectedCheckboxValue.filterResult.includes(result ?? '');
					})
					.map(({ start_date, nickname, title, ...rest }) => ({
						date: start_date,
						name: nickname || title,
						...rest
					}));
</script>

<DataPage
	tablePageSize={50}
	breadcrumbList={[
		{ url: '/', label: 'หน้าหลัก' },
		{ label: 'นักการเมือง' },
		{ url: `/assemblies/${assembly.id}`, label: assembly.name },
		{ label: 'ประวัติการลงมติ' }
	]}
	{checkboxFilterList}
	{filteredData}
	tableHeader={[
		{ key: 'date', value: 'วันที่' },
		{ key: 'name', value: 'ชื่อมติ' },
		{ key: 'result', value: 'ผลลัพธ์' },
		{ key: 'links', value: 'ลิงก์' }
	]}
	downloadLinks={[
		{ label: 'ประวัติการลงมติ', url: `/files/download/assemblies/${assembly.id}-votings.csv` }
	]}
	bind:searchQuery
	bind:selectedCheckboxValue
>
	<VotesHeader
		name={assembly.name}
		term={assembly.term ?? 0}
		startedYear={assembly.founding_date ? new Date(assembly.founding_date) : new Date()}
		{availableAssemblies}
	/>

	<svelte:fragment slot="table" let:cellKey let:cellValue let:row>
		{#if cellKey === 'date'}
			<span class="body-01 text-gray-60"
				>{new Date(cellValue).toLocaleDateString('th-TH', {
					day: 'numeric',
					month: 'short',
					year: '2-digit'
				})}</span
			>
		{:else if cellKey === 'name'}
			<a href="/votings/{row.id}" class="body-01 text-gray-100 underline">{cellValue}</a>
		{:else if cellKey === 'result'}
			<VotingResultTag class="m-0 whitespace-nowrap" result={cellValue} />
		{:else if cellKey === 'links'}
			{#if cellValue.length > 0}
				<div class="flex flex-row gap-2">
					{#each cellValue as { note, url } (note)}
						<a href={url} target="_blank" rel="noopener noreferrer" title={note}
							><svelte:component this={url.includes('.pdf') ? DocumentPdf : NotebookReference}
							></svelte:component><span class="sr-only">{note}</span></a
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
