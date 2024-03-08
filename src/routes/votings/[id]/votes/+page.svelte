<script lang="ts">
	import type { DefaultVoteOption, CustomVoteOption } from '$models/voting.js';
	import type { SelectedCheckboxValueType } from '$components/DataPage/DataPage.svelte';
	import DataPage from '$components/DataPage/DataPage.svelte';
	import VotingOptionTag from '$components/VotingOptionTag/VotingOptionTag.svelte';

	export let data;

	$: ({ voting, filterOptions, votes } = data);

	$: comboboxFilterList = [
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

	$: checkboxFilterList = [
		{
			key: 'filterPosition',
			legend: 'ตำแหน่ง',
			choices: filterOptions.roles.map((role) => ({
				label: role,
				value: role
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
			: votes.filter((vote) => {
					const search = searchQuery.trim();
					if (search && !vote.politician.id.includes(search)) return;
					const { filterPosition, filterVoteType } = selectedCheckboxValue;
					return (
						filterVoteType.includes(generalVoteType(vote.voteOption)) &&
						filterPosition.includes(vote.role)
					);
				});

	const generalVoteType = (voteOption: DefaultVoteOption | CustomVoteOption | string) =>
		typeof voteOption === 'string' ? (voteOption as string) : 'อื่นๆ';
</script>

<DataPage
	breadcrumbList={[
		{ url: '/', label: 'หน้าหลัก' },
		{ label: 'การลงมติ' },
		{ url: `/votings/${voting.id}`, label: voting.title },
		{ label: 'ผลการลงมติรายคน' }
	]}
	searchPlaceholder="ชื่อ-นามสกุล"
	{comboboxFilterList}
	{checkboxFilterList}
	{filteredData}
	tableHeader={[
		{ key: 'politician', value: 'ชื่อ-นามสกุล' },
		{ key: 'role', value: 'ตำแหน่ง' },
		{ key: 'party', value: 'สังกัดพรรค' },
		{ key: 'voteOption', value: 'การลงมติ' }
	]}
	downloadSize="lg"
	downloadLinks={[
		{ label: 'ผลการลงมติรายคน', url: `/files/download/votings/voting-${voting.id}.csv` }
	]}
	bind:searchQuery
	bind:selectedCheckboxValue
>
	<div class="flex flex-col gap-1 md:flex-row md:items-center md:gap-16">
		<div class="flex-1">
			<p class="heading-01">ผลการลงมติรายคน</p>
			<h1 class="fluid-heading-03">
				<a href="/votings/{voting.id}" class="text-text-01 no-underline hover:text-blue-70">
					{data.voting.title}
				</a>
			</h1>
			<p class="label-01 text-gray-60">หมายเหตุ: ข้อมูลตำแหน่งและสังกัดพรรค ยึดตามวันที่ลงมติ</p>
		</div>
	</div>
	<svelte:fragment slot="table" let:cellKey let:cellValue>
		{#if cellKey === 'politician'}
			<a href="/politicians/{cellValue.id}" class="body-01 text-gray-100 underline"
				>{cellValue.firstname} {cellValue.lastname}</a
			>
		{:else if cellKey === 'voteOption'}
			<VotingOptionTag voteOption={cellValue} />
		{:else}
			<p class="body-compact-01 text-gray-60">{cellValue || '-'}</p>
		{/if}
	</svelte:fragment>
</DataPage>
