<script lang="ts">
	import { page } from '$app/stores';
	import DataPage from '$components/DataPage/DataPage.svelte';
	import VotingResultTag from '$components/VotingResultTag/VotingResultTag.svelte';
	import VotingOptionTag from '$components/VotingOptionTag/VotingOptionTag.svelte';
	import { DefaultVoteOption } from '$models/voting.js';
	import { InlineNotification } from 'carbon-components-svelte';
	import DocumentPdf from 'carbon-icons-svelte/lib/DocumentPdf.svelte';
	import { onMount } from 'svelte';
	import type {
		CheckboxFilterGroup,
		SelectedCheckboxValueType
	} from '$components/DataPage/DataPage.svelte';

	export let data;
	const { politician, filterOptions, votes } = data;

	const formatThaiYear = (date?: Date) => {
		if (!date) return;
		return date.toLocaleString('th-TH', { year: 'numeric' });
	};

	const checkboxFilterList: CheckboxFilterGroup[] = [
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
			choices: filterOptions.voteOptions.map((type) => ({
				label: type,
				value: type
			}))
		}
		// TODO: not implemented vote direction yet
		// {
		// 	key: 'filterVoteDirection',
		// 	legend: 'เงื่อนไขพิเศษ',
		// 	choices: [
		// 		{
		// 			label: 'ลงมติต่างจากเสียงส่วนใหญ่ในพรรค',
		// 			value: false
		// 		},
		// 		{
		// 			label: 'ลงมติเหมือนเสียงส่วนใหญ่ในพรรค',
		// 			value: true
		// 		}
		// 	]
		// },
	];

	let searchQuery = '';
	let selectedCheckboxValue: SelectedCheckboxValueType;

	$: filteredData =
		selectedCheckboxValue === undefined ||
		Object.values(selectedCheckboxValue).some((e) => e.length === 0)
			? []
			: votes
					.filter((vote) => {
						const search = searchQuery.trim();
						if (search && !vote.nickname.includes(search)) return;
						const {
							filterAssembly,
							filterVoteType,
							filterCatg
						} = //filterVoteDirection
							selectedCheckboxValue;
						return (
							filterAssembly.some((assemblyId) =>
								vote.participatedAssemblies.some(({ id }) => id === assemblyId)
							) && filterVoteType.includes(vote.voteOption)
							// filterVoteDirection.includes(vote.isVoteAlignWithPartyMajority)
						);
					})
					.map((vote, index) => ({
						id: `vote-${index}`,
						date: vote.date,
						titleColumn: {
							id: vote.id,
							title: vote.nickname
						},
						voteOption: vote.voteOption,
						result: vote.result,
						files: vote.files
					}));

	onMount(() => {
		switch ($page.url.searchParams.get('votetype')) {
			case 'agreed':
				selectedCheckboxValue.filterVoteType = [DefaultVoteOption.Agreed];
				break;
			case 'disagreed':
				selectedCheckboxValue.filterVoteType = [DefaultVoteOption.Disagreed];
				break;
			case 'absent':
				selectedCheckboxValue.filterVoteType = [DefaultVoteOption.Absent];
				break;
		}
	});
</script>

<DataPage
	breadcrumbList={[
		{ url: '/', label: 'หน้าหลัก' },
		{ label: 'นักการเมือง' },
		{
			url: `/politicians/${politician.id}`,
			label: `${politician.firstname} ${politician.lastname}`
		},
		{ url: `/politicians/${politician.id}/votes`, label: 'ประวัติการลงมติ' }
	]}
	{checkboxFilterList}
	{filteredData}
	tableHeader={[
		{ key: 'date', value: 'วันที่' },
		{ key: 'titleColumn', value: 'ชื่อมติ' },
		{ key: 'voteOption', value: 'การลงมติ' },
		{ key: 'result', value: 'ผลลัพธ์' },
		{ key: 'files', value: 'เอกสาร' }
	]}
	downloadLinks={[
		{ label: 'ผลการลงมติรายคน', url: `/files/download/politicians/${politician.id}-votes.csv` }
	]}
	bind:searchQuery
	bind:selectedCheckboxValue
>
	<p class="heading-01">ประวัติการลงมติ</p>
	<h1 class="fluid-heading-03 mb-1">
		<a class="text-text-01 no-underline hover:text-blue-70" href="/politicians/{politician.id}"
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
		{:else if cellKey === 'titleColumn'}
			<a
				class="text-text-01 hover:text-interactive-01 hover:underline"
				href="/votings/{cellValue.id}">{cellValue.title}</a
			>
		{:else if cellKey === 'voteOption'}
			<VotingOptionTag voteOption={cellValue} />
		{:else if cellKey === 'result'}
			<VotingResultTag class="m-0 whitespace-nowrap" result={cellValue} />
		{:else if cellKey === 'files'}
			{@const files = cellValue}
			{#if files.length > 0}
				<div class="flex flex-wrap gap-2">
					{#each files as file (file)}
						<a href={file.url} target="_blank" rel="noopener noreferrer" title={file.label}
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
