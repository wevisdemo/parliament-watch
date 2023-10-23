<script lang="ts">
	import BillStatusTag from '$components/BillStatusTag/BillStatusTag.svelte';
	import VotingResultTag from '$components/VotingResultTag/VotingResultTag.svelte';
	import type { SearchResultItem } from '$models/search';

	export let item: SearchResultItem;
</script>

<a href={item.url}>
	<div class="px-4 bg-ui-background">
		<div class="item-inner-container">
			<div>
				<div class="text-sm text-text-02">{item.heading}</div>
				{#if item.description}
					<p class="text-xs text-text-03">{item.description}</p>
				{/if}
			</div>
			{#if item.billStatus !== undefined || item.voteResult !== undefined}
				<div class=" shrink-0">
					{#if item.billStatus}
						<BillStatusTag status={item.billStatus} />
					{/if}
					{#if item.voteResult}
						<VotingResultTag result={item.voteResult} />
					{/if}
				</div>
			{/if}
		</div>
	</div>
</a>

<style lang="postcss">
	.item-inner-container {
		border-bottom: 1px solid;
		padding: 8px 0;
		display: flex;
		justify-content: space-between;
		align-items: center;

		@apply border-ui-01;
	}
</style>
