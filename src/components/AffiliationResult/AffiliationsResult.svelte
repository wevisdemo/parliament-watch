<script lang="ts">
	import type { CustomVoteOption, DefaultVoteOption } from '$models/voting.js';
	import type { ResultsByAffiliation } from '../../routes/votings/[id]/+page';
	import AffiliationResult from './AffiliationResult.svelte';

	export let resultsByAffiliation: ResultsByAffiliation;

	export let isViewPercent: boolean;

	export let resultColorLookup: Record<string, string | undefined>;
	export let getVoteColor: (vote: DefaultVoteOption | CustomVoteOption | string) => string;

	$: totalAffVote = resultsByAffiliation.map(({ resultSummary }) =>
		resultSummary.reduce((acc, vote) => acc + vote.total, 0)
	);
	$: maxTotalAffVote = Math.max(...totalAffVote);
</script>

{#each resultsByAffiliation as { affiliationName, resultSummary, byParties }, idx}
	<AffiliationResult
		{affiliationName}
		{resultSummary}
		{byParties}
		totalAffVote={totalAffVote[idx]}
		affiliationPercent={(totalAffVote[idx] / maxTotalAffVote) * 100 + '%'}
		{isViewPercent}
		{resultColorLookup}
		{getVoteColor}
	/>
{/each}
