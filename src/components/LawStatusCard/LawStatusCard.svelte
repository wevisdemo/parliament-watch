<script context="module" lang="ts">
	export interface BillSample {
		id: string;
		nickname: string;
	}
	export interface BillsByStatus {
		status: BillStatus;
		samples: BillSample[];
		count: number;
	}

	export interface BillsByCategory {
		category: string;
		samples: BillSample[];
		count: number;
	}

	export interface BillsByProposerType {
		proposerType: BillProposerType;
		samples: BillSample[];
		count: number;
		countByStatus: {
			[status in BillStatus]: number;
		};
	}
</script>

<script lang="ts">
	import GeneralIcon from '$components/icons/GeneralIcon.svelte';
	import PeopleIcon from '$components/icons/PeopleIcon.svelte';
	import PoliticianIcon from '$components/icons/PoliticianIcon.svelte';
	import { billStatusList, billStatusProperty } from '$lib/politigraph/bill/status';
	import type { BillStatus } from '$lib/politigraph/genql';
	import { BillProposerType } from '$models/bill';
	import ArrowRight from 'carbon-icons-svelte/lib/ArrowRight.svelte';
	import DocumentUnknown from 'carbon-icons-svelte/lib/DocumentUnknown.svelte';

	export let totalCount: number;
	export let bill: BillsByStatus | BillsByCategory | BillsByProposerType;

	$: headerStyle =
		bill.count > 0
			? 'status' in bill
				? billStatusProperty[bill.status].colorClass
				: 'border'
			: 'bg-ui-04 text-white';
	$: barStyle = 'status' in bill ? billStatusProperty[bill.status].colorClass : 'bg-ui-04';
	$: headerBackgroundColor = bill.count > 0 ? 'bg-white' : 'bg-ui-01';

	let billParams: [string, string];
	$: billParams =
		'status' in bill
			? ['status', bill.status]
			: 'category' in bill
				? ['category', bill.category]
				: ['proposertype', bill.proposerType];
</script>

<article
	class="keen-slider__slide body-01 flex min-w-[288px] max-w-[288px] flex-col border-2 border-white bg-ui-01"
>
	<header class="p-6 {headerBackgroundColor}">
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
				{'status' in bill ? billStatusProperty[bill.status].label : bill.category}
			</h3>
		{/if}
		{#if bill.count > 0}
			<p class="mb-3 flex items-center gap-1">
				<span class="fluid-heading-05">{bill.count}</span>
				<span>ฉบับ</span>
			</p>
			{#if 'proposerType' in bill}
				<ul>
					{#each billStatusList as status (status)}
						{@const relatedBillCount = bill.countByStatus[status] || 0}
						{#if relatedBillCount > 0}
							{@const { label, colorClass } = billStatusProperty[status]}
							<li class="mb-2">
								<span class="mb-[2px] flex items-center gap-[2px] text-gray-60">
									<span class="heading-01">{relatedBillCount}</span>
									<span class="label-01">{label}</span>
								</span>
								<div
									class="h-1 {colorClass ?? barStyle}"
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
		{/if}
	</header>
	{#if bill.count > 0}
		<div class="card-body body-01 flex-1 bg-ui-01 p-6 pt-3">
			<span class="mb-1 block text-text-03">เช่น</span>
			<ul class="body-compact-01 mb-3 ml-[2.1ch] flex list-outside list-disc flex-col gap-1">
				{#each bill.samples as sample (sample.id)}
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
	{:else}
		<div class="card-body body-01 flex-1 bg-ui-01 p-6 pt-3">
			<p class="label-01 w-full text-center text-gray-60">
				{#if 'proposerType' in bill}
					ไม่พบร่างกฎหมายจากผู้เสนอนี้
				{:else if 'status' in bill}
					ไม่พบร่างกฎหมายในสถานะนี้
				{:else}
					ไม่พบร่างกฎหมายที่เกี่ยวข้อง
				{/if}
			</p>
		</div>
	{/if}
</article>
