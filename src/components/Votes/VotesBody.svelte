<script lang="ts">
	import VotesTable from '$components/Votes/VotesTable.svelte';
	import type {
		AssemblySummary,
		FilterOptions,
		VoteSummary
	} from '../../routes/assemblies/[id]/votes/+page';
	import VotesFilter from './VotesFilter.svelte';
	import type { VotesFilter as IVotesFilter } from './shared';

	export let votes: VoteSummary[] = [];
	export let filterOptions: FilterOptions;
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

<div class="flex bg-white flex flex-col md:flex-row justify-center">
	<VotesFilter {votes} bind:filter />
	<VotesTable votes={filteredVotes} />
</div>
