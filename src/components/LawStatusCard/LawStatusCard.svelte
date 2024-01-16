<script lang="ts">
	import { BillStatus } from '$models/bill';
	import ArrowRight from 'carbon-icons-svelte/lib/ArrowRight.svelte';
	import type { BillsByCategory, BillsByStatus } from '../../routes/bills/+page.server';

	export let totalCount: number;
	export let bill: BillsByStatus | BillsByCategory;

	const HEADER_STYLE: Record<BillStatus, string> = {
		[BillStatus.InProgress]: 'bg-yellow-20 text-text-10',
		[BillStatus.Enacted]: 'bg-teal-80 text-text-04',
		[BillStatus.Rejected]: 'bg-red-80 text-text-04',
		[BillStatus.Merged]: 'bg-purple-80 text-text-04'
	};

	const BAR_STYLE: Record<BillStatus, string> = {
		[BillStatus.InProgress]: 'bg-yellow-20',
		[BillStatus.Enacted]: 'bg-teal-80',
		[BillStatus.Rejected]: 'bg-red-80',
		[BillStatus.Merged]: 'bg-purple-80'
	};

	$: headerStyle = 'status' in bill ? HEADER_STYLE[bill.status] : 'border';
	$: barStyle = 'status' in bill ? BAR_STYLE[bill.status] : 'bg-ui-04';
</script>

<article class="keen-slider__slide max-w-[288px] min-w-[288px] bg-white body-01">
	<header class="p-6">
		<h3 class="heading-02 rounded-full py-1 px-2 mb-3 w-fit {headerStyle}">
			{'status' in bill ? bill.status : bill.category}
		</h3>
		<p class="flex items-center gap-1 mb-3">
			<span class="fluid-heading-05">{bill.count}</span>
			<span>ฉบับ</span>
		</p>
		<p class="label-01 text-gray-60 mb-[2px]">
			<span class="heading-01 mr-[2px]"
				>{((bill.count / totalCount) * 100).toLocaleString('th-TH', {
					maximumFractionDigits: 2
				})}%</span
			>
			<span>ของทั้งหมดที่เข้าสภา</span>
		</p>
		<div class="h-2 bg-ui-01">
			<div class="h-full {barStyle}" style:width={(bill.count / totalCount) * 100 + '%'} />
		</div>
	</header>
	<div class="card-body p-6 pt-3 bg-ui-01 body-01">
		<span class="block text-text-03 mb-1">เช่น</span>
		<ul class="flex flex-col gap-1 body-compact-01 list-disc list-outside ml-[2.1ch] mb-3">
			{#each bill.samples as sample}
				<li><a href="/bills/{sample.id}" class="text-gray-100 underline">{sample.nickname}</a></li>
			{/each}
		</ul>
		<a href="#a" class="flex items-center gap-1 helper-text-01 text-link-01 underline"
			><span>ดูทั้งหมด</span><ArrowRight /></a
		>
	</div>
</article>

<style>
	.card-body {
		box-shadow: inset -2px 0 0 #fff, inset 2px 0 0 #fff, inset 0 -2px 0 #fff;
	}
</style>
