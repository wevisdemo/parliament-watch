<script lang="ts">
	import VotesTable from '$components/Votes/VotesTable.svelte';
	import type { VotingSummary } from '../../routes/assemblies/[id]/votes/+page';

	export let votes: VotingSummary[] = [];
</script>

<div>
	<VotesTable {votes} />
</div>
