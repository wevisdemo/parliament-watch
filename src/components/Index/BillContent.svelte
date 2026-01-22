<script lang="ts">
	import BillCard from '$components/BillCard/BillCard.svelte';
	import LawStatusCard from '$components/LawStatusCard/LawStatusCard.svelte';
	import { ArrowRight, Close } from 'carbon-icons-svelte';
	import Carousel from './Carousel.svelte';
	import { Button, InlineLoading } from 'carbon-components-svelte';
	import { onMount } from 'svelte';
	import { billStatusList } from '$lib/politigraph/bill/status';
	import { ALL_CATEGORY_KEY } from '../../constants/bills';
	import type { BillOverviewData } from '../../routes/files/bills-overview/[repId]/[category].json/+server';

	export let billCategories: string[] = [];
	export let mpTermChoices: {
		id: string;
		value: string;
		founding_date?: string;
		dissolution_date?: string;
	}[] = [];

	let selectedCategory = ALL_CATEGORY_KEY;
	let selectedMpTermId = mpTermChoices[0].id ?? '';

	let isLoading = true;
	let carousalKey = '';
	let billOverview: BillOverviewData = {
		billSummaryByStatuses: [],
		lastEnactedBills: [],
		lastEnactedBillProposers: []
	};

	// TODO: We didn't handle MERGED status in Politigraph yet
	const displayedStatuses = billStatusList.filter((status) => status !== 'MERGED');

	onMount(() => {
		loadBillOverviewData();
	});

	async function loadBillOverviewData() {
		isLoading = true;

		billOverview = (await (
			await fetch(`/files/bills-overview/${selectedMpTermId}/${selectedCategory}.json`)
		).json()) as BillOverviewData;

		isLoading = false;
		carousalKey = selectedMpTermId + selectedCategory;
	}

	function selectCategory(category: string) {
		selectedCategory = category;
		loadBillOverviewData();
	}

	function selectMpTerm(mptermId: string) {
		selectedMpTermId = mptermId;
		loadBillOverviewData();
	}

	$: totalCount = billOverview.billSummaryByStatuses.reduce(
		(sum, byStatus) => sum + byStatus.billsConnection.totalCount,
		0
	);
</script>

<div class="relative flex flex-col gap-6">
	{#if isLoading}
		<div class="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
			<InlineLoading class="flex items-center justify-center" />
		</div>
	{/if}

	<div class="relative flex flex-col gap-4">
		{#if billCategories.length > 1}
			<div class="flex flex-col gap-2 md:flex-row">
				<h3 class="fluid-heading-04 text-nowrap">เลือกดู</h3>
				<div class="flex flex-row flex-wrap items-center gap-1">
					{#each billCategories as category (category)}
						<button
							class="helper-text-02 rounded-full border border-gray-80 px-3 py-1 {category ===
							selectedCategory
								? 'bg-gray-80 text-white'
								: 'text-gray-80 hover:bg-gray-20'}"
							on:click={() => selectCategory(category)}
						>
							{category}
						</button>
					{/each}
				</div>
			</div>
		{/if}

		{#if mpTermChoices.length}
			<div>
				<div class="flex flex-col gap-2 md:flex-row">
					<h3 class="fluid-heading-04 text-nowrap">เลือกสมัย</h3>
					<div class="flex flex-row flex-wrap items-center gap-1">
						{#each mpTermChoices as mpterm (mpterm.id)}
							<button
								class="helper-text-02 rounded-full border border-gray-80 px-3 py-1 {mpterm.id ===
								selectedMpTermId
									? 'bg-gray-80 text-white'
									: 'text-gray-80 hover:bg-gray-20'}"
								on:click={() => selectMpTerm(mpterm.id)}
							>
								{mpterm.value}
							</button>
						{/each}
					</div>
				</div>
			</div>
		{/if}

		{#if billOverview.billSummaryByStatuses.length}
			{#key carousalKey}
				<Carousel
					options={{
						breakpoints: {
							'(min-width: 672px)': {
								slides: {
									perView: 3,
									spacing: 12
								}
							}
						}
					}}
					hideNavigation={isLoading}
				>
					{#each displayedStatuses as status, i (status)}
						{@const { bills, billsConnection } = billOverview.billSummaryByStatuses[i]}
						<LawStatusCard
							{totalCount}
							bill={{
								status,
								samples: bills.map(({ id, nickname, title }) => ({
									id,
									nickname: nickname ?? title ?? ''
								})),
								count: billsConnection.totalCount
							}}
						/>
					{/each}
				</Carousel>
			{/key}
		{/if}
	</div>

	{#if billOverview.lastEnactedBills.length}
		<div class="flex flex-col gap-4">
			<div class="flex flex-row flex-wrap items-center gap-1">
				<h3 class="heading-02">{billOverview.lastEnactedBills.length} ฉบับล่าสุดที่ได้บังคับใช้</h3>
				{#if selectedCategory !== ALL_CATEGORY_KEY}
					<span class="body-02">ในหมวด</span>
					<div
						class="helper-text-02 flex flex-row items-center rounded-full border py-1 pl-3 pr-2 text-gray-80"
					>
						{selectedCategory}
						<button class="hover:text-gray-60" on:click={() => selectCategory(ALL_CATEGORY_KEY)}
							><Close /></button
						>
					</div>
				{/if}
			</div>

			{#key carousalKey}
				<Carousel hideNavigation={isLoading}>
					{#each billOverview.lastEnactedBills as { id, title, nickname, proposal_date, enact_date }, i (id)}
						<BillCard
							class="keen-slider__slide min-w-72"
							orientation="portrait"
							{id}
							nickname={nickname ?? title}
							title={nickname ? title : null}
							status="ENACTED"
							enactedOn={enact_date ? new Date(enact_date) : null}
							proposedOn={proposal_date ? new Date(proposal_date) : null}
							proposer={billOverview.lastEnactedBillProposers[i] ?? undefined}
						/>
					{/each}
				</Carousel>
			{/key}
		</div>
	{/if}
</div>

<Button href="/bills" kind="secondary" icon={ArrowRight} class="w-full max-w-none">
	ดูร่างกฏหมายทั้งหมด
</Button>
