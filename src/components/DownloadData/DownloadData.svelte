<script lang="ts">
	import Download from 'carbon-icons-svelte/lib/Download.svelte';
	import TableSplit from 'carbon-icons-svelte/lib/TableSplit.svelte';
	import DocumentPdf from 'carbon-icons-svelte/lib/DocumentPdf.svelte';
	import type { Link } from '$models/link';

	export let links: Link[];
</script>

<div class="flex flex-col gap-2 border border-solid border-ui-03 rounded-sm p-3">
	<div class="flex items-center gap-1">
		<Download />
		<h2 class="heading-01">ดาวน์โหลดข้อมูล</h2>
	</div>
	<!-- TODO: add link -->
	{#each links as link (link.url)}
		{#if link.url.includes('.pdf')}
			<a href={link.url} class="flex items-center gap-1 mr-auto helper-text-01">
				<DocumentPdf />
				<span>{link.label}</span>
			</a>
		{:else}
			<a href={link.url} class="flex items-center gap-1 mr-auto helper-text-01">
				<TableSplit />
				<span>{link.label}</span>
			</a>
		{/if}
	{/each}
</div>
