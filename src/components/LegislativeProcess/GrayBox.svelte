<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title?: string;
		titleClass?: string;
		children: Snippet;
	}

	let { title, titleClass = '', children }: Props = $props();
</script>

<div class="mb-2 mt-2 h-full w-full bg-gray-10 p-6">
	{#if title}
		<h5 class="heading-01 {titleClass}">{title}</h5>
	{/if}
	{@render children()}
</div>
