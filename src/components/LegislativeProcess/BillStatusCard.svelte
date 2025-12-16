<script lang="ts">
	import { twMerge } from 'tailwind-merge';
	import BillStatusTag from '../BillStatusTag/BillStatusTag.svelte';
	import type { BillStatus } from '$lib/politigraph/genql';

	export let billStatus: BillStatus;
	// export let billAmount: string;
	export let descriptionTitle: string | null;
	export let descriptionList: Array<string>;
	export let learnMoreLabel: string;
	export let learnMoreUrl: string;

	let className = '';
	export { className as class };
</script>

<div
	class={twMerge(
		'relative flex min-h-[280px] flex-col justify-between overflow-auto rounded-sm p-4 text-icon-01',
		className
	)}
>
	<div>
		<BillStatusTag
			class="body-02 m-0 w-fit px-2 font-semibold"
			isLarge={true}
			status={billStatus}
		/>
		<div class="mt-2 text-sm font-normal">
			{descriptionTitle}
			<ul class="px-4">
				{#each descriptionList as list, i (i)}
					<li class="list-disc">{list}</li>
				{/each}
			</ul>
		</div>
	</div>

	<div class="left-0 self-start">
		<a href={learnMoreUrl} class="text-xs font-normal text-blue-60 underline">{learnMoreLabel}</a>
	</div>
</div>
