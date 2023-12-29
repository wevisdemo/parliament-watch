<script lang="ts">
	import type { BillStatus } from '$models/bill';
	import { twMerge } from 'tailwind-merge';
	import BillStatusTag from '../BillStatusTag/BillStatusTag.svelte';

	export let billStatus: BillStatus;
	export let billAmount: string;
	export let descriptionTitle: string | null;
	export let descriptionList: Array<string>;
	export let learnMoreLabel: string;
	export let learnMoreUrl: string;

	let className = '';
	export { className as class };
</script>

<div
	class={twMerge(
		'relative flex flex-col justify-between min-h-[280px] p-4 rounded-sm text-icon-01 overflow-auto',
		className
	)}
>
	<div>
		<BillStatusTag
			class="body-02 font-semibold px-2 m-0 w-fit"
			isLarge={true}
			status={billStatus}
		/>
		<div
			class="font-semibold text-sm my-2
		"
		>
			จำนวน {billAmount} ฉบับ
		</div>
		<div class="font-normal text-sm">
			{descriptionTitle}
			<ul class="px-4">
				{#each descriptionList as list}
					<li class="list-disc">{list}</li>
				{/each}
			</ul>
		</div>
	</div>

	<div class="self-start left-0">
		<a href={learnMoreUrl} class="text-xs font-normal text-blue-60 underline">{learnMoreLabel}</a>
	</div>
</div>
