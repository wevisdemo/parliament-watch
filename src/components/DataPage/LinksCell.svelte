<script lang="ts">
	import DocumentPdf from 'carbon-icons-svelte/lib/DocumentPdf.svelte';
	import NotebookReference from 'carbon-icons-svelte/lib/NotebookReference.svelte';

	interface Props {
		cellValue?: { note: string; url: string }[];
	}

	let { cellValue = [] }: Props = $props();
</script>

{#if cellValue.length}
	<div class="flex flex-row gap-2">
		{#each cellValue as { note, url } (note)}
			{@const SvelteComponent = url.includes('.pdf') ? DocumentPdf : NotebookReference}
			<a href={url} target="_blank" rel="noopener noreferrer" title={note}
				><SvelteComponent></SvelteComponent><span class="sr-only">{note}</span></a
			>
		{/each}
	</div>
{:else}
	<span>-</span>
{/if}
