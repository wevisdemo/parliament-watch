<script lang="ts">
	import { Breadcrumb, BreadcrumbItem, Search } from 'carbon-components-svelte';
	import LawIcom from '../../components/icons/LawIcon.svelte';

	export let data;
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
	<Search light placeholder="ชื่อร่างกฎหมาย หรือ ชื่อผู้เสนอร่าง" />
	<p class="body-compact-01 text-text-03">เช่น สุราก้าวหน้า หรือ เท่าภิภพ ลิ้มจิตรกร</p>
</section>
<div class="bg-ui-01">
	<section class="flex flex-col gap-2 px-4 py-6 max-w-[1280px] mx-auto">
		<header class="flex flex-col items-start justify-between flex-wrap md:flex-row">
			<h2 class="fluid-heading-03">สำรวจตามสถานะ</h2>
			<button type="button" class="helper-text-01 text-blue-60 underline text-right"
				>มีขั้นตอนอะไรบ้างกว่าจะผ่านกฏหมายสำเร็จ?</button
			>
		</header>
	</section>
</div>

<details>
	<summary>Data</summary>
	<pre>{JSON.stringify(data, undefined, 2)}</pre>
</details>
