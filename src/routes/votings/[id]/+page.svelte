<script lang="ts">
	import { Breadcrumb, BreadcrumbItem } from 'carbon-components-svelte';
	export let data;
</script>

<div class="flex flex-col min-h-screen">
	<Breadcrumb
		noTrailingSlash
		class="px-4 py-2 body-compact-01 [&>.bx--breadcrumb]:flex [&>.bx--breadcrumb]:flex-wrap"
	>
		<BreadcrumbItem href="/home">หน้าแรก</BreadcrumbItem>
		<BreadcrumbItem href="/voting">การลงมติ</BreadcrumbItem>
		<BreadcrumbItem>{data.voting.title}</BreadcrumbItem>
	</Breadcrumb>
	<div class="whitespace-pre">
		{JSON.stringify(data, undefined, 2)}
	</div>
</div>