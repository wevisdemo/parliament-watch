<script lang="ts">
	import type {
		SelectedCheckboxValueType,
		SelectedComboboxValueType
	} from '$components/DataPage/DataPage.svelte';
	import DataPage from '$components/DataPage/DataPage.svelte';
	import VotingOptionTag from '$components/VotingOptionTag/VotingOptionTag.svelte';
	import {
		buildVoteQueryStateConfig,
		comboboxQueryConfig,
		listCheckboxQueryConfig
	} from '$lib/query-state/config.js';
	import type { DefaultVoteOption, CustomVoteOption } from '$models/voting.js';

	let { data } = $props();

	let { voteEvent, filterOptions, customVoteOptions, votes } = $derived(data);

	let searchQuery = $state('');
	let selectedCheckboxValue: SelectedCheckboxValueType = $state(
		(() => ({
			filterVoteType: filterOptions.voteOptions,
			filterPosition: filterOptions.roles
		}))()
	);
	let selectedComboboxValue: SelectedComboboxValueType = $state({ filterComboboxType: '' });

	const generalVoteType = (voteOption: DefaultVoteOption | CustomVoteOption | string) =>
		typeof voteOption === 'string' ? (voteOption as string) : 'อื่นๆ';

	let comboboxFilterList = $derived([
		{
			key: 'filterComboboxType',
			legend: 'พรรคสังกัด ณ วันที่ลงมติ',
			placeholder: 'เลือกพรรค',
			choices: filterOptions.parties.map((type) => ({
				id: type,
				text: type
			}))
		}
	]);

	let checkboxFilterList = $derived([
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
	]);

	const queryStateConfig = buildVoteQueryStateConfig({
		checkbox: {
			filterPosition: listCheckboxQueryConfig('position'),
			filterVoteType: listCheckboxQueryConfig('voteType')
		},
		combobox: {
			filterComboboxType: comboboxQueryConfig('party')
		}
	});

	let filteredData = $derived(
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
				})
	);
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
	{queryStateConfig}
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
	{#snippet table({ cellKey, cellValue })}
		{#if cellKey === 'politician'}
			{#if cellValue.id}
				<a href="/politicians/{cellValue.id}" class="body-01 text-gray-100 underline"
					>{cellValue.name}</a
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
	{/snippet}
</DataPage>
