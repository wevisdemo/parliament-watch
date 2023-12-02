<script lang="ts">
	import { Checkbox, Search } from 'carbon-components-svelte';
	import type { VoteSummary } from '../../routes/assemblies/[id]/votes/+page';
	import type { VotesFilter } from './shared';
	import { Filter, Minimize } from 'carbon-icons-svelte';
	import { Button } from 'carbon-components-svelte';
	export let votes: VoteSummary[] = [];
	export let filter: VotesFilter;
	export let showFilter = true;
	let resultFilter = filter.result;
	// let catergoryFilter = [
	// 	'Hello Mee',
	// 	'Hello Mee',
	// 	'Hello Mee',
	// 	'Hello Mee',
	// 	'Hello Mee',
	// 	'Hello Mee',
	// 	'Hello Mee',
	// 	'Hello Mee',
	// 	'Hello Mee',
	// 	'Hello Mee',
	// 	'Hello Mee',
	// 	'Hello Mee',
	// 	'Hello Mee',
	// 	'Hello Mee',
	// 	'Hello Mee'
	// ];
	let catergoryFilter = filter.category;

	$: footAction =
		filter.result.length > 0 || filter.category.length > 0 ? 'ล้างตัวเลือก' : 'เลือกทั้งหมด';

	const getRowCountFilteredByCategory = (category: string) => {
		let result = 0;
		for (let i = 0; i < votes.length; i++) {
			if (votes[i].categories.includes(category)) {
				result++;
			}
		}
		return result;
	};

	const getRowCountFilteredByResult = (label: string) => {
		let result = 0;
		for (let i = 0; i < votes.length; i++) {
			if (votes[i].result === label) {
				result++;
			}
		}
		return result;
	};

	const doFooterAction = () => {
		if (footAction === 'ล้างตัวเลือก') {
			resetFilter();
		} else {
			selectAllFilter();
		}
	};

	const selectAllFilter = () => {
		filter = {
			name: filter.name,
			result: resultFilter,
			category: catergoryFilter
		};
	};

	const resetFilter = () => {
		filter = {
			name: '',
			result: [],
			category: []
		};
	};
</script>

<div
	class="relative md:max-w-[var(--max-width)] h-full overflow-hidden transition-all duration-200"
	style="--max-width: {showFilter ? '256px' : '0px'}"
>
	<div class="w-[256px] relative flex flex-col h-full justify-between">
		<button
			class="absolute top-[0px] right-[0px] p-[10px] hover:cursor-pointer z-10"
			on:click={() => {
				showFilter = !showFilter;
			}}
		>
			<Minimize />
		</button>
		<div class="px-[24px] h-full flex flex-col relative">
			<Search
				placeholder="ค้นหาชื่อมติ/คำที่เกี่ยวข้อง"
				bind:value={filter.name}
				light
				class="sticky top-0"
			/>
			<div class="overflow-scroll">
				<div class="mt-[16px]">
					<span class="label-01 text-gray-60">ผลลัพท์</span>
					{#each resultFilter as value}
						<Checkbox bind:group={filter.result} {value}>
							<div slot="labelText">
								<span class="body-01">{value}</span>
								<span class="body-01 text-gray-60">({getRowCountFilteredByResult(value)})</span>
							</div>
						</Checkbox>
					{/each}
				</div>
				<div class="mt-[16px]">
					<span class="label-01 text-gray-60">หมวดมติ</span>
					{#each catergoryFilter as value}
						<Checkbox bind:group={filter.category} {value}>
							<div slot="labelText">
								<span class="body-01">{value}</span>
								<span class="body-01 text-gray-60">({getRowCountFilteredByCategory(value)})</span>
							</div>
						</Checkbox>
					{/each}
				</div>
			</div>
		</div>
		<Button
			kind={footAction === 'ล้างตัวเลือก' ? 'tertiary' : 'secondary'}
			class="bottom-[0px] left-[0px]  p-[14px] w-full text-left"
			on:click={doFooterAction}
		>
			{footAction}
		</Button>
	</div>
</div>

<style></style>
