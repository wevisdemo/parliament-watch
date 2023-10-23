<script lang="ts">
	import type { HighlightedText } from '$models/search';

	export let textList: HighlightedText[];
	export let textClass: string;
	export let textHighlightClass = 'font-bold';
</script>

<span class="highlighted-text {textClass}">
	{#each textList as text}
		{#if text.highlight}
			<span class={textHighlightClass}>{text.text}</span>
		{:else}
			<span>{text.text}</span>
		{/if}
	{/each}
</span>
