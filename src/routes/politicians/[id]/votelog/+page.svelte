<script lang="ts">
	import { page } from '$app/stores';
	import DataPage from '$components/DataPage/DataPage.svelte';
	import VotingOptionTag from '$components/politicians/VotingOptionTag.svelte';
	import VotingResultTag from '$components/politicians/VotingResultTag.svelte';
	import { DefaultVoteOption, type CustomVoteOption } from '$models/voting.js';
	import { InlineNotification } from 'carbon-components-svelte';
	import DocumentPdf from 'carbon-icons-svelte/lib/DocumentPdf.svelte';
	import { onMount } from 'svelte';
	import type { FilterGroup, SelectedFilterType } from '$components/DataPage/DataPage.svelte';

	export let data;
	const { politician, filterOptions, votings } = data;

	const generalVoteType = (voteOption: DefaultVoteOption | CustomVoteOption) =>
		typeof voteOption === 'string' ? (voteOption as string) : 'อื่นๆ';

	const formatThaiYear = (date: Date | undefined) => {
		if (!date) return;
		return date.toLocaleString('th-TH', { year: 'numeric' });
	};

	const filterList: FilterGroup[] = [
		{
			key: 'filterAssembly',
			legend: 'สมัยการทำงาน',
			choices: filterOptions.assemblies.map((assembly) => ({
				label: `${assembly.name}ชุดที่ ${assembly.term} (${formatThaiYear(assembly.startedAt)} - ${
					formatThaiYear(assembly?.endedAt) ?? 'ปัจจุบัน'
				})`,
				value: assembly.id
			}))
		},
		{
			key: 'filterVoteType',
			legend: 'ประเภทการลงมติ',
			choices: [
				DefaultVoteOption.Agreed,
				DefaultVoteOption.Disagreed,
				DefaultVoteOption.Novote,
				DefaultVoteOption.Abstain,
				DefaultVoteOption.Absent,
				'อื่นๆ'
			].map((type) => ({
				label: type,
				value: type
			}))
		},
		{
			key: 'filterVoteDirection',
			legend: 'เงื่อนไขพิเศษ',
			choices: [
				{
					label: 'ลงมติต่างจากเสียงส่วนใหญ่ในพรรค',
					value: false
				},
				{
					label: 'ลงมติเหมือนเสียงส่วนใหญ่ในพรรค',
					value: true
				}
			]
		},
		{
			key: 'filterCatg',
			legend: 'หมวดมติ (1 มติ มีได้มากกว่า 1 หมวด)',
			choices: filterOptions.categories.map((catg) => ({
				label: catg,
				value: catg
			}))
		}
	];

	let searchQuery = '';
	let isFilterAllFalse: boolean;
	let selectedFilter: SelectedFilterType;

	$: filteredData =
		selectedFilter === undefined || isFilterAllFalse
			? []
			: votings.filter((votingDataEntry) => {
					const search = searchQuery.trim();
					if (search && !votingDataEntry.title.includes(search)) return;
					const { filterAssembly, filterVoteType, filterVoteDirection, filterCatg } =
						selectedFilter;
					return (
						filterAssembly.some((assemblyId) =>
							votingDataEntry.participatedAssembleIds.includes(assemblyId as string)
						) &&
						filterVoteType.includes(generalVoteType(votingDataEntry.voteOption)) &&
						filterVoteDirection.includes(votingDataEntry.isVoteAlignWithPartyMajority) &&
						filterCatg.includes(votingDataEntry.category)
					);
			  });

	onMount(() => {
		switch ($page.url.searchParams.get('votetype')) {
			case 'agreed':
				selectedFilter.filterVoteType = [DefaultVoteOption.Agreed];
				break;
			case 'disagreed':
				selectedFilter.filterVoteType = [DefaultVoteOption.Disagreed];
				break;
			case 'absent':
				selectedFilter.filterVoteType = [DefaultVoteOption.Absent];
				break;
		}
	});
</script>

<DataPage
	breadcrumbList={[
		{ url: '/', label: 'หน้าหลัก' },
		{ url: `/politicians/${politician.id}`, label: politician.firstname },
		{ url: `/politicians/${politician.id}/votelog`, label: 'ประวัติการลงมติ' }
	]}
	{filterList}
	{filteredData}
	tableHeader={[
		{ key: 'date', value: 'วันที่' },
		{ key: 'title', value: 'ชื่อมติ' },
		{ key: 'voteOption', value: 'การลงมติ' },
		{ key: 'result', value: 'ผลลัพธ์' },
		{ key: 'files', value: 'เอกสาร' }
	]}
	bind:searchQuery
	bind:selectedFilter
	bind:isFilterAllFalse
>
	<p class="heading-01">ประวัติการลงมติ</p>
	<h1 class="fluid-heading-03 mb-1">
		<a class="no-underline text-black hover:text-blue-70" href="/politicians/{politician.id}"
			>{politician.prefix} {politician.firstname} {politician.lastname}</a
		>
	</h1>
	<InlineNotification
		class="m-0 min-w-0 max-w-none"
		lowContrast
		kind="info"
		subtitle="การประเมินพฤติกรรมการลงมติ จะพิจารณาเพียงชื่อมติไม่ได้ ควรศึกษาเนื้อหาของมตินั้นๆ ประกอบด้วย"
	/>
	<svelte:fragment slot="table" let:cellKey let:cellValue>
		{#if cellKey === 'date'}
			{cellValue.toLocaleDateString('th-TH', {
				day: 'numeric',
				month: 'short',
				year: '2-digit'
			})}
		{:else if cellKey === 'title'}
			<!-- TODO: Add link -->
			<a class="text-text-01" href="/">{cellValue}</a>
		{:else if cellKey === 'result'}
			<VotingResultTag class="m-0 whitespace-nowrap" result={cellValue} />
		{:else if cellKey === 'voteOption'}
			<VotingOptionTag voteOption={cellValue} />
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
