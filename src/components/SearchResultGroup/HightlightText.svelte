<script lang="ts">
	import type { HighlightedText } from '$models/search';

	export let textList: HighlightedText[];
</script>

<span class="highlighted-text text-sm text-text-02">
	{#each textList as text}
		{#if text.highlight}
			<span class="font-bold">{text.text}</span>
		{:else}
			<span>{text.text}</span>
		{/if}
	{/each}
</span>
