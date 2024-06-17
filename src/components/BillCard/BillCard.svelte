<script lang="ts">
	import { ArrowRight } from 'carbon-icons-svelte';
	import BillStatusTag from '$components/BillStatusTag/BillStatusTag.svelte';
	import { type Bill } from '$models/bill';
	import { twMerge } from 'tailwind-merge';
	import Proposer from '$components/Proposer/Proposer.svelte';

	export let bill: Bill;
	export let orientation: 'landscape' | 'portrait' = 'landscape';
	export let currentState: string | undefined = undefined;
	export let daySinceProposed: number | undefined = undefined;
	export let isFullWidth = false;
	let className = '';
	export { className as class };

	$: isLandscape = orientation === 'landscape';
</script>

<div
	class={twMerge(
		'hover:bg-gray-10, relative flex rounded-sm bg-white p-4 text-black',
		isLandscape
			? 'max-w-[640px] flex-col gap-x-6 gap-y-4 md:flex-row md:gap-y-0'
			: 'max-w-[242px] flex-col gap-y-4 pt-6',
		isFullWidth ? 'w-full max-w-none' : '',
		className
	)}
>
	<div class={twMerge('space-y-1', isLandscape ? 'w-full md:w-2/3' : 'w-full')}>
		<a href="/bills/{bill.id}" class="block after:absolute after:inset-0 after:content-['']">
			<h3 class="fluid-heading-03 text-text-01">{bill.nickname}</h3>
		</a>
		<p class="text-sm text-text-02"><span class="mr-1 font-bold">ชื่อทางการ</span>{bill.title}</p>
		<p class="font-semibold">เสนอโดย</p>
		<Proposer {bill} />
	</div>

	<div
		class="flex w-full flex-1 {isLandscape
			? 'flex-col gap-x-6 gap-y-4 md:w-1/3 md:flex-row md:gap-y-0'
			: 'flex-col gap-y-4'}"
	>
		<div class="grow space-y-2">
			{#if bill.proposedOn}
				<div>
					<p class="text-sm font-semibold">วันที่เสนอ</p>

					<p class="text-sm">
						{bill.proposedOn.toLocaleDateString('th-TH', {
							day: 'numeric',
							month: 'short',
							year: 'numeric'
						})}
					</p>
				</div>
			{/if}

			<div>
				<p class="text-sm font-semibold">สถานะ</p>
				<BillStatusTag isLarge status={bill.status} />
				{#if currentState}
					<p class="text-sm font-semibold">{currentState}</p>
				{/if}
			</div>

			{#if daySinceProposed}
				<p class="text-sm font-semibold text-blue-70">ผ่านมาแล้ว {daySinceProposed} วัน</p>
			{/if}
		</div>

		<ArrowRight class="ml-auto text-gray-100" />
	</div>
</div>
