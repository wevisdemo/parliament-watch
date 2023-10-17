<script lang="ts">
	export let size = 16;
	export let title: string | undefined = undefined;

	$: labelled = $$props['aria-label'] || $$props['aria-labelledby'] || title;
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
	focusable={`${Number($$props['tabindex']) === 0}`}
	{...$$restProps}
>
	{#if title}<title>{title}</title>{/if}
	<slot />
</svg>
