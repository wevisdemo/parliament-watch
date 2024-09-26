<script lang="ts">
	import { page } from '$app/stores';
	import { Breadcrumb, BreadcrumbItem } from 'carbon-components-svelte';
	import PromiseList from '$components/PromiseList/PromiseList.svelte';

	export let data;
	export let keyword: string | undefined;
	export let category: string | undefined;
	export let party: string | undefined;

	let exploreType: string | undefined;

	$: {
		const { searchParams } = $page.url;
		[keyword, category, party] = ['keyword', 'category', 'party'].map(
			(param) => searchParams.get(param) || undefined
		);
		exploreType = keyword || category || party || 'ไม่พบคำที่ต้องการ';
	}
</script>

<Breadcrumb
	noTrailingSlash
	class="body-compact-01 px-4 py-2 [&>.bx--breadcrumb]:flex [&>.bx--breadcrumb]:flex-wrap"
>
	<BreadcrumbItem href="/">หน้าหลัก</BreadcrumbItem>
	<BreadcrumbItem href="/promises">ติดตามคำสัญญา</BreadcrumbItem>
	<BreadcrumbItem href="/assemblies/">“{exploreType}”</BreadcrumbItem>
</Breadcrumb>
<div class="">
	<div class="mx-auto max-w-[1280px] px-4 py-6 md:px-16 md:py-8">
		<h1 class="fluid-heading-05 text-[20px] md:text-[36px]">คำสัญญาทั้งหมดที่เกี่ยวข้องกับ</h1>
		<h1 class="fluid-heading-05 text-[32px] md:text-[42px]">{exploreType}</h1>
	</div>
	<div class="bg-ui-01">
		<PromiseList summaries={data.promiseSummaries} />
	</div>
</div>
