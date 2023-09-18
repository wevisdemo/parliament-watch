<script lang="ts">
	import { Breadcrumb, BreadcrumbItem } from 'carbon-components-svelte';
</script>

<Breadcrumb noTrailingSlash class="px-4 py-2 font-sans body-compact-01">
	<BreadcrumbItem href="/">หน้าหลัก</BreadcrumbItem>
	<BreadcrumbItem href="/politicians">สส. ชุดที่ 26</BreadcrumbItem>
	<BreadcrumbItem href="/politicians/ปิยบุตร-แสงกนกกุล" isCurrentPage>ปิยบุตร</BreadcrumbItem>
</Breadcrumb>
<slot />
