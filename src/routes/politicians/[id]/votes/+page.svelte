<script lang="ts">
	import { page } from '$app/stores';
	import DataPage from '$components/DataPage/DataPage.svelte';
	import VotingResultTag from '$components/VotingResultTag/VotingResultTag.svelte';
	import VotingOptionTag from '$components/VotingOptionTag/VotingOptionTag.svelte';
	import { DefaultVoteOption, type CustomVoteOption } from '$models/voting.js';
	import { InlineNotification } from 'carbon-components-svelte';
	import DocumentPdf from 'carbon-icons-svelte/lib/DocumentPdf.svelte';
	import { onMount } from 'svelte';
	import type {
		CheckboxFilterGroup,
		SelectedCheckboxValueType
	} from '$components/DataPage/DataPage.svelte';

	export let data;
	const { politician, filterOptions, votes } = data;

	const generalVoteType = (voteOption: DefaultVoteOption | CustomVoteOption) =>
		typeof voteOption === 'string' ? (voteOption as string) : 'อื่นๆ';

	const formatThaiYear = (date: Date | undefined) => {
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
	let selectedCheckboxValue: SelectedCheckboxValueType;

	$: filteredData =
		selectedCheckboxValue === undefined ||
		Object.values(selectedCheckboxValue).some((e) => e.length === 0)
			? []
			: votes.filter((vote) => {
					const search = searchQuery.trim();
					if (search && !vote.title.includes(search)) return;
					const { filterAssembly, filterVoteType, filterVoteDirection, filterCatg } =
						selectedCheckboxValue;
					return (
						filterAssembly.some((assemblyId) =>
							vote.participatedAssembleIds.includes(assemblyId as string)
						) &&
						filterVoteType.includes(generalVoteType(vote.voteOption)) &&
						filterVoteDirection.includes(vote.isVoteAlignWithPartyMajority) &&
						filterCatg.some((category) => vote.categories.includes(String(category)))
					);
			  });

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

<svelte:head>
	<title>ประวัติการลงมติ {politician.firstname} {politician.lastname} - Parliament Watch</title>
</svelte:head>

<DataPage
	breadcrumbList={[
		{ url: '/', label: 'หน้าหลัก' },
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
		{ key: 'title', value: 'ชื่อมติ' },
		{ key: 'voteOption', value: 'การลงมติ' },
		{ key: 'result', value: 'ผลลัพธ์' },
		{ key: 'files', value: 'เอก สาร' }
	]}
	bind:searchQuery
	bind:selectedCheckboxValue
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
			<a class="text-text-01 hover:underline hover:text-interactive-01" href="/">{cellValue}</a>
		{:else if cellKey === 'result'}
			<VotingResultTag class="m-0 whitespace-nowrap" isLarge result={cellValue} />
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
