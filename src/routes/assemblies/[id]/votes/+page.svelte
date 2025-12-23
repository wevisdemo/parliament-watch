<script lang="ts">
	import DataPage from '$components/DataPage/DataPage.svelte';
	import VotingResultTag from '$components/VotingResultTag/VotingResultTag.svelte';
	import type { SelectedCheckboxValueType } from '$components/DataPage/DataPage.svelte';
	import VotesHeader from '$components/Assemblies/Votes/VotesHeader.svelte';
	import LinksCell from '$components/DataPage/LinksCell.svelte';
	import { formatThaiDate } from '$lib/date.js';

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
	<VotesHeader name={assembly.name} id={assembly.id} {availableAssemblies} />

	<svelte:fragment slot="table" let:cellKey let:cellValue let:row>
		{#if cellKey === 'date'}
			<span class="body-01 text-gray-60">
				{formatThaiDate(cellValue, { shortMonth: true, shortYear: true })}
			</span>
		{:else if cellKey === 'name'}
			<a href="/votings/{row.id}" class="body-01 text-gray-100 underline">{cellValue}</a>
		{:else if cellKey === 'result'}
			<VotingResultTag class="m-0 whitespace-nowrap" result={cellValue} />
		{:else if cellKey === 'links'}
			<LinksCell {cellValue} />
		{:else}
			{cellValue}
		{/if}
	</svelte:fragment>
</DataPage>
