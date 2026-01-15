<script lang="ts">
	import type { DefaultVoteOption, CustomVoteOption } from '$models/voting.js';
	import type {
		SelectedCheckboxValueType,
		SelectedComboboxValueType
	} from '$components/DataPage/DataPage.svelte';
	import DataPage from '$components/DataPage/DataPage.svelte';
	import VotingOptionTag from '$components/VotingOptionTag/VotingOptionTag.svelte';

	export let data;

	$: ({ voteEvent, filterOptions, customVoteOptions, votes } = data);

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
	let selectedComboboxValue: SelectedComboboxValueType;

	$: filteredData =
		selectedCheckboxValue === undefined ||
		Object.values(selectedCheckboxValue).some((e) => e.length === 0)
			? []
			: votes.filter(({ politician, option, role, party }) => {
					const search = searchQuery.trim();
					if (search && !politician.name.includes(search)) return;
					const selectedParty = selectedComboboxValue?.filterComboboxType;

					return (
						selectedCheckboxValue.filterVoteType.includes(generalVoteType(option)) &&
						selectedCheckboxValue.filterPosition.includes(role) &&
						(!selectedParty || party?.name === selectedParty)
					);
				});

	const generalVoteType = (voteOption: DefaultVoteOption | CustomVoteOption | string) =>
		typeof voteOption === 'string' ? (voteOption as string) : 'อื่นๆ';
</script>

<DataPage
	breadcrumbList={[
		{ url: '/', label: 'หน้าหลัก' },
		{ label: 'การลงมติ' },
		{ url: `/votings/${voteEvent.id}`, label: voteEvent.nickname || voteEvent.title },
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
		{ key: 'option', value: 'การลงมติ' }
	]}
	downloadSize="lg"
	downloadLinks={[
		{ label: 'ผลการลงมติรายคน', url: `/files/download/votings/voting-${voteEvent.id}.csv` }
	]}
	bind:searchQuery
	bind:selectedCheckboxValue
	bind:selectedComboboxValue
>
	<div class="flex flex-col gap-1 md:flex-row md:items-center md:gap-16">
		<div class="flex-1">
			<p class="heading-01">ผลการลงมติรายคน</p>
			<h1 class="fluid-heading-03">
				<a href="/votings/{voteEvent.id}" class="text-text-01 no-underline hover:text-blue-70">
					{voteEvent.nickname || voteEvent.title}
				</a>
			</h1>
			<p class="label-01 text-gray-60">หมายเหตุ: ข้อมูลตำแหน่งและสังกัดพรรค ยึดตามวันที่ลงมติ</p>
		</div>
	</div>
	<svelte:fragment slot="table" let:cellKey let:cellValue>
		{#if cellKey === 'politician'}
			{#if cellValue.id}
				<a
					href="/politicians/{cellValue.id}"
					class="body-01 text-gray-100 underline"
					target="_blank">{cellValue.name}</a
				>
			{:else}
				<p class="body-01 text-gray-100">{cellValue.name}</p>
			{/if}
		{:else if cellKey === 'role'}
			<p class="body-compact-01 text-gray-60">{cellValue ?? '-'}</p>
		{:else if cellKey === 'party'}
			<p class="body-compact-01 text-gray-60">{cellValue?.name ?? '-'}</p>
		{:else if cellKey === 'option'}
			<VotingOptionTag
				voteOption={customVoteOptions.find((option) => option.label === cellValue) ?? cellValue}
			/>
		{/if}
	</svelte:fragment>
</DataPage>
