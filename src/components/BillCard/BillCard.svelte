<script lang="ts">
	import { ArrowRight } from 'carbon-icons-svelte';
	import BillStatusTag from '$components/BillStatusTag/BillStatusTag.svelte';
	import { twMerge } from 'tailwind-merge';
	import type { BillStatus } from '$lib/politigraph/genql';
	import Proposer from '$components/Proposer/Proposer.svelte';
	import type { ComponentProps } from 'svelte';
	import dayjs from 'dayjs';

	export let id: string;
	export let nickname: string | null;
	export let title: string | null;
	export let proposedOn: Date | null;
	export let startedOn: Date | null = null;
	export let status: BillStatus;
	export let proposer: ComponentProps<Proposer>['proposer'] = undefined;
	export let orientation: 'landscape' | 'portrait' = 'portrait';
	export let isFullWidth = false;
	let className = '';
	export { className as class };

	$: isLandscape = orientation === 'landscape';
</script>

<div
	class={twMerge(
		'group relative flex border-2 border-white bg-white text-black hover:border-ui-04 hover:bg-ui-03',
		isLandscape ? 'max-w-[640px] flex-col gap-x-6 md:flex-row' : 'max-w-[288px] flex-col',
		isFullWidth ? 'w-full max-w-none' : '',
		className
	)}
>
	<div class={twMerge('space-y-1', isLandscape ? 'w-full md:w-2/3' : 'w-full', 'p-4 pt-6')}>
		<a href="/bills/{id}" class="block after:absolute after:inset-0 after:content-['']">
			<h3 class="fluid-heading-03 text-text-01">{nickname}</h3>
		</a>
		{#if title}
			<p class="text-sm text-text-02"><span class="mr-1 font-bold">ชื่อทางการ</span>{title}</p>
		{/if}
	</div>

	<div
		class="flex w-full flex-1 justify-between {isLandscape
			? 'flex-col gap-x-6 gap-y-4 md:w-1/3 md:flex-row md:gap-y-0'
			: 'flex-col gap-y-4'} bg-ui-01 group-hover:bg-ui-03"
	>
		<div class="flex flex-col gap-4 p-4 pb-0">
			<div class="flex flex-col gap-1">
				<p class="font-semibold">เสนอโดย</p>
				<Proposer {proposer} {orientation} />
			</div>

			<hr class="border-ui-03 group-hover:border-ui-04" />

			<div class="grow space-y-2">
				<div class="flex w-full flex-row items-center justify-between">
					<p class="text-sm font-semibold">สถานะ</p>
					<BillStatusTag class="mr-0" {status} />
				</div>

				{#if proposedOn}
					<div class="flex w-full flex-row items-center justify-between">
						<p class="text-sm font-semibold">วันที่เสนอ</p>

						<p class="text-sm">
							{proposedOn.toLocaleDateString('th-TH', {
								day: 'numeric',
								month: 'short',
								year: '2-digit'
							})}
						</p>
					</div>
				{/if}

				{#if startedOn}
					<div class="flex w-full flex-row items-center justify-between">
						<p class="text-sm font-semibold">วันที่ออกเป็นกม.</p>

						<p class="text-sm">
							{startedOn.toLocaleDateString('th-TH', {
								day: 'numeric',
								month: 'short',
								year: '2-digit'
							})}
						</p>
					</div>
				{/if}

				{#if proposedOn && startedOn}
					<div class="">
						<p class="text-right text-sm font-semibold text-support-04">
							ใช้เวลา {dayjs(startedOn).diff(proposedOn, 'd')} วัน
						</p>
					</div>
				{/if}
			</div>
		</div>

		<div class="p-4">
			<ArrowRight class="ml-auto text-gray-100" />
		</div>
	</div>
</div>
