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

	type MpTerm = {
		name: string;
		custom_name?: string;
		founding_date: string | null;
		dissolution_date: string | null;
		term: number | null;
	};

	let mpterm_display_name = (mp: MpTerm) => {
		const s = `สส. ชุดที่ ${mp.term}`;

		const toBE2Digits = (year?: number) =>
			year ? ((year + 543) % 100).toString().padStart(2, '0') : undefined;

		const foundingYear = mp.founding_date
			? toBE2Digits(new Date(mp.founding_date).getFullYear())
			: undefined;
		const dissolutionYear = mp.dissolution_date
			? toBE2Digits(new Date(mp.dissolution_date).getFullYear())
			: undefined;

		if (!foundingYear && !dissolutionYear) return s;
		if (!foundingYear && dissolutionYear) return `${s} (ก่อนปี ${dissolutionYear})`;
		if (foundingYear && dissolutionYear) return `${s} (ปี ${foundingYear} - ${dissolutionYear})`;
		if (foundingYear && !dissolutionYear) return `${s} (ปี ${foundingYear} - ปัจจุบัน)`;

		return s;
	};

	export let billCategories: string[] = [];
	export let mpTerms: MpTerm[] = [];

	const ALL_CATEGORY_KEY = 'ทุกหมวด';
	const OTHER_TERM_KEY: MpTerm = {
		name: 'other_terms',
		custom_name: 'สส. ชุดอื่น ๆ (ก่อนปี 62)',
		founding_date: null,
		dissolution_date: '2019-03-24',
		term: 0
	};
	const MAX_BILL_BY_STATUS = 3;
	const MAX_ENACTED_BILL = 10;

	let all_mp_choices = [...mpTerms, OTHER_TERM_KEY];

	let selectedCategory: string = ALL_CATEGORY_KEY;
	let selectedMpTerm: string = mpTerms.length > 0 ? mpTerms[0].name : '';
	let isLoading = true;
	let billSummaryByStatus: BillSummary[] = [];
	let lastEnactedBills: Pick<Bill, 'id' | 'title' | 'nickname' | 'proposal_date'>[] = [];
	let lastEnactedBillProposers: ComponentProps<Proposer>['proposer'][] = [];

	// TODO: We didn't handle MERGED status in Politigraph yet
	const displayedStatuses = billStatusList.filter((status) => status !== 'MERGED');

	onMount(() => {
		loadBills();
	});

	async function loadBills(category?: string, mpTerm?: string) {
		isLoading = true;

		let query_category = category == ALL_CATEGORY_KEY ? undefined : category;

		let date_from = all_mp_choices.find((mp) => mp?.name === mpTerm)?.founding_date;
		let date_until = all_mp_choices.find((mp) => mp?.name === mpTerm)?.dissolution_date;

		billSummaryByStatus = await Promise.all(
			displayedStatuses.map((status) => {
				const where: BillWhere = {
					status_EQ: status,
					...(query_category && {
						categories_INCLUDES: category
					}),
					...(mpTerm && {
						...(date_from && { proposal_date_GTE: date_from }),
						...(date_until && { proposal_date_LTE: date_until })
					})
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
							NOT: { start_date_EQ: null }
							// TODO: filter bill category
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
	}

	function selectCategory(category: string) {
		selectedCategory = category;
		loadBills(selectedCategory, selectedMpTerm);
	}

	function selectMpTerm(mpterm: string) {
		selectedMpTerm = mpterm;
		loadBills(selectedCategory, selectedMpTerm);
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

		{#if mpTerms.length}
			<div>
				<div class="flex flex-col gap-2 md:flex-row">
					<h3 class="fluid-heading-04 text-nowrap">เลือกสมัย</h3>
					<div class="flex flex-row flex-wrap items-center gap-1">
						{#each [...mpTerms, OTHER_TERM_KEY] as mpterm (mpterm.name)}
							<button
								class="helper-text-02 rounded-full border border-gray-80 px-3 py-1 {mpterm.name ===
								selectedMpTerm
									? 'bg-gray-80 text-white'
									: 'text-gray-80 hover:bg-gray-20'}"
								on:click={() => selectMpTerm(mpterm.name)}
							>
								{mpterm.custom_name ? mpterm.custom_name : mpterm_display_name(mpterm)}
							</button>
						{/each}
					</div>
				</div>
			</div>
		{/if}

		{#if billSummaryByStatus.length}
			{#key selectedCategory}
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

			{#key selectedCategory + isLoading}
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
