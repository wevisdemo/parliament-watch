<script lang="ts">
	import BillCard from '$components/BillCard/BillCard.svelte';
	import LawStatusCard from '$components/LawStatusCard/LawStatusCard.svelte';
	import { ArrowRight, Close } from 'carbon-icons-svelte';
	import Carousel from './Carousel.svelte';
	import { Button, InlineLoading } from 'carbon-components-svelte';
	import { graphql } from '$lib/politigraph';
	import { BillStatus } from '$models/bill';
	import type { Bill } from '$lib/politigraph/genql';
	import { onMount } from 'svelte';

	const ALL_CATEGORY_KEY = 'ทุกหมวด';
	const MAX_BILL_BY_STATUS = 3;
	const MAX_ENACTED_BILL = 10;

	const billStatusList = Object.values(BillStatus);

	export let billCategories: string[] = [];

	let selectedCategory: string = ALL_CATEGORY_KEY;
	let isLoading = true;
	let billsInSelectedCategory: Pick<
		Bill,
		'id' | 'title' | 'nickname' | 'status' | 'proposal_date'
	>[] = [];

	$: lastEnactedBills = billsInSelectedCategory
		.filter((bill) => bill.status === BillStatus.Enacted)
		.slice(0, MAX_ENACTED_BILL);

	onMount(() => {
		loadBills();
	});

	async function loadBills(category?: string) {
		isLoading = true;

		billsInSelectedCategory = (
			await graphql.query({
				bills: {
					__args: {
						...(category
							? {
									where: {
										categories_INCLUDES: category
									}
								}
							: {}),
						sort: [{ proposal_date: 'DESC' }]
					},
					id: true,
					title: true,
					nickname: true,
					status: true,
					proposal_date: true
				}
			})
		).bills;

		isLoading = false;
	}

	function selectCategory(category: string) {
		selectedCategory = category;
		loadBills(category === ALL_CATEGORY_KEY ? undefined : category);
	}
</script>

<div class="relative flex flex-col gap-6">
	{#if isLoading}
		<div class="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
			<InlineLoading class="flex items-center justify-center" />
		</div>
	{/if}

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
		>
			{#each billStatusList as status (status)}
				{@const bills = billsInSelectedCategory
					.filter((bill) => bill.status === status)
					.map(({ id, nickname, title }) => ({
						id,
						nickname: nickname ?? title ?? ''
					}))}
				<LawStatusCard
					totalCount={billsInSelectedCategory.length}
					bill={{
						status,
						samples: bills.slice(0, MAX_BILL_BY_STATUS),
						count: bills.length
					}}
				/>
			{/each}
		</Carousel>
	{/key}
</div>

<div class="flex flex-col space-y-4">
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

	{#if lastEnactedBills.length}
		{#key selectedCategory}
			<Carousel>
				{#each lastEnactedBills as { id, title, nickname, proposal_date } (id)}
					<BillCard
						class="keen-slider__slide min-w-72"
						orientation="portrait"
						{id}
						nickname={nickname ?? title}
						title={nickname ? title : null}
						status={BillStatus.Enacted}
						proposedOn={proposal_date ? new Date(proposal_date) : null}
					/>
				{/each}
			</Carousel>
		{/key}
	{/if}
</div>
<Button href="/bills" kind="secondary" icon={ArrowRight} class="w-full max-w-none">
	ดูร่างกฏหมายทั้งหมด
</Button>
