<script lang="ts">
	import type { CarbonIconProps } from 'carbon-icons-svelte';
	import DocumentBlank from 'carbon-icons-svelte/lib/DocumentBlank.svelte';
	import DocumentPdf from 'carbon-icons-svelte/lib/DocumentPdf.svelte';
	import Download from 'carbon-icons-svelte/lib/Download.svelte';
	import TableSplit from 'carbon-icons-svelte/lib/TableSplit.svelte';
	import type { Component } from 'svelte';

	interface Link {
		label: string;
		url: string;
		icon?: Component<CarbonIconProps>;
	}

	interface Props {
		title?: string;
		icon?: Component<CarbonIconProps>;
		links: Link[];
	}

	let { title = 'ดาวน์โหลดข้อมูล', icon: Icon = Download, links }: Props = $props();
</script>

<div class="flex flex-col gap-2 rounded-sm border border-solid border-ui-03 p-3">
	<div class="flex items-center gap-1">
		<Icon />
		<h2 class="heading-01">{title}</h2>
	</div>

	{#each links as { url, label, icon } (url)}
		{@const LinkIcon = icon
			? icon
			: url.includes('.pdf')
				? DocumentPdf
				: url.includes('.csv')
					? TableSplit
					: DocumentBlank}
		<a
			href={url}
			class="helper-text-01 mr-auto flex items-start gap-1"
			target="_blank"
			rel="noopener noreferrer"
		>
			<LinkIcon class="w-4" />
			<span class="flex-1">{label}</span>
		</a>
	{/each}
</div>
