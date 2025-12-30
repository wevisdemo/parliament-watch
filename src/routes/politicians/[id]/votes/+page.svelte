<script lang="ts">
	import { page } from '$app/stores';
	import DataPage from '$components/DataPage/DataPage.svelte';
	import VotingResultTag from '$components/VotingResultTag/VotingResultTag.svelte';
	import VotingOptionTag from '$components/VotingOptionTag/VotingOptionTag.svelte';
	import { DefaultVoteOption } from '$models/voting.js';
	import { InlineNotification } from 'carbon-components-svelte';
	import { onMount } from 'svelte';
	import type {
		CheckboxFilterGroup,
		SelectedCheckboxValueType
	} from '$components/DataPage/DataPage.svelte';
	import LinksCell from '$components/DataPage/LinksCell.svelte';
	import { formatYearRange } from '$lib/date.js';

	export let data;
	const { politician, filterOptions, votes } = data;

	const checkboxFilterList: CheckboxFilterGroup[] = [
		{
			key: 'filterAssembly',
			legend: 'สมัยการทำงาน',
			choices: filterOptions.assemblies.map((assembly) => ({
				label: `${assembly.name} (${formatYearRange(assembly.founding_date, assembly.dissolution_date, { shortMonth: true })})`,
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
	];

	let searchQuery = '';
	let selectedCheckboxValue: SelectedCheckboxValueType;

	$: filteredData =
		selectedCheckboxValue === undefined ||
		Object.values(selectedCheckboxValue).some((e) => e.length === 0)
			? []
			: votes
					.filter(({ option, vote_events: [{ title, nickname, organizations }] }) => {
						const search = searchQuery.trim();
						if (search && !title.includes(search) && !(nickname && nickname.includes(search))) {
							return false;
						}

						return (
							selectedCheckboxValue.filterAssembly.some((assemblyId) =>
								organizations.some(({ id }) => id === assemblyId)
							) && selectedCheckboxValue.filterVoteType.includes(option)
						);
					})
					.map(({ option, vote_events: [{ id, start_date, title, nickname, result, links }] }) => ({
						id,
						date: start_date,
						name: nickname || title,
						option,
						result,
						links
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
			label: politician.name
		},
		{ url: `/politicians/${politician.id}/votes`, label: 'ประวัติการลงมติ' }
	]}
	{checkboxFilterList}
	{filteredData}
	tableHeader={[
		{ key: 'date', value: 'วันที่' },
		{ key: 'name', value: 'ชื่อมติ' },
		{ key: 'option', value: 'การลงมติ' },
		{ key: 'result', value: 'ผลลัพธ์' },
		{ key: 'links', value: 'ลิงก์' }
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
			>{politician.prefix} {politician.name}</a
		>
	</h1>
	<InlineNotification
		class="m-0 min-w-0 max-w-none"
		lowContrast
		kind="info"
		subtitle="การประเมินพฤติกรรมการลงมติ จะพิจารณาเพียงชื่อมติไม่ได้ ควรศึกษาเนื้อหาของมตินั้นๆ ประกอบด้วย"
	/>
	<svelte:fragment slot="table" let:cellKey let:cellValue let:row>
		{#if cellKey === 'date'}
			{new Date(cellValue).toLocaleDateString('th-TH', {
				day: 'numeric',
				month: 'short',
				year: '2-digit'
			})}
		{:else if cellKey === 'name'}
			<a class="text-text-01 hover:text-interactive-01 hover:underline" href="/votings/{row.id}"
				>{cellValue}</a
			>
		{:else if cellKey === 'option'}
			<VotingOptionTag voteOption={cellValue} />
		{:else if cellKey === 'result'}
			<VotingResultTag class="m-0 whitespace-nowrap" result={cellValue} />
		{:else if cellKey === 'links'}
			<LinksCell {cellValue} />
		{:else}
			{cellValue}
		{/if}
	</svelte:fragment>
</DataPage>
