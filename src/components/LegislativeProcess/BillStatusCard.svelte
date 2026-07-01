<script lang="ts">
	import type { BillStatus } from '$lib/politigraph/genql';
	import BillStatusTag from '../BillStatusTag/BillStatusTag.svelte';
	import { twMerge } from 'tailwind-merge';

	interface Props {
		billStatus: BillStatus;
		// export let billAmount: string;
		descriptionTitle: string | null;
		descriptionList: Array<string>;
		learnMoreLabel: string;
		learnMoreUrl: string;
		class?: string;
	}

	let {
		billStatus,
		descriptionTitle,
		descriptionList,
		learnMoreLabel,
		learnMoreUrl,
		class: className = ''
	}: Props = $props();
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
