<script lang="ts">
	import BillCard from '$components/BillCard/BillCard.svelte';
	import Carousel from '$components/Index/Carousel.svelte';
	import LawStatusCard from '$components/LawStatusCard/LawStatusCard.svelte';
	import SearchInput from '$components/SearchInput/SearchInput.svelte';
	import SearchResult from '$components/SearchResult/SearchResult.svelte';
	import ModalLawProcess from '$components/bills/ModalLawProcess.svelte';
	import { SearchIndexCategory, type SearchResults } from '$models/search';
	import { Breadcrumb, BreadcrumbItem, Search } from 'carbon-components-svelte';
	import ArrowRight from 'carbon-icons-svelte/lib/ArrowRight.svelte';
	import LawIcom from '../../components/icons/LawIcon.svelte';

	export let data;

	let searchResults: SearchResults | null;
</script>

<Breadcrumb
	noTrailingSlash
	class="px-4 py-2 body-compact-01 [&>.bx--breadcrumb]:flex [&>.bx--breadcrumb]:flex-wrap"
>
	<BreadcrumbItem href="/">หน้าหลัก</BreadcrumbItem>
	<BreadcrumbItem href="/bills" isCurrentPage>สำรวจร่างกฎหมายในสภา</BreadcrumbItem>
</Breadcrumb>
<header class="flex flex-col items-center text-center gap-2 px-4 py-10">
	<LawIcom width="36" height="36" />
	<h1 class="fluid-heading-05 text-balance">สำรวจร่างกฎหมายในสภา</h1>
	<div class="flex flex-wrap items-baseline justify-center gap-2 label-01">
		<span class="text-text-02"
			>อัปเดตข้อมูล: {new Date().toLocaleDateString('th-TH', { dateStyle: 'medium' })}</span
		>
		<a href="#a" class="underline">ที่มาและข้อจำกัดข้อมูล</a>
	</div>
</header>
<section class="flex flex-col gap-2 px-4 py-6 max-w-[1280px] mx-auto">
	<h2 class="fluid-heading-03">ค้นด้วยชื่อ</h2>
	<div class="relative">
		<SearchInput
			as={Search}
			light
			placeholder="ชื่อร่างกฎหมาย หรือ ชื่อผู้เสนอร่าง"
			categories={[SearchIndexCategory.Bills, SearchIndexCategory.BillProposers]}
			bind:searchResults
		/>
		{#if searchResults}
			<!-- TODO: Link Bills to Explore Page -->
			<SearchResult {searchResults} class="w-full absolute left-0 z-10" />
		{/if}
	</div>
	<p class="body-compact-01 text-text-03">เช่น สุราก้าวหน้า หรือ เท่าภิภพ ลิ้มจิตรกร</p>
</section>
<div class="bg-ui-01">
	<section class="flex flex-col gap-3 px-4 py-6 max-w-[1280px] mx-auto">
		<header class="flex flex-col items-start justify-between flex-wrap md:flex-row">
			<h2 class="fluid-heading-03">สำรวจตามสถานะ</h2>
			<ModalLawProcess class="text-right" />
		</header>
		<Carousel
			options={{
				loop: false,
				slides: { perView: 'auto', spacing: 12 },
				breakpoints: {
					'(min-width: 1200px)': {
						slides: {
							perView: 4,
							spacing: 12
						}
					}
				}
			}}
		>
			{#each data.byStatus as bill}
				<LawStatusCard totalCount={data.totalCount} {bill} />
			{/each}
		</Carousel>
	</section>
	<section class="flex flex-col gap-3 px-4 py-6 max-w-[1280px] mx-auto">
		<header>
			<h2 class="fluid-heading-03">สำรวจตามหมวด</h2>
			<p class="body-01">ร่างกฎหมาย 1 ฉบับมีได้มากกว่า 1 หมวด</p>
		</header>
		<Carousel options={{ loop: false, slides: { perView: 'auto', spacing: 12 }, breakpoints: {} }}>
			{#each data.byCategory as bill}
				<LawStatusCard totalCount={data.totalCount} {bill} />
			{/each}
		</Carousel>
	</section>
	<section class="flex flex-col gap-3 px-4 py-6 max-w-[1280px] mx-auto">
		<h2 class="fluid-heading-03">สำรวจตามประเภทผู้เสนอ</h2>
		<Carousel
			options={{
				loop: false,
				slides: { perView: 'auto', spacing: 12 },
				breakpoints: {
					'(min-width: 900px)': {
						slides: {
							perView: 3,
							spacing: 12
						}
					}
				}
			}}
		>
			{#each data.byProposerType as bill}
				<LawStatusCard totalCount={data.totalCount} {bill} />
			{/each}
		</Carousel>
	</section>
</div>
<div class="bg-teal-80">
	<section class="flex flex-col gap-3 px-4 py-10 max-w-[1280px] mx-auto">
		<h2 class="fluid-heading-03 text-white">5 ฉบับล่าสุดที่ได้ออกเป็นกฏหมาย</h2>
		<Carousel
			options={{
				loop: false,
				slides: { perView: 'auto', spacing: 12 },
				breakpoints: {
					'(min-width: 1300px)': {
						slides: {
							perView: 5,
							spacing: 12
						}
					}
				}
			}}
		>
			{#each data.latestEnactedBills as bill}
				<BillCard
					class="keen-slider__slide"
					orientation="portrait"
					{...bill}
					billUrl="/bills/{bill.id}"
				/>
			{/each}
		</Carousel>
	</section>
</div>
<div class="pt-6 pb-20 px-4">
	<a
		href="#a"
		class="flex items-end justify-between gap-4 max-w-[1280px] w-full mx-auto fluid-heading-04 p-4 bg-blue-60 hover:bg-blue-70 focus:bg-blue-70 text-white"
	>
		<span>ดูร่างกฎหมายทั้งหมดในสภา</span>
		<ArrowRight />
	</a>
</div>
