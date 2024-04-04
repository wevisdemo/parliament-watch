<script lang="ts" context="module">
	import { BillStatus, type Bill } from '$models/bill';

	export const ALL_CATEGORY_KEY = 'ทุกหมวด';

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
	import Carousel from './Carousel.svelte';

	const MAX_ENACTED_BILL_PER_VIEW = 5;

	export let billByCategoryAndStatus: BillByCategoryAndStatus;

	let selectedCategory: string = ALL_CATEGORY_KEY;

	$: billsBySelectedCategory = billByCategoryAndStatus.get(selectedCategory);
</script>

{#if billsBySelectedCategory}
	{@const billsByStatus = [...billsBySelectedCategory.billsByStatus.entries()].map(
		([status, bill]) => ({ status, ...bill })
	)}
	{@const lastestBills = [...billsBySelectedCategory.billsByStatus.values()]
		.flatMap(({ samples }) => samples)
		.sort((a, z) => z.proposedOn.getTime() - a.proposedOn.getTime())}

	<Carousel
		options={{
			loop: false,
			slides: { perView: 'auto', spacing: 12 },
			breakpoints: {
				'(min-width: 1200px)': {
					slides: {
						perView: billsByStatus.length,
						spacing: 12
					}
				}
			}
		}}
	>
		{#each billsByStatus as bill}
			<LawStatusCard
				totalCount={billByCategoryAndStatus.get(ALL_CATEGORY_KEY)?.count || 0}
				{bill}
			/>
		{/each}
	</Carousel>

	<h3 class="heading-02">{lastestBills.length} ฉบับล่าสุดที่ได้บังคับใช้</h3>

	<Carousel
		options={{
			loop: false,
			slides: { perView: 'auto', spacing: 12 },
			breakpoints: {
				'(min-width: 1300px)': {
					slides: {
						perView: MAX_ENACTED_BILL_PER_VIEW,
						spacing: 12
					}
				}
			}
		}}
	>
		{#each lastestBills as bill}
			<BillCard class="keen-slider__slide min-w-72" orientation="portrait" {bill} />
		{/each}
	</Carousel>
{/if}
