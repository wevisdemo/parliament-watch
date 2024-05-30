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
	class="body-compact-01 px-4 py-2 [&>.bx--breadcrumb]:flex [&>.bx--breadcrumb]:flex-wrap"
>
	<BreadcrumbItem href="/">หน้าหลัก</BreadcrumbItem>
	<BreadcrumbItem href="/bills" isCurrentPage>ร่างกฎหมายในสภา</BreadcrumbItem>
</Breadcrumb>
<header class="flex flex-col items-center gap-2 px-4 py-10 text-center">
	<LawIcom width="36" height="36" />
	<h1 class="fluid-heading-05 text-balance">สำรวจร่างกฎหมายในสภา</h1>
	<div class="label-01 flex flex-wrap items-baseline justify-center gap-2">
		<span class="text-text-02"
			>อัพเดตข้อมูล : {new Date().toLocaleDateString('th-TH', { dateStyle: 'medium' })}</span
		>
		<!-- TODO: Add link -->
		<!-- <a href="/" class="underline">ที่มาและข้อจำกัดข้อมูล</a> -->
	</div>
</header>
<section class="mx-auto flex max-w-[1280px] flex-col gap-2 px-4 py-6">
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
			<SearchResult {searchResults} class="absolute left-0 z-10 w-full" />
		{/if}
	</div>
	<p class="body-compact-01 text-text-03">เช่น สุราก้าวหน้า หรือ เท่าภิภพ ลิ้มจิตรกร</p>
</section>
<div class="bg-ui-01">
	<section class="mx-auto flex max-w-[1280px] flex-col gap-3 px-4 py-6">
		<header class="flex flex-col flex-wrap items-start justify-between md:flex-row">
			<h2 class="fluid-heading-03">สำรวจตามสถานะ</h2>
			<ModalLawProcess class="text-right" />
		</header>
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
			{#each data.byStatus as bill (bill.status)}
				<LawStatusCard totalCount={data.totalCount} {bill} />
			{/each}
		</Carousel>
	</section>
	<section class="mx-auto flex max-w-[1280px] flex-col gap-3 px-4 py-6">
		<header>
			<h2 class="fluid-heading-03">สำรวจตามหมวด</h2>
			<p class="body-01">ร่างกฎหมาย 1 ฉบับมีได้มากกว่า 1 หมวด</p>
		</header>
		<Carousel>
			{#each data.byCategory as bill}
				<LawStatusCard totalCount={data.totalCount} {bill} />
			{/each}
		</Carousel>
	</section>
	<section class="mx-auto flex max-w-[1280px] flex-col gap-3 px-4 py-6">
		<h2 class="fluid-heading-03">สำรวจตามประเภทผู้เสนอ</h2>
		<Carousel>
			{#each data.byProposerType as bill (bill.proposerType)}
				<LawStatusCard totalCount={data.totalCount} {bill} />
			{/each}
		</Carousel>
	</section>
</div>
<div class="bg-teal-80">
	<section class="mx-auto flex max-w-[1280px] flex-col gap-3 px-4 py-10">
		<h2 class="fluid-heading-03 text-white">
			{data.latestEnactedBills.length} ฉบับล่าสุดที่ได้ออกเป็นกฏหมาย
		</h2>
		<Carousel>
			{#each data.latestEnactedBills as bill (bill.id)}
				<BillCard class="keen-slider__slide min-w-72" orientation="portrait" {bill} />
			{/each}
		</Carousel>
	</section>
</div>
<div class="px-4 pb-20 pt-6">
	<a
		href="/bills/explore"
		class="fluid-heading-04 mx-auto flex w-full max-w-[1280px] items-end justify-between gap-4 bg-blue-60 p-4 text-white hover:bg-blue-70 focus:bg-blue-70"
	>
		<span>ดูร่างกฎหมายทั้งหมดในสภา</span>
		<ArrowRight />
	</a>
</div>
