<script lang="ts">
	import VotesTable from '$components/Votes/VotesTable.svelte';
	import type {
		AssemblySummary,
		FilterOptions,
		VoteSummary
	} from '../../routes/assemblies/[id]/votes/+page';
	import VotesFilter from './VotesFilter.svelte';
	import VotesFilterModal from './VotesFilterModal.svelte';
	import type { VotesFilter as IVotesFilter } from './shared';

	export let votes: VoteSummary[] = [];
	export let filterOptions: FilterOptions;
	$: outerWidth = 769;
	$: isMD = outerWidth > 768;
	$: showFilter = isMD ? true : false;
	let filter: IVotesFilter = {
		name: '',
		result: ['ผ่าน', 'ไม่ผ่าน'],
		category: filterOptions.categories
	};

	$: filteredVotes = votes.filter((vote) => {
		let result = true;
		if (filter.name !== '') {
			result = result && vote.title.includes(filter.name);
		}
		result = result && filter.result.includes(vote.result);
		result = result && filter.category.some((category) => vote.categories.includes(category));
		return result;
	});
</script>

<svelte:window bind:outerWidth />

<div class="flex bg-white flex flex-col md:flex-row justify-center">
	<section class="md:block hidden flex">
		<VotesFilter {votes} bind:filter bind:showFilter />
	</section>
	<VotesTable votes={filteredVotes} bind:showFilter />
	{#if !isMD}
		<section class="block md:hidden">
			<VotesFilterModal {votes} bind:filter bind:showFilter />
		</section>
	{/if}
</div>
