<script lang="ts" context="module">
	import { BillStatus, type Bill } from '$models/bill';

	export const ALL_CATEGORY_KEY = 'ทุกหมวด';
	export const MAX_BILL_BY_STATUS = 3;

	export interface BillCategoryWithStatus {
		count: number;
		billsByStatus: Map<
			BillStatus,
			{
				samples: Bill[];
				count: number;
			}
		>;
	}

	export type BillByCategoryAndStatus = Map<string, BillCategoryWithStatus>;
</script>

<script lang="ts">
	import BillCard from '$components/BillCard/BillCard.svelte';
	import LawStatusCard from '$components/LawStatusCard/LawStatusCard.svelte';
	import { ArrowRight, Close } from 'carbon-icons-svelte';
	import Carousel from './Carousel.svelte';
	import { Button } from 'carbon-components-svelte';

	const billStatusList = Object.values(BillStatus);

	export let billByCategoryAndStatus: BillByCategoryAndStatus;

	let selectedCategory: string = ALL_CATEGORY_KEY;

	$: billsBySelectedCategory = billByCategoryAndStatus.get(selectedCategory);
	$: categories = [
		ALL_CATEGORY_KEY,
		...[...billByCategoryAndStatus.keys()]
			.filter((key) => key !== ALL_CATEGORY_KEY)
			.sort((a, z) => a.localeCompare(z))
	];
</script>

{#if billsBySelectedCategory}
	{@const billsByStatus = [...billsBySelectedCategory.billsByStatus.entries()]
		.map(([status, bill]) => ({
			status,
			...bill,
			samples: bill.samples.slice(0, MAX_BILL_BY_STATUS)
		}))
		.sort((a, z) => billStatusList.indexOf(a.status) - billStatusList.indexOf(z.status))}
	{@const lastestEnactedBills =
		billsBySelectedCategory.billsByStatus
			.get(BillStatus.Enacted)
			?.samples.sort((a, z) => z.proposedOn.getTime() - a.proposedOn.getTime()) || []}

	<div class="flex flex-col gap-2 md:flex-row">
		<h3 class="fluid-heading-04 text-nowrap">เลือกดู</h3>
		<div class="flex flex-row flex-wrap items-center gap-1">
			{#each categories as category}
				<button
					class="helper-text-02 rounded-full border border-gray-80 px-3 py-1 {category ===
					selectedCategory
						? 'bg-gray-80 text-white'
						: 'text-gray-80 hover:bg-gray-20'}"
					on:click={() => (selectedCategory = category)}
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
			{#each billsByStatus as bill (bill.status)}
				<LawStatusCard
					totalCount={billByCategoryAndStatus.get(ALL_CATEGORY_KEY)?.count || 0}
					{bill}
				/>
			{/each}
		</Carousel>
	{/key}

	<div class="flex flex-col space-y-4">
		<div class="flex flex-row flex-wrap items-center gap-1">
			<h3 class="heading-02">{lastestEnactedBills.length} ฉบับล่าสุดที่ได้บังคับใช้</h3>
			{#if selectedCategory !== ALL_CATEGORY_KEY}
				<span class="body-02">ในหมวด</span>
				<div
					class="helper-text-02 flex flex-row items-center rounded-full border py-1 pl-3 pr-2 text-gray-80"
				>
					{selectedCategory}
					<button class="hover:text-gray-60" on:click={() => (selectedCategory = ALL_CATEGORY_KEY)}
						><Close /></button
					>
				</div>
			{/if}
		</div>

		{#key selectedCategory}
			<Carousel>
				{#each lastestEnactedBills as bill (bill.id)}
					<BillCard class="keen-slider__slide min-w-72" orientation="portrait" {...bill} />
				{/each}
			</Carousel>
		{/key}
	</div>

	<Button href="/bills" kind="secondary" icon={ArrowRight} class="w-full max-w-none">
		ดูร่างกฏหมายทั้งหมด
	</Button>
{/if}
