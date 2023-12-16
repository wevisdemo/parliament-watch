<script lang="ts">
	import { DefaultVoteOption, type CustomVoteOption } from '$models/voting.js';
	import type {
		CheckboxFilterGroup,
		ComboboxFilterGroup,
		SelectedCheckboxValueType
	} from '$components/DataPage/DataPage.svelte';
	import DataPage from '$components/DataPage/DataPage.svelte';
	import VotingOptionTag from '$components/VotingOptionTag/VotingOptionTag.svelte';

	export let data;

	const { voting, filterOptions, votes } = data;

	let comboboxFilterList: ComboboxFilterGroup[] = [
		{
			key: 'filterComboboxType',
			legend: 'พรรคสังกัด ณ วันที่ลงมติ',
			placeholder: 'เลือกพรรค',
			choices: filterOptions.parties.map((type) => ({
				id: type,
				text: type
			}))
		}
	];

	const checkboxFilterList: CheckboxFilterGroup[] = [
		{
			key: 'filterPosition',
			legend: 'ตำแหน่ง',
			choices: filterOptions.positions.map((position) => ({
				label: position,
				value: position
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
		}
	];

	let searchQuery = '';
	let selectedCheckboxValue: SelectedCheckboxValueType;

	$: filteredData =
		selectedCheckboxValue === undefined ||
		Object.values(selectedCheckboxValue).some((e) => e.length === 0)
			? []
			: votes.slice(0, 2).filter((vote) => {
					const search = searchQuery.trim();
					if (search && !vote.id.includes(search)) return;
					const { filterPosition, filterVoteType } = selectedCheckboxValue;
					return (
						filterVoteType.includes(generalVoteType(vote.voteOption)) &&
						filterPosition.includes(vote.position)
					);
			  });

	const generalVoteType = (voteOption: DefaultVoteOption | CustomVoteOption | string) =>
		typeof voteOption === 'string' ? (voteOption as string) : 'อื่นๆ';
</script>

<DataPage
	breadcrumbList={[
		{ url: '#', label: 'หน้าหลัก' },
		{ url: `#`, label: 'การลงมติ' },
		{ url: `#`, label: voting.title },
		{ url: `#`, label: 'ผลการลงมติรายคน' }
	]}
	{comboboxFilterList}
	{checkboxFilterList}
	{filteredData}
	tableHeader={[
		{ key: 'id', value: 'ชื่อ-นามสกุล' },
		{ key: 'position', value: 'ตำแหน่ง' },
		{ key: 'party', value: 'สังกัดพรรค' },
		{ key: 'voteOption', value: 'การลงมติ' }
	]}
	donwloadSize="lg"
	bind:searchQuery
	bind:selectedCheckboxValue
>
	<div class="flex flex-col gap-1 md:flex-row md:gap-16 md:items-center">
		<div class="flex-1">
			<p class="heading-01">ผลการลงมติรายคน</p>
			<h1 class="fluid-heading-03">
				{data.voting.title}
			</h1>
			<p class="label-01 text-gray-60">หมายเหตุ: ข้อมูลตำแหน่งและสังกัดพรรค ยึดตามวันที่ลงมติ</p>
		</div>
	</div>
	<svelte:fragment slot="table" let:cellKey let:cellValue>
		{#if cellKey === 'id'}
			<p class="body-01 underline">{cellValue.replace('-', ' ')}</p>
		{:else if cellKey === 'voteOption'}
			<VotingOptionTag voteOption={cellValue} />
		{:else}
			<p class="text-gray-60 body-compact-01">{cellValue}</p>
		{/if}
	</svelte:fragment>
</DataPage>
