<script lang="ts">
	import AboutSection from '$components/Promise/Home/AboutSection.svelte';
	import ContentSection from '$components/Promise/Home/ContentSection.svelte';
	import PromiseExporeSection from '$components/Promise/Home/PromiseExporeSection.svelte';
	import PromiseMovementSection from '$components/Promise/Home/PromiseMovementSection.svelte';
	import { formatThaiDate } from '$lib/date-parser';
	import { Breadcrumb, BreadcrumbItem } from 'carbon-components-svelte';

	export let data;
	$: ({ cabinet, activeCount, count, byStatus, byCategory, promiseSummaries } = data);
</script>

<ContentSection>
	<Breadcrumb
		noTrailingSlash
		class="my-[8px] [&>.bx--breadcrumb]:flex [&>.bx--breadcrumb]:flex-wrap"
	>
		<BreadcrumbItem href="/">หน้าหลัก</BreadcrumbItem>
		<BreadcrumbItem>ติดตามคำสัญญาของรัฐบาล</BreadcrumbItem>
	</Breadcrumb>
</ContentSection>

<ContentSection>
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
			<p class="label-01 text-secondary md:hidden">
				อัพเดตข้อมูล: {formatThaiDate(new Date(), true)}&nbsp;
				<a href="/" class="helper-text-01 underline">ที่มาและข้อจำกัดข้อมูล</a>
			</p>
		</div>
	</div>
</ContentSection>

<ContentSection>
	<AboutSection {cabinet} />
</ContentSection>

<ContentSection>
	<PromiseMovementSection {activeCount} {count} {byStatus} {byCategory} />
</ContentSection>

<div class="bg-ui-01">
	<PromiseExporeSection {promiseSummaries} />
</div>
