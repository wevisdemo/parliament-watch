<script lang="ts">
	import { formatThaiDate } from '$lib/date';
	import type { PromiseClarificationLog } from '$models/promise';
	import { Quotes } from 'carbon-icons-svelte';

	export let clarificationAnswer: NonNullable<PromiseClarificationLog['answer']>;
	export let partyName: string;
</script>

<div class="py-2">
	<div class="flex flex-row gap-2 text-text-03">
		<Quotes class="text-2xl" size={20} />
		<span>
			คำชี้แจงจากพรรค{partyName} ({formatThaiDate(clarificationAnswer.date, { shortMonth: true })})
		</span>
	</div>
	<div class="flex flex-row gap-2">
		<div class="vertical-gray-line" />
		<div class="body-02 font-semibold text-text-01">
			{clarificationAnswer.content}
		</div>
	</div>
</div>

<style lang="postcss">
	.vertical-gray-line {
		@apply mx-2 min-h-full border-solid border-gray-20 md:border-[1px];
	}
</style>
