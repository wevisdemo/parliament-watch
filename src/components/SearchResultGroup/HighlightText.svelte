<script lang="ts">
	import type { HighlightedText } from '$models/search';
	import { twMerge } from 'tailwind-merge';

	interface Props {
		textList: HighlightedText[];
		textClass: string;
		textHighlightClass?: string;
	}

	let { textList, textClass, textHighlightClass = 'font-bold' }: Props = $props();
</script>

<span class={twMerge('highlighted-text', textClass)}>
	{#each textList as text (text.text)}
		{#if text.highlight}
			<span class={textHighlightClass}>{text.text}</span>
		{:else}
			<span>{text.text}</span>
		{/if}
	{/each}
</span>
