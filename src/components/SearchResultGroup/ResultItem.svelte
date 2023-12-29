<script lang="ts">
	import BillStatusTag from '$components/BillStatusTag/BillStatusTag.svelte';
	import VotingResultTag from '$components/VotingResultTag/VotingResultTag.svelte';
	import type { SearchResultItem } from '$models/search';
	import HightlightText from './HightlightText.svelte';

	export let item: SearchResultItem;
</script>

<a href={item.url} data-sveltekit-reload>
	<div class="px-4 bg-ui-background">
		<div class="item-inner-container">
			<div>
				{#if item.headingHighlight}
					<HightlightText textList={item.headingHighlight} textClass="text-sm text-text-02" />
				{:else}
					<div class="text-sm text-text-02">{item.heading}</div>
				{/if}
				{#if item.description}
					<p class="text-xs text-text-03">{item.description}</p>
				{/if}
			</div>
			{#if item.billStatus !== undefined || item.voteResult !== undefined || item.proposedBillsCount !== undefined}
				<div class="shrink-0">
					{#if item.billStatus}
						<BillStatusTag status={item.billStatus} />
					{/if}
					{#if item.voteResult}
						<VotingResultTag result={item.voteResult} />
					{/if}
					{#if item.proposedBillsCount}
						<p class="label-02 text-text-02">{item.proposedBillsCount} ร่าง</p>
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
