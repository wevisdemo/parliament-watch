<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { SVGAttributes } from 'svelte/elements';

	interface Props extends SVGAttributes<SVGSVGElement> {
		size?: number;
		title?: string;
		children?: Snippet;
	}

	let {
		size = 16,
		title,
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledBy,
		tabindex,
		children,
		...rest
	}: Props = $props();

	let label = $derived(ariaLabel || ariaLabelledBy || title);
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	fill="currentColor"
	viewBox="0 0 16 16"
	preserveAspectRatio="xMidYMid meet"
	width={size}
	height={size}
	aria-hidden={label ? undefined : true}
	role={label ? 'img' : undefined}
	focusable={`${Number(tabindex) === 0}`}
	{...rest}
>
	{#if title}<title>{title}</title>{/if}
	{@render children?.()}
</svg>
