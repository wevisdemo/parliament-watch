<script lang="ts">
	import BillCard from '$components/BillCard/BillCard.svelte';
	import LawStatusCard from '$components/LawStatusCard/LawStatusCard.svelte';
	import { ArrowRight, Close } from 'carbon-icons-svelte';
	import Carousel from './Carousel.svelte';
	import { Button, InlineLoading } from 'carbon-components-svelte';
	import { graphql } from '$lib/politigraph/client';
	import type { Bill, BillsConnection, BillWhere } from '$lib/politigraph/genql';
	import { onMount, type ComponentProps } from 'svelte';
	import { billStatusList } from '$lib/politigraph/bill/status';
	import Proposer from '$components/Proposer/Proposer.svelte';
	import { createBillFieldsForProposer, getBillProposer } from '$lib/politigraph/bill/proposer';
	interface BillSummary {
		billsConnection: Pick<BillsConnection, 'totalCount'>;
		bills: Pick<Bill, 'id' | 'title' | 'nickname'>[];
	}

	export let billCategories: string[] = [];
	export let mpTermChoices: {
		id: string;
		value: string;
		founding_date?: string;
		dissolution_date?: string;
	}[] = [];

	const ALL_CATEGORY_KEY = 'ทุกหมวด';
	const MAX_BILL_BY_STATUS = 3;
	const MAX_ENACTED_BILL = 10;

	let selectedCategory = ALL_CATEGORY_KEY;
	$: selectedMpTermId = mpTermChoices[0].id ?? '';

	let isLoading = true;
	let carousalKey = '';
	let billSummaryByStatus: BillSummary[] = [];
	let lastEnactedBills: Pick<Bill, 'id' | 'title' | 'nickname' | 'proposal_date'>[] = [];
	let lastEnactedBillProposers: ComponentProps<Proposer>['proposer'][] = [];

	// TODO: We didn't handle MERGED status in Politigraph yet
	const displayedStatuses = billStatusList.filter((status) => status !== 'MERGED');

	onMount(() => {
		loadBills(selectedCategory, selectedMpTermId);
	});

	async function loadBills(category: string, mpTermId: string) {
		isLoading = true;

		const queryCategory = category == ALL_CATEGORY_KEY ? undefined : category;
		const queryTerm = mpTermChoices.find((mp) => mp.id === mpTermId);

		const billConditions: BillWhere = {
			...(queryCategory && {
				categories_INCLUDES: category
			}),
			...(queryTerm?.founding_date && { proposal_date_GTE: queryTerm.founding_date }),
			...(queryTerm?.dissolution_date && {
				proposal_date_LTE: queryTerm.dissolution_date
			})
		};

		billSummaryByStatus = await Promise.all(
			displayedStatuses.map((status) => {
				const where: BillWhere = {
					status_EQ: status,
					...billConditions
				};

				return graphql.query({
					billsConnection: {
						__args: { where },
						totalCount: true
					},
					bills: {
						__args: { where, sort: [{ proposal_date: 'DESC' }], limit: MAX_BILL_BY_STATUS },
						id: true,
						title: true,
						nickname: true
					}
				});
			})
		);

		lastEnactedBills = (
			await graphql.query({
				billEnactEvents: {
					__args: {
						where: {
							NOT: { start_date_EQ: null },
							bills_ALL: billConditions
						},
						sort: [{ start_date: 'DESC' }],
						limit: MAX_ENACTED_BILL
					},
					bills: {
						id: true,
						title: true,
						nickname: true,
						proposal_date: true
					}
				}
			})
		).billEnactEvents.map((event) => event.bills[0]);

		lastEnactedBillProposers = (
			await Promise.all(
				lastEnactedBills.map(({ id, proposal_date }) =>
					graphql.query({
						bills: {
							__args: {
								where: {
									id_EQ: id
								},
								limit: 1
							},
							...createBillFieldsForProposer(proposal_date)
						}
					})
				)
			)
		).map(({ bills }) => getBillProposer(bills[0]));

		isLoading = false;
		carousalKey = selectedMpTermId + selectedCategory;
	}

	function selectCategory(category: string) {
		selectedCategory = category;
		loadBills(selectedCategory, selectedMpTermId);
	}

	function selectMpTerm(mptermId: string) {
		selectedMpTermId = mptermId;
		loadBills(selectedCategory, selectedMpTermId);
	}

	$: totalCount = billSummaryByStatus.reduce(
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
		{#if billCategories.length}
			<div class="flex flex-col gap-2 md:flex-row">
				<h3 class="fluid-heading-04 text-nowrap">เลือกดู</h3>
				<div class="flex flex-row flex-wrap items-center gap-1">
					{#each [ALL_CATEGORY_KEY, ...billCategories] as category (category)}
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

		{#if billSummaryByStatus.length}
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
						{@const { bills, billsConnection } = billSummaryByStatus[i]}
						{#if bills.length}
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
						{/if}
					{/each}
				</Carousel>
			{/key}
		{/if}
	</div>

	{#if lastEnactedBills.length}
		<div class="flex flex-col gap-4">
			<div class="flex flex-row flex-wrap items-center gap-1">
				<h3 class="heading-02">{lastEnactedBills.length} ฉบับล่าสุดที่ได้บังคับใช้</h3>
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
					{#each lastEnactedBills as { id, title, nickname, proposal_date }, i (id)}
						<BillCard
							class="keen-slider__slide min-w-72"
							orientation="portrait"
							{id}
							nickname={nickname ?? title}
							title={nickname ? title : null}
							status="ENACTED"
							proposedOn={proposal_date ? new Date(proposal_date) : null}
							proposer={lastEnactedBillProposers[i]}
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
