<script lang="ts">
	import { slide } from 'svelte/transition';
	import { enhance } from '$app/forms';
	import SearchIcon from 'carbon-icons-svelte/lib/Search.svelte';
	import CloseIcon from 'carbon-icons-svelte/lib/Close.svelte';
	import { createEventDispatcher } from 'svelte';
	import type { SearchIndexes, SearchResults } from '$models/search';
	import { BillStatus } from '$models/bill';
	import { DefaultVotingResult } from '$models/voting';
	import { search } from '../../libs/search';

	const dispatch = createEventDispatcher<{
		activate: void;
		deactivate: void;
	}>();

	export let activeSearch = false;
	export let searchResults: SearchResults | null;
	let searchButton: HTMLButtonElement;
	let searchInput: HTMLInputElement;
	let searchValue = '';

	const searchIndexes: SearchIndexes = {
		politicians: [
			{
				name: 'สุชาติ ชมกลิ่น',
				description: 'สส.บัญชีรายชื่อ | รวมไทยสร้างชาติ'
			},
			{
				name: 'สมคิด จาตุศรีพิทักษ์',
				description: 'นายกรัฐมนตรี'
			},
			{
				name: 'สุชาดา ชาตรี',
				description: 'สส.บัญชีรายชื่อ | รวมไทยสร้างชาติ'
			},
			{
				name: 'ภาวัฒน์ พยัคฆบุตร',
				description: 'ไทยสร้างไทย'
			}
		],
		bills: [
			{
				name: 'ร่าง พ.ร.บ.สุราก้าวหน้า',
				status: BillStatus.Rejected
			},
			{
				name: 'ร่าง พ.ร.บ. งบประมาณรายจ่ายประจําปี 2566',
				status: BillStatus.InProgress
			},
			{
				name: 'ร่าง พ.ร.บ. สมรสเท่าเทียม',
				status: BillStatus.InProgress
			},
			{
				name: 'ร่าง พ.ร.บ. แก้กฎหมายค้ามนุษย์',
				status: BillStatus.Success
			},
			{
				name: 'ร่าง พ.ร.บ. ควบคุมการครอบครองอาวุธปืน',
				status: BillStatus.Rejected
			},
			{
				name: 'ร่าง พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล',
				status: BillStatus.InProgress
			},
			{
				name: 'ร่าง พ.ร.บ. คุ้มครองสิทธิผู้บริโภค',
				status: BillStatus.Success
			}
		],

		votings: [
			{
				name: 'ร่าง พ.ร.บ. สุราก้าวหน้า (วาระที่ 1)',
				result: DefaultVotingResult.Failed
			},
			{
				name: 'ร่าง พ.ร.บ. แรงงานสัมพันธ์',
				result: DefaultVotingResult.Passed
			},
			{
				name: 'ร่าง พ.ร.บ. ภาษีที่ดินและสิ่งปลูกสร้าง (วาระที่ 1)',
				result: DefaultVotingResult.Passed
			},
			{
				name: 'ร่าง พ.ร.บ. ส่งเสริมการพัฒนาเศรษฐกิจดิจิทัล (วาระที่ 2)',
				result: DefaultVotingResult.Failed
			},
			{
				name: 'ร่าง พ.ร.บ. คุ้มครองผู้บริโภค (วาระที่ 3)',
				result: DefaultVotingResult.Passed
			},
			{
				name: 'ร่าง พ.ร.บ. คุ้มครองสิทธิส่วนบุคคล (วาระที่ 2)',
				result: DefaultVotingResult.Failed
			},
			{
				name: 'ร่าง พ.ร.บ. สมรสเท่าเทียม (วาระที่ 3)',
				result: DefaultVotingResult.Failed
			}
		]
	};

	function searchClickHandle() {
		if (!activeSearch) {
			activeSearch = true;
			dispatch('activate');
			searchInput.focus();
		}
	}

	function introEndHandler() {
		searchInput.focus();
	}

	function closeClickHandle() {
		activeSearch = false;
		searchValue = '';
		dispatch('deactivate');
	}

	$: if (activeSearch && searchValue.trim()) {
		searchResults = search(searchValue.trim(), searchIndexes);
	} else {
		searchResults = null;
		searchValue = '';
	}
</script>

<div class="flex h-full {activeSearch ? 'bg-gray-90' : ''}">
	<button
		bind:this={searchButton}
		type="button"
		form="top-search-input"
		class="grid place-content-center bg-white/0 border-0 text-white cursor-pointer w-12 h-12"
		on:click={searchClickHandle}
	>
		<SearchIcon />
	</button>

	{#if activeSearch}
		<div
			class="flex h-full"
			transition:slide={{ axis: 'x', duration: 250 }}
			on:introend={introEndHandler}
		>
			<input
				bind:this={searchInput}
				bind:value={searchValue}
				on:blur={() => (activeSearch = false)}
				name="navSearch"
				type="text"
				class="w-[calc(320px-6rem)] bg-white/0 outline-none border-0 text-white leading-4"
				placeholder="ค้นหาชื่อบุคคล/ร่างกฎหมาย"
			/>
			<button
				class="grid place-content-center bg-white/0 border-0 text-white cursor-pointer w-12 h-12"
				on:click={closeClickHandle}
			>
				<CloseIcon />
			</button>
		</div>
	{/if}
</div>
