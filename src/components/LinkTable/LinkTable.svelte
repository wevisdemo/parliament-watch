<script lang="ts">
	import Download from 'carbon-icons-svelte/lib/Download.svelte';
	import TableSplit from 'carbon-icons-svelte/lib/TableSplit.svelte';
	import DocumentPdf from 'carbon-icons-svelte/lib/DocumentPdf.svelte';
	import { DocumentBlank } from 'carbon-icons-svelte';
	import type { ComponentType } from 'svelte';

	interface Link {
		label: string;
		url: string;
		icon?: ComponentType;
	}

	export let title = 'ดาวน์โหลดข้อมูล';
	export let icon: ComponentType = Download;
	export let links: Link[];
</script>

<div class="flex flex-col gap-2 rounded-sm border border-solid border-ui-03 p-3">
	<div class="flex items-center gap-1">
		<svelte:component this={icon} />
		<h2 class="heading-01">{title}</h2>
	</div>

	{#each links as link (link.url)}
		<a
			href={link.url}
			class="helper-text-01 mr-auto flex items-start gap-1"
			target="_blank"
			rel="noopener noreferrer"
		>
			<svelte:component
				this={link.icon
					? link.icon
					: link.url.includes('.pdf')
						? DocumentPdf
						: link.url.includes('.csv')
							? TableSplit
							: DocumentBlank}
				class="w-4"
			/>
			<span class="flex-1">{link.label}</span>
		</a>
	{/each}
</div>
