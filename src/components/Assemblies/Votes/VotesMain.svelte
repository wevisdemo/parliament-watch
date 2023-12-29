<script lang="ts">
	import DataPage from '$components/DataPage/DataPage.svelte';
	import VotingResultTag from '$components/VotingResultTag/VotingResultTag.svelte';
	import { DefaultVotingResult } from '$models/voting.js';
	import DocumentPdf from 'carbon-icons-svelte/lib/DocumentPdf.svelte';
	import type {
		CheckboxFilterGroup,
		SelectedCheckboxValueType
	} from '$components/DataPage/DataPage.svelte';
	import type {
		AssemblySummary,
		FilterOptions,
		VoteSummary
	} from '../../../routes/assemblies/[id]/votes/+page.server';
	import VotesHeader from './VotesHeader.svelte';

	export let votes: VoteSummary[] = [];
	export let assembly: AssemblySummary;
	export let assemblyIds: string[];
	export let filterOptions: FilterOptions;

	const checkboxFilterList: CheckboxFilterGroup[] = [
		{
			key: 'filterResult',
			legend: 'ผลลัพท์',
			choices: [DefaultVotingResult.Passed, DefaultVotingResult.Failed].map((result) => ({
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

	const getVoteIdFromIndex = (index: number) => {
		return votes[index].id;
	};
</script>

<DataPage
	breadcrumbList={[]}
	{checkboxFilterList}
	{filteredData}
	tableHeader={[
		{ key: 'date', value: 'วันที่' },
		{ key: 'title', value: 'ชื่อมติ' },
		{ key: 'result', value: 'ผลลัพท์' },
		{ key: 'files', value: 'เอก สาร' }
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
			<a href="/votings/{getVoteIdFromIndex(row.id)}" class="body-01 text-gray-100 underline"
				>{cellValue}</a
			>
		{:else if cellKey === 'result'}
			<VotingResultTag class="m-0 whitespace-nowrap" isLarge result={cellValue} />
		{:else if cellKey === 'files'}
			{@const files = cellValue}
			{#if files.length > 0}
				{#each files as file (file)}
					<a href={file.url} download title={file.label}
						><DocumentPdf /><span class="sr-only">{file.label}</span></a
					>
				{/each}
			{:else}
				-
			{/if}
		{:else}
			{cellValue}
		{/if}
	</svelte:fragment>
</DataPage>
