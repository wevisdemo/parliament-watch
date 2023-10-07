<script lang="ts">
	import VoteCard from '$components/votes/VoteCard.svelte';
	import type { load } from './+page';

	export let data: ReturnType<typeof load>;
</script>

<div class="whitespace-pre">
	{#each data.latestVotes as latestVote (latestVote.voting.id)}
		<VoteCard
			voting={latestVote.voting}
			highlightedVoteByGroups={latestVote.highlightedVoteByGroups}
		/>
	{/each}
</div>
