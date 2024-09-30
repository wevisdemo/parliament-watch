<script lang="ts">
	import DataPeriodRemark from '$components/DataPeriodRemark.svelte';
	import AboutSection from '$components/Promise/Home/AboutSection.svelte';
	import ContentSection from '$components/Promise/Home/ContentSection.svelte';
	import PromiseExploreSection from '$components/Promise/Home/PromiseExploreSection.svelte';
	import PromiseMovementSection from '$components/Promise/Home/PromiseMovementSection.svelte';
	import { Breadcrumb, BreadcrumbItem } from 'carbon-components-svelte';

	export let data;

	$: ({ cabinet, activeCount, count, byStatus, byCategory, promiseSummaries } = data);

	let defaultFilterBy = {
		status: 'ทุกสถานะ',
		party: 'ทุกพรรค',
		category: 'ทุกหมวด',
		search: ''
	};

	let filterBy = { ...defaultFilterBy };

	const handleViewAll = (
		event: CustomEvent<{ status?: string; party?: string; category?: string }>
	): void => {
		const newFilter = event.detail;

		filterBy = {
			...defaultFilterBy,
			...newFilter
		};

		const movementSection = document.getElementById('explore');
		if (movementSection) {
			movementSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	};
</script>

<ContentSection id="breadcrumb">
	<Breadcrumb
		noTrailingSlash
		class="my-[8px] [&>.bx--breadcrumb]:flex [&>.bx--breadcrumb]:flex-wrap"
	>
		<BreadcrumbItem href="/">หน้าหลัก</BreadcrumbItem>
		<BreadcrumbItem>ติดตามคำสัญญาของรัฐบาล</BreadcrumbItem>
	</Breadcrumb>
</ContentSection>

<ContentSection id="header">
	<div class="flex flex-col items-center gap-4 px-6 py-8 md:px-12 lg:px-16">
		<p class="fluid-heading-05 text-center">ติดตามคำสัญญาของรัฐบาล</p>
		<p class="heading-compact-01 hidden max-w-[800px] text-center md:block">
			[what is this project and why do we track ] Lorem ipsum dolor sit amet consectetur. Leo varius
			lacus neque placerat. Viverra at arcu ullamcorper arcu. Non nulla scelerisque enim in id
			bibendum vehicula lectus sit.
		</p>
		<div
			class="flex max-w-[800px] flex-col items-center gap-1 pt-3 text-text-02 md:border-t md:border-ui-03"
		>
			<p class="heading-01 hidden md:block">ที่มาและข้อจำกัดข้อมูล</p>
			<p class="label-01 hidden text-center md:block">
				[about 'Promise' and 'Progress' that we track and not track] Lorem ipsum dolor sit amet
				consectetur. Leo varius lacus neque placerat. Viverra at arcu ullamcorper arcu. Non nulla
				scelerisque enim in id bibendum vehicula lectus sit.
			</p>
			<div class="flex gap-2 md:hidden">
				<DataPeriodRemark />
				<a href="/" class="helper-text-01 underline">ที่มาและข้อจำกัดข้อมูล</a>
			</div>
		</div>
	</div>
</ContentSection>

<ContentSection id="about">
	<AboutSection {cabinet} />
</ContentSection>

<ContentSection id="movement">
	<PromiseMovementSection
		{activeCount}
		{count}
		{byStatus}
		{byCategory}
		on:buttonClick={handleViewAll}
	/>
</ContentSection>

<div class="bg-ui-01">
	<PromiseExploreSection
		selectedStatus={filterBy.status}
		selectedParty={filterBy.party}
		selectedCategory={filterBy.category}
		searchTerm={filterBy.search}
		{promiseSummaries}
	/>
</div>
