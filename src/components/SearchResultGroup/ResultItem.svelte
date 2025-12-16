<script lang="ts">
	import BillStatusTag from '$components/BillStatusTag/BillStatusTag.svelte';
	import PromiseStatusTag from '$components/PromiseDetail/PromiseStatusTag.svelte';
	import VotingResultTag from '$components/VotingResultTag/VotingResultTag.svelte';
	import type { SearchResultItem } from '$models/search';
	import HighlightText from './HighlightText.svelte';

	export let item: SearchResultItem;
</script>

<a href={item.url} data-sveltekit-reload>
	<div class="bg-ui-background px-4">
		<div class="flex gap-1 border-b border-ui-01 px-0 py-2">
			<div>
				{#if item.headingHighlight}
					<HighlightText
						textList={item.headingHighlight}
						textClass="text-sm text-text-02 line-clamp-2"
					/>
				{:else}
					<div class="line-clamp-2 text-sm text-text-02">{item.heading}</div>
				{/if}
				{#if item.description}
					<p class="text-xs text-text-03">{item.description}</p>
				{/if}
			</div>
			{#if item.billStatus !== undefined || item.voteResult !== undefined || item.proposedBillsCount !== undefined || item.promiseStatus !== undefined}
				<div class="shrink-0">
					{#if item.billStatus}
						<BillStatusTag status={item.billStatus} />
					{/if}
					{#if item.voteResult}
						<VotingResultTag result={item.voteResult} />
					{/if}
					{#if item.proposedBillsCount}
						<p class="label-02 text-text-02">({item.proposedBillsCount} ร่าง)</p>
					{/if}
					{#if item.promiseStatus}
						<PromiseStatusTag status={item.promiseStatus} />
					{/if}
				</div>
			{/if}
		</div>
	</div>
</a>
