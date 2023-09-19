<script lang="ts">
	import { Breadcrumb, BreadcrumbItem } from 'carbon-components-svelte';

	import { page } from '$app/stores';

	const { politician } = $page.data;
</script>

<Breadcrumb
	noTrailingSlash
	class="px-4 py-2 font-sans body-compact-01 [&>.bx--breadcrumb]:flex [&>.bx--breadcrumb]:flex-wrap"
>
	<BreadcrumbItem href="/">หน้าหลัก</BreadcrumbItem>
	<BreadcrumbItem href="/politicians">สส. ชุดที่ 26</BreadcrumbItem>
	<BreadcrumbItem href="/politicians/{politician.firstname}-{politician.lastname}" isCurrentPage
		>{politician.firstname}</BreadcrumbItem
	>
</Breadcrumb>
<slot />
