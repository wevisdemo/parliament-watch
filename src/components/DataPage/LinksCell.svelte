<script lang="ts">
	import { DocumentPdf, NotebookReference } from 'carbon-icons-svelte';

	export let cellValue: { note: string; url: string }[] = [];
</script>

{#if cellValue.length}
	<div class="flex flex-row gap-2">
		{#each cellValue as { note, url } (note)}
			<a href={url} target="_blank" rel="noopener noreferrer" title={note}
				><svelte:component this={url.includes('.pdf') ? DocumentPdf : NotebookReference}
				></svelte:component><span class="sr-only">{note}</span></a
			>
		{/each}
	</div>
{:else}
	<span>-</span>
{/if}
