<script lang="ts">
	import { formatThaiDate } from '$lib/date-parser';
	import type { PromiseClarificationLog } from '$models/promise';
	import { Quotes } from 'carbon-icons-svelte';

	export let clarificationLogs: PromiseClarificationLog[] | undefined;
</script>

{#if !clarificationLogs || clarificationLogs.length === 0}
	<div></div>
{:else}
	<div class="border-2 border-ui-01 p-4">
		<ul class="body-01 flex list-outside list-disc flex-col gap-1 px-4 text-text-02">
			{#each clarificationLogs as clarificationLog}
				<li>
					<div>
						<span>{formatThaiDate(clarificationLog.date, true)}</span>
						<span class="text-text-01">{clarificationLog.title}</span>
						{#if clarificationLog.answer}
							<div class="py-4">
								<div class="flex flex-row gap-2 text-text-03">
									<Quotes class="text-2xl" size={20} />
									<span class="py-1">
										คำชี้แจงจากพรรคเพื่อไทย ({formatThaiDate(
											clarificationLog.answer.date,
											true
										)})</span
									>
								</div>
								<div class="flex flex-row gap-2">
									<div class="vertical-gray-line" />
									<div class="body-02 font-semi-bold text-text-01">
										{clarificationLog.answer.content}
									</div>
								</div>
							</div>
						{/if}
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

	.vertical-gray-line {
		@apply mx-2 min-h-full border-solid border-gray-20 md:border-[1px];
	}
</style>
