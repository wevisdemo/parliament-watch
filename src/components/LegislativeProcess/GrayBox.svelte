<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title?: string;
		titleClass?: string;
		titleLevel?: 5 | 6;
		children: Snippet;
	}

	let { title, titleClass = '', titleLevel = 6, children }: Props = $props();
</script>

<div class="mb-2 mt-2 h-full w-full bg-gray-10 p-6">
	{#if title}
		<svelte:element this={`h${titleLevel}`} class="heading-01 {titleClass}">{title}</svelte:element>
	{/if}
	{@render children()}
</div>
