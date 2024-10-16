<script lang="ts">
	import { formatThaiDate } from '$lib/date-parser';
	import type { PromiseClarificationLog } from '$models/promise';
	import PromiseClarificationAnswer from './PromiseClarificationAnswer.svelte';

	export let partyName: string;
	export let clarificationLogs: PromiseClarificationLog[] | undefined;
	$: isClarified = clarificationLogs?.every((log) => !!log.answer);
</script>

{#if !clarificationLogs || clarificationLogs.length === 0}
	<div></div>
{:else if isClarified}
	<div class="border-2 border-ui-01 bg-ui-01 p-4">
		<span class="text-text-01"
			>ทีมงาน WeVis เห็นว่าคำสัญญานี้มีความคลุมเครือ จึงส่งจดหมายเปิดผนึกขอคำชี้แจงไปที่พรรค{partyName}
			และได้รับคำชี้แจงเพิ่มเติม ดังนี้
		</span>
		{#each clarificationLogs as clarificationLog}
			<PromiseClarificationAnswer {partyName} clarificationAnswer={clarificationLog.answer} />
		{/each}
	</div>
{:else}
	<div class="border-2 border-ui-01 p-4">
		<ul class="body-01 flex list-outside list-disc flex-col gap-1 px-4 text-text-02">
			{#each clarificationLogs as clarificationLog}
				<li>
					<div>
						<span>{formatThaiDate(clarificationLog.date, true)}</span>
						<span class="text-text-01">{clarificationLog.title}</span>
						<PromiseClarificationAnswer {partyName} clarificationAnswer={clarificationLog.answer} />
					</div>
				</li>
			{/each}
		</ul>
	</div>
{/if}

<style lang="postcss">
	li::marker {
		@apply text-xs;
	}
</style>
