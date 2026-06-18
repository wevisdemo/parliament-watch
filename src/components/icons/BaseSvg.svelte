<script lang="ts">
	interface Props {
		size?: number;
		title?: string;
		class?: string;
		'aria-label'?: string;
		'aria-labelledby'?: string;
		tabindex?: string | number;
		children?: import('svelte').Snippet;
	}

	let {
		size = 16,
		title,
		class: className,
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledBy,
		tabindex,
		children,
		...rest
	}: Props = $props();

	let labelled = $derived(ariaLabel || ariaLabelledBy || title);
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	fill="currentColor"
	viewBox="0 0 16 16"
	preserveAspectRatio="xMidYMid meet"
	width={size}
	height={size}
	aria-hidden={labelled ? undefined : true}
	role={labelled ? 'img' : undefined}
	focusable={`${Number(tabindex) === 0}`}
	{...rest}
	class={className}
>
	{#if title}<title>{title}</title>{/if}
	{@render children?.()}
</svg>
