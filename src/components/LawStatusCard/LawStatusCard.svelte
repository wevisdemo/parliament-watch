<script lang="ts">
	import GeneralIcon from '$components/icons/GeneralIcon.svelte';
	import PeopleIcon from '$components/icons/PeopleIcon.svelte';
	import PoliticianIcon from '$components/icons/PoliticianIcon.svelte';
	import { BillProposerType, BillStatus } from '$models/bill';
	import ArrowRight from 'carbon-icons-svelte/lib/ArrowRight.svelte';
	import DocumentUnknown from 'carbon-icons-svelte/lib/DocumentUnknown.svelte';
	import type {
		BillsByCategory,
		BillsByProposerType,
		BillsByStatus
	} from '../../routes/bills/+page.server';

	export let totalCount: number;
	export let bill: BillsByStatus | BillsByCategory | BillsByProposerType;

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

	let billParams: [string, string];
	$: billParams =
		'status' in bill
			? ['status', bill.status]
			: 'category' in bill
				? ['category', bill.category]
				: ['proposertype', bill.proposerType];
</script>

<article class="keen-slider__slide body-01 flex min-w-[288px] max-w-[288px] flex-col bg-white">
	<header class="p-6">
		{#if 'proposerType' in bill}
			<div class="mb-3 flex items-center gap-1">
				<div class="h-6 w-6 rounded-full bg-black p-1 text-white">
					{#if bill.proposerType === BillProposerType.Politician}
						<GeneralIcon />
					{:else if bill.proposerType === BillProposerType.People}
						<PeopleIcon />
					{:else if bill.proposerType === BillProposerType.Assembly}
						<PoliticianIcon />
					{:else}
						<DocumentUnknown />
					{/if}
				</div>
				<h3 class="heading-02">{bill.proposerType}</h3>
			</div>
		{:else}
			<h3 class="heading-02 mb-3 w-fit rounded-full px-2 py-1 {headerStyle}">
				{'status' in bill ? bill.status : bill.category}
			</h3>
		{/if}
		<p class="mb-3 flex items-center gap-1">
			<span class="fluid-heading-05">{bill.count}</span>
			<span>ฉบับ</span>
		</p>
		{#if 'proposerType' in bill}
			<ul>
				{#each [BillStatus.InProgress, BillStatus.Enacted, BillStatus.Rejected, BillStatus.Merged] as status}
					{@const relatedBillCount = bill.countByStatus[status] || 0}
					{#if relatedBillCount > 0}
						<li class="mb-2">
							<span class="mb-[2px] flex items-center gap-[2px] text-gray-60">
								<span class="heading-01">{relatedBillCount}</span>
								<span class="label-01">{status}</span>
							</span>
							<div
								class="h-1 {BAR_STYLE[status]}"
								style:width="{bill.count ? (relatedBillCount / bill.count) * 100 : 0}%"
							/>
						</li>
					{/if}
				{/each}
			</ul>
		{:else}
			<p class="label-01 mb-[2px] text-gray-60">
				<span class="heading-01 mr-[2px]"
					>{((bill.count / totalCount) * 100).toLocaleString('th-TH', {
						maximumFractionDigits: 2
					})}%</span
				>
				<span>ของทั้งหมดที่เข้าสภา</span>
			</p>
			<div class="h-2 bg-ui-01">
				<div class="h-full {barStyle}" style:width="{(bill.count / totalCount) * 100}%" />
			</div>
		{/if}
	</header>
	{#if bill.count > 0}
		<div class="card-body body-01 flex-1 bg-ui-01 p-6 pt-3">
			<span class="mb-1 block text-text-03">เช่น</span>
			<ul class="body-compact-01 mb-3 ml-[2.1ch] flex list-outside list-disc flex-col gap-1">
				{#each bill.samples as sample}
					<li>
						<a href="/bills/{sample.id}" class="text-gray-100 underline">{sample.nickname}</a>
					</li>
				{/each}
			</ul>
			<a
				href="/bills/explore?{billParams[0]}={encodeURIComponent(billParams[1])}"
				class="helper-text-01 flex items-center gap-1 text-link-01 underline"
				><span>ดูทั้งหมด</span><ArrowRight /></a
			>
		</div>
	{/if}
</article>

<style>
	.card-body {
		box-shadow:
			inset -2px 0 0 #fff,
			inset 2px 0 0 #fff,
			inset 0 -2px 0 #fff;
	}
</style>
