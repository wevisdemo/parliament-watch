<script lang="ts">
	import { PromiseStatus } from '$models/promise';
	import { createEventDispatcher } from 'svelte';
	import type { PromisesByCategory, PromisesByStatus } from '../../../routes/promises/+page.server';
	import OtherStatusCard from './OtherStatusCard.svelte';
	import PromiseCategoryCard from './PromiseCategoryCard.svelte';
	import PromiseStatusCard from './PromiseStatusCard.svelte';
	import { ChevronLeft, ChevronRight } from 'carbon-icons-svelte';

	export let activeCount: number;
	export let count: number;
	export let byStatus: PromisesByStatus[];
	export let byCategory: PromisesByCategory[];

	byCategory = byCategory.sort((a, b) => b.count - a.count);

	$: inProgress = byStatus.find((p) => p.status === PromiseStatus.inProgress);
	$: fulfilled = byStatus.find((p) => p.status === PromiseStatus.fulfilled);
	$: unhonored = byStatus.find((p) => p.status === PromiseStatus.unhonored);
	$: notStarted = byStatus.find((p) => p.status === PromiseStatus.notStarted);
	$: clarifying = byStatus.find((p) => p.status === PromiseStatus.clarifying);

	$: maxStatusCount = Math.max(
		inProgress?.count || 0,
		fulfilled?.count || 0,
		unhonored?.count || 0
	);

	$: maxGroupCnt = Math.max(...byCategory.map((c) => c.count));

	let scrollContainer: HTMLDivElement;
	let showLeftButton = false;
	let showRightButton = true;

	const checkScrollPosition = () => {
		const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;

		showLeftButton = scrollLeft > 0;
		showRightButton = scrollLeft < scrollWidth - clientWidth;
	};
	const scrollLeft = () => {
		scrollContainer.scrollBy({ left: -300, behavior: 'smooth' });
		checkScrollPosition();
	};
	const scrollRight = () => {
		scrollContainer.scrollBy({ left: 300, behavior: 'smooth' });
		checkScrollPosition();
	};

	const dispatch = createEventDispatcher<{ buttonClick: { [key: string]: string } }>();

	const handleClickViewAll = (event: CustomEvent<{ [key: string]: string }>): void => {
		const newFilter = event.detail;
		dispatch('buttonClick', newFilter);
	};
</script>

<div class="flex flex-col">
	<div class="flex flex-col items-center gap-1 pt-8">
		<p class="fluid-heading-04">คำสัญญาที่พบความเคลื่อนไหว</p>
		<p class="fluid-display-01">{activeCount}</p>
		<p class="body-01">จากทั้งหมด <b>{count} คำสัญญา</b></p>
	</div>
	<div class="flex flex-col py-3">
		<p class="heading-02 border-t border-ui-03 py-2 text-text-02">แบ่งตามสถานะ</p>
		<div class="flex flex-col gap-4 md:flex-row">
			<div class="md:basis-1/3">
				<PromiseStatusCard
					status="กำลังดำเนินการ"
					statusCnt={inProgress?.count || 0}
					description="คำสัญญาที่เราตรวจพบข้อมูลความคืบหน้าของการดำเนินงานโดยรัฐบาล"
					max={maxStatusCount}
					color="bg-yellow-20"
					samples={inProgress?.samples}
					on:buttonClick={handleClickViewAll}
				/>
			</div>
			<div class="solid border-t border-ui-03 md:block md:border-l" />
			<div class="md:basis-1/3">
				<PromiseStatusCard
					status="ดำเนินการแล้ว"
					statusCnt={fulfilled?.count || 0}
					description="คำสัญญาที่เราตรวจพบความคืบหน้าของการดำเนินงานโดยรัฐบาล และเกิดผลลัพธ์ตามคำสัญญาที่ได้ให้ไว้ในช่วงหาเสียง"
					max={maxStatusCount}
					color="bg-green-50"
					samples={fulfilled?.samples}
					on:buttonClick={handleClickViewAll}
				/>
			</div>
			<div class="solid border-t border-ui-03 md:block md:border-l" />
			<div class="md:basis-1/3">
				<PromiseStatusCard
					status="เลิกดำเนินการ"
					statusCnt={unhonored?.count || 0}
					description="คำสัญญาที่พบว่ามีการกระทำหรือเหตุการณ์ ที่สรุปได้ว่ารัฐบาลเลิกดำเนินการ หรือไม่สามารถทำตามคำสัญญาต่อได้"
					max={maxStatusCount}
					color="bg-magenta-50"
					samples={unhonored?.samples}
					on:buttonClick={handleClickViewAll}
				/>
			</div>
		</div>
	</div>
	<div class="flex flex-col gap-3 py-3">
		<div>
			<p class="heading-02 border-t border-ui-03 py-2 text-text-02">แบ่งตามหมวด</p>
			<p class="body-01 text-text-02">1 คำสัญญามีได้มากกว่า 1 หมวด</p>
		</div>
		<div class="relative">
			<button
				class="absolute -left-3 top-1/2 -translate-y-1/2 transform md:-left-8"
				on:click={scrollLeft}
				aria-label="Scroll Left"
				hidden={!showLeftButton}
			>
				<ChevronLeft size={32} />
			</button>
			<div
				class="no-scrollbar overflow-x-autl flex gap-3 overflow-y-hidden"
				bind:this={scrollContainer}
				on:scroll={checkScrollPosition}
			>
				{#each byCategory as c, index}
					<PromiseCategoryCard
						categoryName={c.category}
						inProgressCnt={c.byStatuses.กำลังดำเนินการ}
						fulfilledCnt={c.byStatuses.ดำเนินการแล้ว}
						unhonored={c.byStatuses.เลิกดำเนินการ}
						totalCnt={c.count}
						max={maxGroupCnt}
						on:buttonClick={handleClickViewAll}
					/>
					{#if index < byCategory.length - 1}
						<div class="solid border-l border-ui-03 md:block" />
					{/if}
				{/each}
			</div>
			<button
				class="absolute -right-3 top-1/2 -translate-y-1/2 transform md:-right-8"
				on:click={scrollRight}
				aria-label="Scroll Right"
				hidden={!showRightButton}
			>
				<ChevronRight size={32} />
			</button>
		</div>
	</div>
	<div class="flex flex-col gap-4 py-6 md:flex-row">
		<div class="flex md:basis-1/2">
			<OtherStatusCard
				title="คำสัญญาที่ไม่พบความเคลื่อนไหว"
				status="ไม่พบความเคลื่อนไหว"
				statusCnt={notStarted?.count || 0}
				samples={notStarted?.samples}
				description="เกิดจาก..Lorem ipsum dolor sit amet consectetur. Est ornare ultrices eget varius sapien.
					Morbi nunc at aenean risus scelerisque pretium neque at. Id aliquam volutpat nulla eget
					etiam suspendisse at neque. Pellentesque massa adipiscing elit consequat at viverra est."
				on:buttonClick={handleClickViewAll}
			/>
		</div>

		<div class="flex md:basis-1/2">
			<OtherStatusCard
				title="คำสัญญาที่รอคำชี้แจงเพิ่มเติม"
				status="รอคำชี้แจงเพิ่มเติม"
				statusCnt={clarifying?.count || 0}
				samples={clarifying?.samples}
				description="เกิดจาก..Lorem ipsum dolor sit amet consectetur. Est ornare ultrices eget varius sapien.
				Morbi nunc at aenean risus scelerisque pretium neque at. Id aliquam volutpat nulla eget
				etiam suspendisse at neque. Pellentesque massa adipiscing elit consequat at viverra est."
				on:buttonClick={handleClickViewAll}
			/>
		</div>
	</div>
</div>

<style>
	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}
	.no-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>
