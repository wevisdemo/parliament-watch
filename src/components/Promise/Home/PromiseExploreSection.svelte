<script lang="ts">
	import PromiseList from '$components/PromiseList/PromiseList.svelte';
	import { Dropdown, Search } from 'carbon-components-svelte';
	import type { PromiseSummary } from '../../../routes/promises/+page.server';
	import ContentSection from './ContentSection.svelte';
	import { onMount } from 'svelte';

	export let promiseSummaries: PromiseSummary[];

	export let selectedStatus = 'ทุกสถานะ';
	export let selectedParty = 'ทุกพรรค';
	export let selectedCategory = 'ทุกหมวด';
	export let searchTerm = '';

	$: filterSummaries = (
		status: string,
		party: string,
		category: string,
		search: string
	): PromiseSummary[] => {
		return promiseSummaries.filter((summary) => {
			const matchesStatus = status === 'ทุกสถานะ' || summary.status === status;
			const matchesParty = party === 'ทุกพรรค' || summary.party.name === party;
			const matchesCategory = category === 'ทุกหมวด' || summary.categories.includes(category);
			const matchesSearch =
				!search || summary.keywords.some((s) => s.toLowerCase().includes(search.toLowerCase()));

			return matchesStatus && matchesParty && matchesCategory && matchesSearch;
		});
	};

	$: filteredSummaries = filterSummaries(
		selectedStatus,
		selectedParty,
		selectedCategory,
		searchTerm
	);

	$: getStatusItems = () => {
		const uniqueStatuses = Array.from(new Set(promiseSummaries.map((summary) => summary.status)));

		const statusItems = uniqueStatuses.map((status) => {
			const count = filterSummaries(status, selectedParty, selectedCategory, searchTerm).filter(
				(summary) => summary.status === status
			).length;
			return { id: status, text: `${status} (${count})` };
		});

		return [
			{
				id: 'ทุกสถานะ',
				text: `ทุกสถานะ (${filterSummaries('ทุกสถานะ', selectedParty, selectedCategory, searchTerm).length})`
			},
			...statusItems
		];
	};

	$: getPartyItems = () => {
		const uniqueParty = Array.from(new Set(promiseSummaries.map((summary) => summary.party.name)));

		const partyItems = uniqueParty.map((partyName) => {
			const count = filterSummaries(selectedStatus, partyName, selectedCategory, searchTerm).filter(
				(summary) => summary.party.name === partyName
			).length;
			return { id: partyName, text: `${partyName} (${count})` };
		});

		return [
			{
				id: 'ทุกพรรค',
				text: `ทุกพรรค (${filterSummaries(selectedStatus, 'ทุกพรรค', selectedCategory, searchTerm).length})`
			},
			...partyItems
		];
	};

	$: getCategoryItems = () => {
		const uniqueCategories = Array.from(
			new Set(promiseSummaries.flatMap((summary) => summary.categories))
		);
		const categoryItems = uniqueCategories.map((category) => {
			const count = filterSummaries(selectedStatus, selectedParty, category, searchTerm).filter(
				(summary) => summary.categories.includes(category)
			).length;
			return { id: category, text: `${category} (${count})` };
		});
		return [
			{
				id: 'ทุกหมวด',
				text: `ทุกหมวด (${filterSummaries(selectedStatus, selectedParty, 'ทุกหมวด', searchTerm).length})`
			},
			...categoryItems
		];
	};

	let inputSearch = '';
	let showSuggestions = false;

	const getSuggestions = (input: string): string[] => {
		let suggestions = Array.from(new Set(promiseSummaries.flatMap((summary) => summary.keywords)));
		if (!input) {
			return suggestions;
		}
		const lowerCaseInput = input.toLowerCase();
		return suggestions
			.filter((keyword) => keyword.toLowerCase().includes(lowerCaseInput))
			.slice(0, 5);
	};

	$: suggestions = getSuggestions(inputSearch);

	const selectSuggestion = (suggestion: string) => {
		searchTerm = suggestion;
		inputSearch = searchTerm;
		showSuggestions = false;
	};

	const handleClickOutside = (event: MouseEvent) => {
		const suggestionBox = document.querySelector('.suggestion-box');
		if (suggestionBox && !suggestionBox.contains(event.target as Node)) {
			showSuggestions = false;
		}
	};

	onMount(() => {
		window.addEventListener('click', handleClickOutside);
	});
</script>

<ContentSection id="explore" backgroundColor="bg-ui-01">
	<div class="flex flex-col items-center pt-14">
		<p class="fluid-heading-04">สำรวจคำสัญญา</p>
	</div>
	<div class="flex flex-col gap-2">
		<p class="body-01 text-text-02">ตัวกรอง</p>
		<div class="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
			<Dropdown
				light={true}
				hideLabel
				titleText="status"
				selectedId={selectedStatus}
				on:select={(e) => {
					selectedStatus = e.detail.selectedId;
				}}
				items={getStatusItems()}
			/>
			<Dropdown
				light={true}
				hideLabel
				titleText="party"
				selectedId={selectedParty}
				on:select={(e) => {
					selectedParty = e.detail.selectedId;
				}}
				items={getPartyItems()}
			/>
			<Dropdown
				light={true}
				hideLabel
				titleText="category"
				selectedId={selectedCategory}
				on:select={(e) => {
					selectedCategory = e.detail.selectedId;
				}}
				items={getCategoryItems()}
			/>
			<div class="suggestion-box relative">
				<Search
					light={true}
					size="lg"
					placeholder="คีย์เวิร์ด เช่น Soft Power"
					bind:value={inputSearch}
					on:focus={() => (showSuggestions = true)}
					on:input={() => (showSuggestions = true)}
					on:clear={() => (searchTerm = '')}
				/>
				<div
					class="absolute z-10 flex max-h-[226px] w-full flex-col overflow-auto bg-ui-background px-4 drop-shadow-lg"
				>
					{#if showSuggestions && suggestions.length > 0}
						{#each suggestions as suggestion, index}
							<button
								class="hover:bg-gray-200 flex w-full cursor-pointer flex-col items-start justify-center py-3"
								on:click={() => selectSuggestion(suggestion)}
							>
								<p class="body-compact-01 text-text-02">{suggestion}</p>
							</button>
							{#if index < suggestions.length - 1}
								<div class="w-full border-t border-ui-03" />
							{/if}
						{/each}
					{:else if !suggestions.length}
						<div
							class="flex w-full cursor-pointer flex-col items-start
							justify-center gap-1 py-3"
						>
							<p class="label-02 text-support-04">ไม่พบคำที่ค้นหา</p>
							<p class="label-01 text-text-03">ลองตรวจสอบตัวสะกด หรือ ค้นหาด้วยคำที่ใกล้เคียง</p>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</ContentSection>

<PromiseList summaries={filteredSummaries} />
